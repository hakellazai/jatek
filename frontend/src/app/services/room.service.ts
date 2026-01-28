import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Room } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private roomsSubject = new BehaviorSubject<Room[]>([]);
  public rooms$ = this.roomsSubject.asObservable();

  private currentRoomSubject = new BehaviorSubject<Room | null>(null);
  public currentRoom$ = this.currentRoomSubject.asObservable();

  constructor(private http: HttpClient) {}

  listRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${environment.apiUrl}/rooms`);
  }

  createRoom(name: string, maxPlayers: number, isPrivate: boolean = false): Observable<Room> {
    return this.http.post<Room>(`${environment.apiUrl}/rooms`, {
      name,
      max_players: maxPlayers,
      is_private: isPrivate,
    });
  }

  joinRoom(roomId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/rooms/${roomId}/join`, {});
  }

  leaveRoom(roomId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/rooms/${roomId}/leave`, {});
  }

  toggleReady(roomId: number): Observable<{ is_ready: boolean }> {
    return this.http.post<{ is_ready: boolean }>(`${environment.apiUrl}/rooms/${roomId}/ready`, {});
  }

  startGame(roomId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/rooms/${roomId}/start`, {});
  }

  setCurrentRoom(room: Room | null): void {
    this.currentRoomSubject.next(room);
  }

  getCurrentRoom(): Room | null {
    return this.currentRoomSubject.value;
  }
}
