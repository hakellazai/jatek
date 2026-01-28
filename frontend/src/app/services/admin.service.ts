import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, AuditLog } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  private adminTokenSubject = new BehaviorSubject<string | null>(this.loadAdminTokenFromStorage());
  public adminToken$ = this.adminTokenSubject.asObservable();

  constructor(private http: HttpClient) {}

  adminLogin(username: string, password: string): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(`${environment.apiUrl}/admin/login`, {
      username,
      password,
    });
  }

  listUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/admin/users`);
  }

  banUser(userId: number): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/admin/users/${userId}/ban`, {});
  }

  muteUser(userId: number, durationMinutes: number = 60): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/admin/users/${userId}/mute`, {
      duration_minutes: durationMinutes,
    });
  }

  deleteMessage(messageId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/admin/chat/${messageId}`);
  }

  getAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${environment.apiUrl}/admin/audit-logs`);
  }

  setAdminToken(token: string): void {
    localStorage.setItem('admin-token', token);
    this.adminTokenSubject.next(token);
  }

  clearAdminToken(): void {
    localStorage.removeItem('admin-token');
    this.adminTokenSubject.next(null);
  }

  private loadAdminTokenFromStorage(): string | null {
    return localStorage.getItem('admin-token');
  }

  isAdminLoggedIn(): boolean {
    return !!this.adminTokenSubject.value;
  }
}
