<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\GameMatch;

class MatchPlayer extends Model
{
    use HasFactory;

    protected $fillable = [
        'match_id',
        'user_id',
        'score',
        'kills',
        'deaths',
        'is_winner',
        'disconnected_count',
    ];

    protected $casts = [
        'is_winner' => 'boolean',
    ];

    public function match()
    {
        return $this->belongsTo(GameMatch::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
