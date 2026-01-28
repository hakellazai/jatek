import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { Room } from '../../models';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="lobby-container">
      <h1>Szobák Listája</h1>
      <button (click)="openCreateRoom()">Új szoba</button>
      
      <div *ngIf="showCreateForm" class="create-form">
        <input [(ngModel)]="newRoomName" placeholder="Szoba név" />
        <select [(ngModel)]="newRoomMaxPlayers">
          <option value="2">2 játékos</option>
          <option value="3">3 játékos</option>
          <option value="4">4 játékos</option>
          <option value="5">5 játékos</option>
          <option value="6">6 játékos</option>
        </select>
        <button (click)="createRoom()">Létrehozás</button>
      </div>

      <div class="rooms-list">
        <div 
          *ngFor="let room of rooms" 
          class="room-card"
          (click)="joinRoom(room.id)"
        >
          <h3>{{ room.name }}</h3>
          <p>Host: {{ room.host }}</p>
          <p>Játékosok: {{ room.current_players }}/{{ room.max_players }}</p>
          <p>Status: {{ room.status }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .lobby-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .rooms-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .room-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.2s;
    }
    .room-card:hover {
      transform: translateY(-5px);
    }
  `]
})
export class LobbyComponent implements OnInit {
  rooms: Room[] = [];
  showCreateForm = false;
  newRoomName = '';
  newRoomMaxPlayers = '2';

  constructor(private roomService: RoomService, private router: Router) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.listRooms().subscribe(
      (rooms) => {
        this.rooms = rooms;
      },
      (error) => console.error('Failed to load rooms', error)
    );
  }

  openCreateRoom(): void {
    this.showCreateForm = !this.showCreateForm;
  }

  createRoom(): void {
    this.roomService.createRoom(this.newRoomName, parseInt(this.newRoomMaxPlayers)).subscribe(
      (room) => {
        this.roomService.setCurrentRoom(room);
        this.router.navigate(['/room', room.id]);
      },
      (error) => console.error('Failed to create room', error)
    );
  }

  joinRoom(roomId: number): void {
    this.roomService.joinRoom(roomId).subscribe(
      () => {
        const room = this.rooms.find(r => r.id === roomId);
        if (room) {
          this.roomService.setCurrentRoom(room);
          this.router.navigate(['/room', roomId]);
        }
      },
      (error) => console.error('Failed to join room', error)
    );
  }
}
