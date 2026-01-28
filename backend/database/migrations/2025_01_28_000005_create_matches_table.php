<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained('rooms')->cascadeOnDelete();
            $table->dateTime('started_at')->nullable();
            $table->dateTime('ended_at')->nullable();
            $table->enum('status', ['running', 'finished', 'aborted'])->default('running');
            $table->integer('seed')->nullable();
            $table->json('map_config')->nullable();
            $table->timestamps();

            $table->index(['room_id', 'ended_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('matches');
    }
};
