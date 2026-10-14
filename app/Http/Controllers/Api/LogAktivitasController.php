<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LogAktivitasResource;
use App\Models\Models\TbLogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LogAktivitasController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = TbLogAktivitas::with('user:id_user,nama_lengkap,username,role')
            ->latest('waktu_aktivitas');

        if ($request->has('user_id')) {
            $query->where('id_user', $request->user_id);
        }

        if ($request->filled('search')) {
            $query->where('aktivitas', 'like', '%'.$request->string('search').'%');
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('waktu_aktivitas', [$request->start_date, $request->end_date]);
        }

        $logs = $query->paginate($request->get('per_page', 15));

        return LogAktivitasResource::collection($logs);
    }

    public static function log(int $userId, string $aktivitas): void
    {
        TbLogAktivitas::create([
            'id_user' => $userId,
            'aktivitas' => $aktivitas,
            'waktu_aktivitas' => now(),
        ]);
    }
}
