<?php

namespace App\Http\Resources;

use App\Models\Models\TbUser;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin TbUser
 */
class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_user' => $this->id_user,
            'nama_lengkap' => $this->nama_lengkap,
            'username' => $this->username,
            'role' => $this->role,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
