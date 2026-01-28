import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LeaderboardEntry } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private globalLeaderboardSubject = new BehaviorSubject<LeaderboardEntry[]>([]);
  public globalLeaderboard$ = this.globalLeaderboardSubject.asObservable();

  private myRankSubject = new BehaviorSubject<any>(null);
  public myRank$ = this.myRankSubject.asObservable();

  constructor(private http: HttpClient) {}

  getGlobalLeaderboard(): Observable<LeaderboardEntry[]> {
    return this.http.get<LeaderboardEntry[]>(`${environment.apiUrl}/leaderboard/global`);
  }

  getSeasonalLeaderboard(seasonId: number): Observable<LeaderboardEntry[]> {
    return this.http.get<LeaderboardEntry[]>(`${environment.apiUrl}/leaderboard/season/${seasonId}`);
  }

  getMyRank(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/leaderboard/me`);
  }

  setGlobalLeaderboard(entries: LeaderboardEntry[]): void {
    this.globalLeaderboardSubject.next(entries);
  }

  setMyRank(rank: any): void {
    this.myRankSubject.next(rank);
  }
}
