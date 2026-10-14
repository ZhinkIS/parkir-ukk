<?php

namespace App\Http\Resources;

use App\Models\Models\TbTransaksi;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin TbTransaksi
 */
class TransaksiResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_parkir' => $this->id_parkir,
            'id_kendaraan' => $this->id_kendaraan,
            'id_user' => $this->id_user,
            'id_area' => $this->id_area,
            'waktu_masuk' => $this->waktu_masuk->toISOString(),
            'waktu_keluar' => $this->waktu_keluar?->toISOString(),
            'biaya_total' => (int) $this->biaya_total,
            'status' => $this->status,
            'kendaraan' => $this->whenLoaded('kendaraan', fn () => new KendaraanResource($this->kendaraan)),
            'user' => $this->whenLoaded('user', fn () => new UserResource($this->user)),
            'area' => $this->whenLoaded('area', fn () => new AreaParkirResource($this->area)),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
