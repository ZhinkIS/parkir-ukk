<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AreaParkirSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tb_area_parkir')->insert([
            ['nama_area' => 'Area A - Depan', 'kapasitas' => 50, 'terisi' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['nama_area' => 'Area B - Samping', 'kapasitas' => 30, 'terisi' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['nama_area' => 'Area C - Belakang', 'kapasitas' => 20, 'terisi' => 0, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
