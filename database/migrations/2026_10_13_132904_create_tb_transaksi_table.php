<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tb_transaksi', function (Blueprint $table) {
            $table->id('id_parkir');
            $table->foreignId('id_kendaraan')->constrained('tb_kendaraan', 'id_kendaraan')->onDelete('cascade');
            $table->foreignId('id_user')->constrained('tb_user', 'id_user')->onDelete('cascade');
            $table->foreignId('id_area')->constrained('tb_area_parkir', 'id_area')->onDelete('cascade');
            $table->dateTime('waktu_masuk');
            $table->dateTime('waktu_keluar')->nullable();
            $table->decimal('biaya_total', 10, 0)->default(0);
            $table->string('status', 10)->default('masuk');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tb_transaksi');
    }
};
