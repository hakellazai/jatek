<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'muted_until' => 'datetime',
        'is_banned' => 'boolean',
    ];

    public function rooms()
    {
        return $this->hasMany(RoomMember::class);
    }

    public function hostedRooms()
    {
        return $this->hasMany(Room::class, 'host_user_id');
    }

    public function matchPlayers()
    {
        return $this->hasMany(MatchPlayer::class);
    }

    public function leaderboardEntries()
    {
        return $this->hasMany(LeaderboardEntry::class);
    }

    public function chatMessages()
    {
        return $this->hasMany(ChatMessage::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class, 'admin_user_id');
    }

    public function isMuted()
    {
        return $this->muted_until && $this->muted_until->isFuture();
    }

    public function getStatsAttribute()
    {
        return [
            'matches_played' => $this->matchPlayers()->count(),
            'wins' => $this->matchPlayers()->where('is_winner', true)->count(),
            'total_score' => $this->matchPlayers()->sum('score'),
        ];
    }
}
