<?php

namespace App\Http\Resources;

use App\Models\Models\TbTarif;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin TbTarif
 */
class TarifResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_tarif' => $this->id_tarif,
            'jenis_kendaraan' => $this->jenis_kendaraan,
            'tarif_per_jam' => (int) $this->tarif_per_jam,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
