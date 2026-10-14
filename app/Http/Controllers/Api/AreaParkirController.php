<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AreaParkirResource;
use App\Models\Models\TbAreaParkir;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AreaParkirController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $areas = TbAreaParkir::latest()->paginate($request->get('per_page', 15));

        return AreaParkirResource::collection($areas);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama_area' => 'required|string|max:50',
            'kapasitas' => 'required|integer|min:1',
        ]);

        $validated['terisi'] = 0;

        $area = TbAreaParkir::create($validated);

        LogAktivitasController::log($request->user()->id_user, "Menambah area parkir {$validated['nama_area']}");

        return (new AreaParkirResource($area))->response()->setStatusCode(201);
    }

    public function show(TbAreaParkir $area): AreaParkirResource
    {
        return new AreaParkirResource($area);
    }

    public function update(Request $request, TbAreaParkir $area): AreaParkirResource
    {
        $validated = $request->validate([
            'nama_area' => 'required|string|max:50',
            'kapasitas' => 'required|integer|min:1',
        ]);

        $area->update($validated);

        LogAktivitasController::log($request->user()->id_user, "Mengupdate area parkir {$area->nama_area}");

        return new AreaParkirResource($area);
    }

    public function destroy(Request $request, TbAreaParkir $area): JsonResponse
    {
        $nama = $area->nama_area;
        $area->delete();

        LogAktivitasController::log($request->user()->id_user, "Menghapus area parkir {$nama}");

        return response()->json(['success' => true, 'message' => 'Area parkir dihapus']);
    }
}
