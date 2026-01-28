import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  constructor(private http: HttpClient) {}

  addMessage(message: ChatMessage): void {
    const current = this.messagesSubject.value;
    this.messagesSubject.next([...current, message]);
  }

  clearMessages(): void {
    this.messagesSubject.next([]);
  }

  getMessages(): ChatMessage[] {
    return this.messagesSubject.value;
  }

  // WebSocket-en keresztül küldódik el
  sendMessage(roomId: number, message: string): void {
    // Lásd: websocket.service.ts
  }
}
