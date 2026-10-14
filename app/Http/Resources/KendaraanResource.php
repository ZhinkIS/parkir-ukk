<?php

namespace App\Http\Resources;

use App\Models\Models\TbKendaraan;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin TbKendaraan
 */
class KendaraanResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_kendaraan' => $this->id_kendaraan,
            'plat_nomor' => $this->plat_nomor,
            'jenis_kendaraan' => $this->jenis_kendaraan,
            'warna' => $this->warna,
            'pemilik' => $this->pemilik,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
