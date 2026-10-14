<?php

namespace App\Models\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id_parkir
 * @property int $id_kendaraan
 * @property int $id_user
 * @property int $id_area
 * @property Carbon $waktu_masuk
 * @property Carbon|null $waktu_keluar
 * @property int $biaya_total
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read TbKendaraan|null $kendaraan
 * @property-read TbUser|null $user
 * @property-read TbAreaParkir|null $area
 */
class TbTransaksi extends Model
{
    protected $table = 'tb_transaksi';

    protected $primaryKey = 'id_parkir';

    public $timestamps = true;

    protected $fillable = [
        'id_kendaraan',
        'id_user',
        'id_area',
        'waktu_masuk',
        'waktu_keluar',
        'biaya_total',
        'status',
    ];

    protected $casts = [
        'waktu_masuk' => 'datetime',
        'waktu_keluar' => 'datetime',
        'biaya_total' => 'decimal:0',
    ];

    /** @return BelongsTo<TbKendaraan, $this> */
    public function kendaraan(): BelongsTo
    {
        return $this->belongsTo(TbKendaraan::class, 'id_kendaraan', 'id_kendaraan');
    }

    /** @return BelongsTo<TbUser, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(TbUser::class, 'id_user', 'id_user');
    }

    /** @return BelongsTo<TbAreaParkir, $this> */
    public function area(): BelongsTo
    {
        return $this->belongsTo(TbAreaParkir::class, 'id_area', 'id_area');
    }
}
