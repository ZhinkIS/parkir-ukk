<?php

namespace App\Models\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id_tarif
 * @property string $jenis_kendaraan
 * @property int $tarif_per_jam
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class TbTarif extends Model
{
    protected $table = 'tb_tarif';

    protected $primaryKey = 'id_tarif';

    public $timestamps = true;

    protected $fillable = [
        'jenis_kendaraan',
        'tarif_per_jam',
    ];
}
