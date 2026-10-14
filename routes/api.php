<?php

use App\Http\Controllers\Api\AreaParkirController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\KendaraanController;
use App\Http\Controllers\Api\LogAktivitasController;
use App\Http\Controllers\Api\TarifController;
use App\Http\Controllers\Api\TransaksiController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::middleware('role:petugas,admin,owner')->group(function () {
        Route::get('transaksi', [TransaksiController::class, 'index']);
        Route::get('transaksi/{transaksi}/struk', [TransaksiController::class, 'struk']);
    });

    Route::middleware('role:petugas,admin')->group(function () {
        Route::post('transaksi/masuk', [TransaksiController::class, 'masuk']);
        Route::post('transaksi/{transaksi}/keluar', [TransaksiController::class, 'keluar']);
    });

    Route::middleware('role:admin')->group(function () {
        Route::apiResource('tarif', TarifController::class);
        Route::apiResource('area-parkir', AreaParkirController::class);
        Route::apiResource('kendaraan', KendaraanController::class);
        Route::apiResource('users', UserController::class);
        Route::get('log-aktivitas', [LogAktivitasController::class, 'index']);
    });
});
