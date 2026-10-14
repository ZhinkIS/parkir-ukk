<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            TarifSeeder::class,
            AreaParkirSeeder::class,
            UserSeeder::class,
            KendaraanSeeder::class,
        ]);
    }
}
