<?php

namespace App\Http\Resources;

use App\Models\Models\TbLogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin TbLogAktivitas
 */
class LogAktivitasResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_log' => $this->id_log,
            'id_user' => $this->id_user,
            'aktivitas' => $this->aktivitas,
            'waktu_aktivitas' => $this->waktu_aktivitas->toISOString(),
            'user' => $this->whenLoaded('user', fn () => new UserResource($this->user)),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
