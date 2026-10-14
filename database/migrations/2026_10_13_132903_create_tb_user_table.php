<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tb_user', function (Blueprint $table) {
            $table->id('id_user');
            $table->string('nama_lengkap', 50);
            $table->string('username', 50)->unique();
            $table->string('password', 100);
            $table->string('role', 20);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tb_user');
    }
};
