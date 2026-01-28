<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Season;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Adminisztrátor felhasználó
        $admin = User::create([
            'username' => 'admin',
            'email' => 'admin@gridconquest.local',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        // 5 dummy player
        $players = [
            ['username' => 'player1', 'email' => 'player1@gridconquest.local', 'password' => 'password123'],
            ['username' => 'player2', 'email' => 'player2@gridconquest.local', 'password' => 'password123'],
            ['username' => 'player3', 'email' => 'player3@gridconquest.local', 'password' => 'password123'],
            ['username' => 'player4', 'email' => 'player4@gridconquest.local', 'password' => 'password123'],
            ['username' => 'player5', 'email' => 'player5@gridconquest.local', 'password' => 'password123'],
        ];

        foreach ($players as $data) {
            User::create([
                'username' => $data['username'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'player',
            ]);
        }

        // Szezon létrehozása
        $season = Season::create([
            'name' => 'Season 1',
            'starts_at' => now()->subDays(30),
            'ends_at' => now()->addDays(30),
            'is_active' => true,
        ]);
    }
}
