<?php

namespace App\Services;

use App\Models\GameMatch;
use App\Models\MatchPlayer;
use App\Models\Room;
use App\Models\LeaderboardEntry;
use App\Models\Season;
use Carbon\Carbon;

class GameService
{
    const GRID_WIDTH = 100;
    const GRID_HEIGHT = 100;
    const MATCH_DURATION = 120; // 120 másodperc
    const SCORE_LIMIT = 50;
    const TICK_RATE = 20; // 20 tick/s
    const PLAYER_SIZE = 5;
    const PICKUP_VALUE = 10;

    public function createMatch(Room $room)
    {
        $match = GameMatch::create([
            'room_id' => $room->id,
            'started_at' => now(),
            'status' => 'running',
            'seed' => rand(1000, 9999),
            'map_config' => $this->generateMapConfig(),
        ]);

        // Initialize players
        $players = $room->activeMembers()->with('user')->get();
        foreach ($players as $member) {
            MatchPlayer::create([
                'match_id' => $match->id,
                'user_id' => $member->user_id,
                'score' => 0,
                'kills' => 0,
                'deaths' => 0,
                'is_winner' => false,
                'disconnected_count' => 0,
            ]);
        }

        return $match;
    }

    public function generateMapConfig()
    {
        $pickups = [];
        for ($i = 0; $i < 20; $i++) {
            $pickups[] = [
                'x' => rand(0, self::GRID_WIDTH - 1),
                'y' => rand(0, self::GRID_HEIGHT - 1),
                'value' => self::PICKUP_VALUE,
                'id' => uniqid(),
            ];
        }

        return [
            'width' => self::GRID_WIDTH,
            'height' => self::GRID_HEIGHT,
            'pickups' => $pickups,
        ];
    }

    public function initializeGameState(GameMatch $match)
    {
        $players = $match->players()->with('user')->get();
        $playerStates = [];

        foreach ($players as $i => $player) {
            $playerStates[$player->user_id] = [
                'user_id' => $player->user_id,
                'username' => $player->user->username,
                'x' => (int)(self::GRID_WIDTH / 2) + (($i % 2) * 10 - 5),
                'y' => (int)(self::GRID_HEIGHT / 2) + (($i / 2 | 0) * 10 - 5),
                'score' => 0,
                'velocity' => ['x' => 0, 'y' => 0],
                'disconnected' => false,
            ];
        }

        return [
            'tick' => 0,
            'players' => $playerStates,
            'pickups' => $match->map_config['pickups'],
        ];
    }

    public function handlePlayerInput(GameMatch $match, $userId, array $input)
    {
        // Szerver autoritatív logika
        // Validáció: mozgás max 2 pixel/tick
        $direction = $input['direction'] ?? null;

        if (!in_array($direction, ['up', 'down', 'left', 'right', null])) {
            return false;
        }

        return true;
    }

    public function finishMatch(GameMatch $match)
    {
        $match->update([
            'status' => 'finished',
            'ended_at' => now(),
        ]);

        // Leaderboard frissítés
        $this->updateLeaderboard($match);
    }

    private function updateLeaderboard(GameMatch $match)
    {
        $activeSeason = Season::where('is_active', true)->first();

        foreach ($match->players as $player) {
            // Global leaderboard
            $globalEntry = LeaderboardEntry::firstOrCreate(
                ['user_id' => $player->user_id, 'season_id' => null],
                ['points' => 0, 'matches_played' => 0, 'wins' => 0]
            );

            $globalEntry->increment('matches_played');
            $globalEntry->increment('points', $player->score);
            if ($player->is_winner) {
                $globalEntry->increment('wins');
            }

            // Szezonális leaderboard
            if ($activeSeason) {
                $seasonalEntry = LeaderboardEntry::firstOrCreate(
                    ['user_id' => $player->user_id, 'season_id' => $activeSeason->id],
                    ['points' => 0, 'matches_played' => 0, 'wins' => 0]
                );

                $seasonalEntry->increment('matches_played');
                $seasonalEntry->increment('points', $player->score);
                if ($player->is_winner) {
                    $seasonalEntry->increment('wins');
                }
            }
        }
    }

    public function calculateWinner(GameMatch $match)
    {
        $topPlayer = $match->players()->orderByDesc('score')->first();

        if ($topPlayer) {
            $topPlayer->update(['is_winner' => true]);
        }
    }
}
