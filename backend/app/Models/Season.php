<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Season extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'starts_at',
        'ends_at',
        'is_active',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function leaderboardEntries()
    {
        return $this->hasMany(LeaderboardEntry::class);
    }

    public function isActive()
    {
        return $this->is_active && $this->starts_at->isPast() && $this->ends_at->isFuture();
    }
}
