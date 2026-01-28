import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { RoomService } from '../../services/room.service';
import { WebSocketService } from '../../websocket/websocket.service';
import { ChatMessage } from '../../models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="room-detail-container">
      <h1>Room Detail</h1>
      <div class="room-info">
        <!-- Room info here -->
      </div>
      
      <div class="chat-container">
        <div class="messages">
          <div *ngFor="let msg of messages" class="message">
            <strong>{{ msg.user }}:</strong> {{ msg.message }}
          </div>
        </div>
        <div class="input">
          <input 
            [(ngModel)]="newMessage" 
            placeholder="Üzenet..."
            (keyup.enter)="sendMessage()"
          />
          <button (click)="sendMessage()">Küldés</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .room-detail-container {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 20px;
      padding: 20px;
    }
    .chat-container {
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .messages {
      flex: 1;
      padding: 15px;
      overflow-y: auto;
    }
    .message {
      margin-bottom: 10px;
      padding: 8px;
      background: #f0f0f0;
      border-radius: 4px;
    }
  `]
})
export class RoomDetailComponent implements OnInit, OnDestroy {
  roomId: number = 0;
  messages: ChatMessage[] = [];
  newMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private roomService: RoomService,
    private wsService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params: any) => {
      this.roomId = parseInt(params['id']);
      this.wsService.joinRoom(this.roomId);
    });

    this.wsService.chatMessage$.pipe(takeUntil(this.destroy$)).subscribe((msg) => {
      this.messages.push(msg);
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.wsService.sendChatMessage(this.roomId, this.newMessage);
      this.newMessage = '';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
