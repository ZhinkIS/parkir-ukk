<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KendaraanSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tb_kendaraan')->insert([
            ['plat_nomor' => 'B 1234 ABC', 'jenis_kendaraan' => 'mobil', 'warna' => 'Hitam', 'pemilik' => 'Budi Santoso', 'created_at' => now(), 'updated_at' => now()],
            ['plat_nomor' => 'B 5678 DEF', 'jenis_kendaraan' => 'motor', 'warna' => 'Merah', 'pemilik' => 'Siti Rahayu', 'created_at' => now(), 'updated_at' => now()],
            ['plat_nomor' => 'B 9012 GHI', 'jenis_kendaraan' => 'mobil', 'warna' => 'Putih', 'pemilik' => 'Ahmad Wijaya', 'created_at' => now(), 'updated_at' => now()],
            ['plat_nomor' => 'B 3456 JKL', 'jenis_kendaraan' => 'motor', 'warna' => 'Biru', 'pemilik' => 'Dewi Lestari', 'created_at' => now(), 'updated_at' => now()],
            ['plat_nomor' => 'B 7890 MNO', 'jenis_kendaraan' => 'lainnya', 'warna' => 'Kuning', 'pemilik' => 'PT. Logistik Jaya', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
