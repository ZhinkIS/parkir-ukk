<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TarifSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tb_tarif')->insert([
            ['jenis_kendaraan' => 'motor', 'tarif_per_jam' => 3000, 'created_at' => now(), 'updated_at' => now()],
            ['jenis_kendaraan' => 'mobil', 'tarif_per_jam' => 5000, 'created_at' => now(), 'updated_at' => now()],
            ['jenis_kendaraan' => 'lainnya', 'tarif_per_jam' => 4000, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
