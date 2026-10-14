<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TransaksiResource;
use App\Models\Models\TbAreaParkir;
use App\Models\Models\TbKendaraan;
use App\Models\Models\TbTarif;
use App\Models\Models\TbTransaksi;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class TransaksiController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = TbTransaksi::with(['kendaraan', 'user', 'area'])->latest('waktu_masuk');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('waktu_masuk', [$request->start_date, $request->end_date]);
        }

        if ($request->filled('search')) {
            $search = $request->string('search');

            $query->whereHas('kendaraan', function ($q) use ($search) {
                $q->where('plat_nomor', 'like', "%{$search}%")
                    ->orWhere('pemilik', 'like', "%{$search}%");
            });
        }

        $transaksis = $query->paginate($request->get('per_page', 15));

        return TransaksiResource::collection($transaksis);
    }

    public function masuk(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'plat_nomor' => 'required|string|max:15',
            'jenis_kendaraan' => 'required|string|in:motor,mobil,lainnya',
            'warna' => 'required|string|max:20',
            'pemilik' => 'required|string|max:100',
            'id_area' => 'required|exists:tb_area_parkir,id_area',
        ]);

        $area = TbAreaParkir::findOrFail($request->integer('id_area'));

        if ($area->terisi >= $area->kapasitas) {
            return response()->json([
                'success' => false,
                'message' => 'Area parkir penuh',
            ], 400);
        }

        $kendaraan = TbKendaraan::firstOrCreate(
            ['plat_nomor' => $validated['plat_nomor']],
            [
                'jenis_kendaraan' => $validated['jenis_kendaraan'],
                'warna' => $validated['warna'],
                'pemilik' => $validated['pemilik'],
            ]
        );

        $transaksi = DB::transaction(function () use ($request, $kendaraan, $area) {
            $area->increment('terisi');

            $transaksi = TbTransaksi::create([
                'id_kendaraan' => $kendaraan->id_kendaraan,
                'id_user' => $request->user()->id_user,
                'id_area' => $area->id_area,
                'waktu_masuk' => now(),
                'status' => 'masuk',
                'biaya_total' => 0,
            ]);

            return $transaksi;
        });

        LogAktivitasController::log($request->user()->id_user, "Kendaraan masuk: {$kendaraan->plat_nomor} di {$area->nama_area}");

        return (new TransaksiResource($transaksi->load(['kendaraan', 'area'])))->response()->setStatusCode(201);
    }

    public function keluar(Request $request, TbTransaksi $transaksi): JsonResponse|TransaksiResource
    {
        if ($transaksi->status === 'keluar') {
            return response()->json([
                'success' => false,
                'message' => 'Kendaraan sudah keluar',
            ], 400);
        }

        $tarif = TbTarif::where('jenis_kendaraan', $transaksi->kendaraan->jenis_kendaraan)->first();

        if (! $tarif) {
            return response()->json([
                'success' => false,
                'message' => 'Tarif tidak ditemukan untuk jenis kendaraan ini',
            ], 400);
        }

        $waktuKeluar = now();
        $waktuMasuk = Carbon::parse($transaksi->waktu_masuk);
        $durasiJam = ceil($waktuMasuk->diffInMinutes($waktuKeluar) / 60);
        $durasiJam = max(1, $durasiJam); // Minimal 1 jam
        $biayaTotal = $durasiJam * $tarif->tarif_per_jam;

        $transaksi = DB::transaction(function () use ($transaksi, $waktuKeluar, $biayaTotal) {
            $transaksi->update([
                'waktu_keluar' => $waktuKeluar,
                'biaya_total' => $biayaTotal,
                'status' => 'keluar',
            ]);

            $transaksi->area->decrement('terisi');

            return $transaksi->fresh(['kendaraan', 'user', 'area']);
        });

        LogAktivitasController::log($request->user()->id_user, "Kendaraan keluar: {$transaksi->kendaraan->plat_nomor}, Biaya: Rp {$biayaTotal}");

        return new TransaksiResource($transaksi);
    }

    public function struk(TbTransaksi $transaksi): TransaksiResource
    {
        $transaksi->load(['kendaraan', 'user', 'area']);

        return new TransaksiResource($transaksi);
    }
}
