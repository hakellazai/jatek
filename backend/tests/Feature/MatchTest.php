<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Room;
use App\Models\GameMatch;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MatchTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_room_and_start_match()
    {
        $user1 = User::factory()->create(['role' => 'player']);
        $user2 = User::factory()->create(['role' => 'player']);

        $this->actingAs($user1);

        // Szoba létrehozása
        $response = $this->postJson('/api/rooms', [
            'name' => 'Test Room',
            'max_players' => 2,
            'is_private' => false,
        ]);

        $response->assertStatus(201);
        $roomId = $response->json('id');

        // Másik játékos csatlakozása
        $this->actingAs($user2);
        $response = $this->postJson("/api/rooms/{$roomId}/join");
        $response->assertStatus(200);

        // Mindketten ready
        $this->actingAs($user1);
        $this->postJson("/api/rooms/{$roomId}/ready");

        $this->actingAs($user2);
        $this->postJson("/api/rooms/{$roomId}/ready");

        // Meccs indítása
        $this->actingAs($user1);
        $response = $this->postJson("/api/rooms/{$roomId}/start");
        $response->assertStatus(200);

        // Ellenőrzés: szoba státusza 'in_game'
        $room = Room::find($roomId);
        $this->assertEquals('in_game', $room->status);
    }

    public function test_cannot_join_full_room()
    {
        $user1 = User::factory()->create(['role' => 'player']);
        $user2 = User::factory()->create(['role' => 'player']);
        $user3 = User::factory()->create(['role' => 'player']);

        $this->actingAs($user1);
        $response = $this->postJson('/api/rooms', [
            'name' => 'Small Room',
            'max_players' => 2,
        ]);
        $roomId = $response->json('id');

        $this->actingAs($user2);
        $this->postJson("/api/rooms/{$roomId}/join");

        // User3 nem csatlakozhat
        $this->actingAs($user3);
        $response = $this->postJson("/api/rooms/{$roomId}/join");
        $response->assertStatus(400);
    }
}
