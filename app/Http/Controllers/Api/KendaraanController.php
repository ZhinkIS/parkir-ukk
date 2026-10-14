<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\KendaraanResource;
use App\Models\Models\TbKendaraan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class KendaraanController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = TbKendaraan::latest();

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('plat_nomor', 'like', "%{$request->search}%")
                    ->orWhere('pemilik', 'like', "%{$request->search}%");
            });
        }

        $kendaraans = $query->paginate($request->get('per_page', 15));

        return KendaraanResource::collection($kendaraans);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'plat_nomor' => 'required|string|max:15|unique:tb_kendaraan,plat_nomor',
            'jenis_kendaraan' => 'required|string|in:motor,mobil,lainnya',
            'warna' => 'required|string|max:20',
            'pemilik' => 'required|string|max:100',
        ]);

        $kendaraan = TbKendaraan::create($validated);

        LogAktivitasController::log($request->user()->id_user, "Menambah kendaraan {$validated['plat_nomor']}");

        return (new KendaraanResource($kendaraan))->response()->setStatusCode(201);
    }

    public function show(TbKendaraan $kendaraan): KendaraanResource
    {
        return new KendaraanResource($kendaraan);
    }

    public function update(Request $request, TbKendaraan $kendaraan): KendaraanResource
    {
        $validated = $request->validate([
            'plat_nomor' => 'required|string|max:15|unique:tb_kendaraan,plat_nomor,'.$kendaraan->id_kendaraan.',id_kendaraan',
            'jenis_kendaraan' => 'required|string|in:motor,mobil,lainnya',
            'warna' => 'required|string|max:20',
            'pemilik' => 'required|string|max:100',
        ]);

        $kendaraan->update($validated);

        LogAktivitasController::log($request->user()->id_user, "Mengupdate kendaraan {$kendaraan->plat_nomor}");

        return new KendaraanResource($kendaraan);
    }

    public function destroy(Request $request, TbKendaraan $kendaraan): JsonResponse
    {
        $plat = $kendaraan->plat_nomor;
        $kendaraan->delete();

        LogAktivitasController::log($request->user()->id_user, "Menghapus kendaraan {$plat}");

        return response()->json(['success' => true, 'message' => 'Kendaraan dihapus']);
    }
}
