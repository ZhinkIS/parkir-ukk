<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Models\TbUser;
use App\Models\Models\TbTarif;
use App\Models\Models\TbAreaParkir;
use App\Models\Models\TbKendaraan;
use App\Models\Models\TbTransaksi;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $totalUsers = TbUser::count();
        $totalTarif = TbTarif::count();
        $totalAreaParkir = TbAreaParkir::count();
        $totalKendaraan = TbKendaraan::count();

        // Stats for petugas
        $today = now()->startOfDay();
        $kendaraanMasukToday = TbTransaksi::where('status', 'masuk')
            ->where('created_at', '>=', $today)
            ->count();
        $kendaraanKeluarToday = TbTransaksi::where('status', 'keluar')
            ->where('created_at', '>=', $today)
            ->count();
        $parkirAktif = TbTransaksi::where('status', 'masuk')->count();
        $pendapatanToday = TbTransaksi::where('status', 'keluar')
            ->where('created_at', '>=', $today)
            ->sum('biaya_total');

        // Stats for owner
        $totalPendapatan = TbTransaksi::where('status', 'keluar')->sum('biaya_total');
        $transaksiBulanIni = TbTransaksi::where('status', 'keluar')
            ->where('created_at', '>=', now()->startOfMonth())
            ->count();
        $rataRataPerHari = $transaksiBulanIni > 0
            ? TbTransaksi::where('status', 'keluar')
                ->where('created_at', '>=', now()->startOfMonth())
                ->avg('biaya_total')
            : 0;
        $areaTerpadat = TbAreaParkir::orderByDesc('terisi')->first();

        return response()->json([
            'success' => true,
            'data' => [
                'admin' => [
                    'total_users' => $totalUsers,
                    'total_tarif' => $totalTarif,
                    'total_area_parkir' => $totalAreaParkir,
                    'total_kendaraan' => $totalKendaraan,
                ],
                'petugas' => [
                    'kendaraan_masuk_today' => $kendaraanMasukToday,
                    'kendaraan_keluar_today' => $kendaraanKeluarToday,
                    'parkir_aktif' => $parkirAktif,
                    'pendapatan_today' => $pendapatanToday,
                ],
                'owner' => [
                    'total_pendapatan' => $totalPendapatan,
                    'transaksi_bulan_ini' => $transaksiBulanIni,
                    'rata_rata_per_hari' => round($rataRataPerHari),
                    'area_terpadat' => $areaTerpadat
                        ? $areaTerpadat->nama_area . ' - ' . round(($areaTerpadat->terisi / $areaTerpadat->kapasitas) * 100) . '%'
                        : '-',
                ],
            ],
        ]);
    }
}