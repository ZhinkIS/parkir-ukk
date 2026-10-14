<?php

namespace App\Models\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id_log
 * @property int $id_user
 * @property string $aktivitas
 * @property Carbon $waktu_aktivitas
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read TbUser|null $user
 */
class TbLogAktivitas extends Model
{
    protected $table = 'tb_log_aktivitas';

    protected $primaryKey = 'id_log';

    public $timestamps = true;

    protected $fillable = [
        'id_user',
        'aktivitas',
        'waktu_aktivitas',
    ];

    protected $casts = [
        'waktu_aktivitas' => 'datetime',
    ];

    /** @return BelongsTo<TbUser, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(TbUser::class, 'id_user', 'id_user');
    }
}
