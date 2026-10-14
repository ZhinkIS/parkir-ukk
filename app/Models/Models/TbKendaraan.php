<?php

namespace App\Models\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id_kendaraan
 * @property string $plat_nomor
 * @property string $jenis_kendaraan
 * @property string $warna
 * @property string $pemilik
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, TbTransaksi> $transaksis
 */
class TbKendaraan extends Model
{
    protected $table = 'tb_kendaraan';

    protected $primaryKey = 'id_kendaraan';

    public $timestamps = true;

    protected $fillable = [
        'plat_nomor',
        'jenis_kendaraan',
        'warna',
        'pemilik',
    ];

    /** @return HasMany<TbTransaksi, $this> */
    public function transaksis(): HasMany
    {
        return $this->hasMany(TbTransaksi::class, 'id_kendaraan', 'id_kendaraan');
    }
}
