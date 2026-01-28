import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardService } from '../../services/leaderboard.service';
import { LeaderboardEntry } from '../../models';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="leaderboard-container">
      <h1>Leaderboard</h1>
      <div class="leaderboard-table">
        <table>
          <thead>
            <tr>
              <th>Rang</th>
              <th>Felhasználó</th>
              <th>Pontok</th>
              <th>Meccsek</th>
              <th>Győzelmek</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let entry of entries">
              <td>{{ entry.rank }}</td>
              <td>{{ entry.user }}</td>
              <td>{{ entry.points }}</td>
              <td>{{ entry.matches_played }}</td>
              <td>{{ entry.wins }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .leaderboard-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background: #667eea;
      color: white;
    }
    tr:hover {
      background: #f0f0f0;
    }
  `]
})
export class LeaderboardComponent implements OnInit {
  entries: LeaderboardEntry[] = [];

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit(): void {
    this.leaderboardService.getGlobalLeaderboard().subscribe(
      (entries) => {
        this.entries = entries;
      },
      (error) => console.error('Failed to load leaderboard', error)
    );
  }
}
