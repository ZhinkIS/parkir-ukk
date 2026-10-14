<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TarifResource;
use App\Models\Models\TbTarif;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TarifController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $tarifs = TbTarif::latest()->paginate($request->get('per_page', 15));

        return TarifResource::collection($tarifs);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'jenis_kendaraan' => 'required|string|in:motor,mobil,lainnya',
            'tarif_per_jam' => 'required|integer|min:0',
        ]);

        $tarif = TbTarif::create($validated);

        LogAktivitasController::log($request->user()->id_user, "Menambah tarif {$validated['jenis_kendaraan']}");

        return (new TarifResource($tarif))->response()->setStatusCode(201);
    }

    public function show(TbTarif $tarif): TarifResource
    {
        return new TarifResource($tarif);
    }

    public function update(Request $request, TbTarif $tarif): TarifResource
    {
        $validated = $request->validate([
            'tarif_per_jam' => 'required|integer|min:0',
        ]);

        $tarif->update($validated);

        LogAktivitasController::log($request->user()->id_user, "Mengupdate tarif {$tarif->jenis_kendaraan}");

        return new TarifResource($tarif);
    }

    public function destroy(Request $request, TbTarif $tarif): JsonResponse
    {
        $jenis = $tarif->jenis_kendaraan;
        $tarif->delete();

        LogAktivitasController::log($request->user()->id_user, "Menghapus tarif {$jenis}");

        return response()->json(['success' => true, 'message' => 'Tarif dihapus']);
    }
}
