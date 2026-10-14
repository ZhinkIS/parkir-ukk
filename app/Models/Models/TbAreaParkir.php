<?php

namespace App\Models\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id_area
 * @property string $nama_area
 * @property int $kapasitas
 * @property int $terisi
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, TbTransaksi> $transaksis
 */
class TbAreaParkir extends Model
{
    protected $table = 'tb_area_parkir';

    protected $primaryKey = 'id_area';

    public $timestamps = true;

    protected $fillable = [
        'nama_area',
        'kapasitas',
        'terisi',
    ];

    /** @return HasMany<TbTransaksi, $this> */
    public function transaksis(): HasMany
    {
        return $this->hasMany(TbTransaksi::class, 'id_area', 'id_area');
    }
}
