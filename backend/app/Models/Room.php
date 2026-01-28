<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'host_user_id',
        'is_private',
        'max_players',
        'status',
    ];

    protected $casts = [
        'is_private' => 'boolean',
    ];

    public function host()
    {
        return $this->belongsTo(User::class, 'host_user_id');
    }

    public function members()
    {
        return $this->hasMany(RoomMember::class);
    }

    public function activeMembers()
    {
        return $this->members()->whereNull('left_at');
    }

    public function matches()
    {
        return $this->hasMany(GameMatch::class);
    }

    public function chatMessages()
    {
        return $this->hasMany(ChatMessage::class);
    }

    public function isFull()
    {
        return $this->activeMembers()->count() >= $this->max_players;
    }

    public function isOpen()
    {
        return $this->status === 'open';
    }
}
