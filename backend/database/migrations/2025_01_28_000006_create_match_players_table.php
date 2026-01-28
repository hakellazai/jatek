<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('match_players', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_id')->constrained('matches')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->integer('score')->default(0);
            $table->integer('kills')->default(0);
            $table->integer('deaths')->default(0);
            $table->boolean('is_winner')->default(false);
            $table->integer('disconnected_count')->default(0);
            $table->timestamps();

            $table->index('match_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('match_players');
    }
};
