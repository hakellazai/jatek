<?php

namespace App\Http\Controllers;

use App\Models\GameMatch;
use App\Models\MatchPlayer;
use Illuminate\Http\Request;

class MatchController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->query('userId');

        $matches = GameMatch::query()
            ->whereHas('players', function ($q) use ($userId) {
                if ($userId) {
                    $q->where('user_id', $userId);
                }
            })
            ->with('players.user')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($matches);
    }

    public function show(GameMatch $match)
    {
        $match = $match->load('players.user', 'room');

        return response()->json($match);
    }
}
