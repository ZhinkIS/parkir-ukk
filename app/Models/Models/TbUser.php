<?php

namespace App\Models\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property int $id_user
 * @property string $nama_lengkap
 * @property string $username
 * @property string $password
 * @property string $role
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, TbTransaksi> $transaksis
 * @property-read Collection<int, TbLogAktivitas> $logAktivitas
 */
class TbUser extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'tb_user';

    protected $primaryKey = 'id_user';

    public $timestamps = true;

    protected $fillable = [
        'nama_lengkap',
        'username',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    /** @return HasMany<TbTransaksi, $this> */
    public function transaksis(): HasMany
    {
        return $this->hasMany(TbTransaksi::class, 'id_user', 'id_user');
    }

    /** @return HasMany<TbLogAktivitas, $this> */
    public function logAktivitas(): HasMany
    {
        return $this->hasMany(TbLogAktivitas::class, 'id_user', 'id_user');
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isPetugas(): bool
    {
        return $this->role === 'petugas';
    }

    public function isOwner(): bool
    {
        return $this->role === 'owner';
    }
}
