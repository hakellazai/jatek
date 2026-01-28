import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState, PlayerGameState } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gameStateSubject = new BehaviorSubject<GameState | null>(null);
  public gameState$ = this.gameStateSubject.asObservable();

  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  public isPlaying$ = this.isPlayingSubject.asObservable();

  constructor(private http: HttpClient) {}

  getMatches(userId?: number): Observable<any> {
    let params: any = {};
    if (userId) {
      params = { userId };
    }
    return this.http.get<any>(`${environment.apiUrl}/matches`, { params });
  }

  getMatch(matchId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/matches/${matchId}`);
  }

  setGameState(state: GameState): void {
    this.gameStateSubject.next(state);
  }

  getGameState(): GameState | null {
    return this.gameStateSubject.value;
  }

  setIsPlaying(playing: boolean): void {
    this.isPlayingSubject.next(playing);
  }

  resetGameState(): void {
    this.gameStateSubject.next(null);
    this.isPlayingSubject.next(false);
  }

  // Input handling (kliens inputot küld szerver-nek)
  sendInput(direction: string | null, action: string | null = null): void {
    // WebSocket-en keresztül küldódik el (lásd websocket.service.ts)
  }
}
