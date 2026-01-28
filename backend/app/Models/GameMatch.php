<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameMatch extends Model
{
    use HasFactory;
    
    protected $table = 'matches';

    protected $fillable = [
        'room_id',
        'started_at',
        'ended_at',
        'status',
        'seed',
        'map_config',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'map_config' => 'array',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function players()
    {
        return $this->hasMany(MatchPlayer::class);
    }

    public function isRunning()
    {
        return $this->status === 'running';
    }

    public function isFinished()
    {
        return $this->status === 'finished';
    }
}
