<?php

namespace App\Http\Resources;

use App\Models\Models\TbAreaParkir;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin TbAreaParkir
 */
class AreaParkirResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_area' => $this->id_area,
            'nama_area' => $this->nama_area,
            'kapasitas' => $this->kapasitas,
            'terisi' => $this->terisi,
            'tersedia' => $this->kapasitas - $this->terisi,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
