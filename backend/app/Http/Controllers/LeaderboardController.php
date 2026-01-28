<?php

namespace App\Http\Controllers;

use App\Models\LeaderboardEntry;
use App\Models\Season;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function global()
    {
        $entries = LeaderboardEntry::whereNull('season_id')
            ->with('user')
            ->orderByDesc('points')
            ->limit(100)
            ->get()
            ->map(function ($entry, $index) {
                return [
                    'rank' => $index + 1,
                    'user' => $entry->user->username,
                    'points' => $entry->points,
                    'matches_played' => $entry->matches_played,
                    'wins' => $entry->wins,
                ];
            });

        return response()->json($entries);
    }

    public function bySeason($seasonId)
    {
        $season = Season::findOrFail($seasonId);

        $entries = LeaderboardEntry::where('season_id', $seasonId)
            ->with('user')
            ->orderByDesc('points')
            ->limit(100)
            ->get()
            ->map(function ($entry, $index) {
                return [
                    'rank' => $index + 1,
                    'user' => $entry->user->username,
                    'points' => $entry->points,
                    'matches_played' => $entry->matches_played,
                    'wins' => $entry->wins,
                ];
            });

        return response()->json($entries);
    }

    public function myRank(Request $request)
    {
        $userId = auth()->id();

        $globalRank = LeaderboardEntry::whereNull('season_id')
            ->where('user_id', $userId)
            ->first();

        $activeSeason = Season::where('is_active', true)->first();
        $seasonalRank = null;

        if ($activeSeason) {
            $seasonalRank = LeaderboardEntry::where('season_id', $activeSeason->id)
                ->where('user_id', $userId)
                ->first();
        }

        return response()->json([
            'global' => $globalRank,
            'seasonal' => $seasonalRank,
        ]);
    }
}
