import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { GameState, ChatMessage } from '../models';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket | null = null;
  private connectedSubject = new BehaviorSubject<boolean>(false);
  public connected$ = this.connectedSubject.asObservable();

  // Event subjects
  public roomState$ = new Subject<any>();
  public matchStarted$ = new Subject<any>();
  public matchState$ = new Subject<GameState>();
  public matchEnded$ = new Subject<any>();
  public chatMessage$ = new Subject<ChatMessage>();
  public error$ = new Subject<any>();

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket(): void {
    if (!this.socket) {
      this.socket = io(environment.wsUrl, {
        auth: (callback: (data: any) => void) => {
          const token = localStorage.getItem('token');
          callback({ token });
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10,
      });

      this.setupEventListeners();
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.connectedSubject.next(true);
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.connectedSubject.next(false);
    });

    this.socket.on('room.state', (data: any) => {
      this.roomState$.next(data);
    });

    this.socket.on('match.started', (data: any) => {
      this.matchStarted$.next(data);
    });

    this.socket.on('match.state', (data: GameState) => {
      this.matchState$.next(data);
    });

    this.socket.on('match.ended', (data: any) => {
      this.matchEnded$.next(data);
    });

    this.socket.on('chat.message', (data: ChatMessage) => {
      this.chatMessage$.next(data);
    });

    this.socket.on('error', (data: any) => {
      this.error$.next(data);
    });
  }

  public emit(event: string, data?: any): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    }
  }

  public joinRoom(roomId: number): void {
    this.emit('room.join', { roomId });
  }

  public leaveRoom(roomId: number): void {
    this.emit('room.leave', { roomId });
  }

  public setReady(roomId: number, ready: boolean): void {
    this.emit('room.ready', { roomId, ready });
  }

  public sendGameInput(matchId: number, direction: string | null, action: string | null = null): void {
    this.emit('match.input', {
      matchId,
      direction,
      action,
      ts: Date.now(),
    });
  }

  public sendChatMessage(roomId: number, message: string): void {
    this.emit('chat.send', { roomId, message });
  }

  public ping(): void {
    this.emit('ping', { ts: Date.now() });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  public isConnected(): boolean {
    return this.connectedSubject.value;
  }
}
