<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tb_user')->insert([
            [
                'nama_lengkap' => 'Administrator',
                'username' => 'admin',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_lengkap' => 'Petugas Parkir',
                'username' => 'petugas',
                'password' => Hash::make('password123'),
                'role' => 'petugas',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_lengkap' => 'Owner Parkir',
                'username' => 'owner',
                'password' => Hash::make('password123'),
                'role' => 'owner',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
