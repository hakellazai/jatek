import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service';
import { WebSocketService } from '../../websocket/websocket.service';
import { GameState } from '../../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="game-container">
      <canvas 
        #gameCanvas 
        width="800" 
        height="600"
        (keydown)="onKeyDown($event)"
        (keyup)="onKeyUp($event)"
        tabindex="0"
      ></canvas>
      <div class="scoreboard">
        <div *ngFor="let player of getPlayers()" class="player-score">
          {{ player.username }}: {{ player.score }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .game-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: #333;
      gap: 20px;
    }
    canvas {
      background: #1a1a1a;
      border: 2px solid #666;
      outline: none;
    }
    .scoreboard {
      background: white;
      padding: 20px;
      border-radius: 8px;
      width: 200px;
    }
    .player-score {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
  `]
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild('gameCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  matchId: number = 0;
  gameState: GameState | null = null;
  private destroy$ = new Subject<void>();
  private currentDirection: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private wsService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params: any) => {
      this.matchId = parseInt(params['id']);
    });

    this.wsService.matchState$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      this.gameState = state;
      this.render();
    });

    this.wsService.matchEnded$.pipe(takeUntil(this.destroy$)).subscribe((results) => {
      console.log('Match ended', results);
      // Handle match end
    });

    // Focus on canvas
    setTimeout(() => this.canvasRef.nativeElement.focus(), 100);
  }

  onKeyDown(event: KeyboardEvent): void {
    const directions: { [key: string]: string } = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
    };

    if (directions[event.key]) {
      this.currentDirection = directions[event.key];
      this.wsService.sendGameInput(this.matchId, this.currentDirection);
      event.preventDefault();
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    this.currentDirection = null;
    this.wsService.sendGameInput(this.matchId, null);
  }

  getPlayers() {
    if (!this.gameState) return [];
    return Object.values(this.gameState.players);
  }

  private render(): void {
    if (!this.canvasRef || !this.gameState) return;

    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Scale to canvas
    const scaleX = canvas.width / 100;
    const scaleY = canvas.height / 100;

    // Draw players
    ctx.fillStyle = '#00ff00';
    for (const player of Object.values(this.gameState.players)) {
      ctx.fillRect(player.x * scaleX, player.y * scaleY, 5 * scaleX, 5 * scaleY);
    }

    // Draw pickups
    ctx.fillStyle = '#ffff00';
    for (const pickup of this.gameState.pickups) {
      ctx.beginPath();
      ctx.arc(pickup.x * scaleX, pickup.y * scaleY, 3 * scaleX, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
