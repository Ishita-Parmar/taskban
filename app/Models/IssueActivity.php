<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IssueActivity extends Model
{
    public $timestamps = false;

    protected static function booted()
    {
        static::creating(function ($activity) {
            $activity->created_at = $activity->created_at ?: now();
        });
    }

    protected $fillable = [
        'issue_id',
        'user_id',
        'activity_type',
        'old_value',
        'new_value',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function issue(): BelongsTo
    {
        return $this->belongsTo(Issue::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
