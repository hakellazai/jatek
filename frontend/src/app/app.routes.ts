import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { LoginComponent } from './components/login/login.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { RoomDetailComponent } from './components/room-detail/room-detail.component';
import { GameComponent } from './components/game/game.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/lobby', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: LoginComponent }, // TODO: Create RegisterComponent
  {
    path: 'lobby',
    component: LobbyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'room/:id',
    component: RoomDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'game/:id',
    component: GameComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'leaderboard',
    component: LeaderboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: LobbyComponent, // TODO: Create ProfileComponent
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      { path: 'login', component: AdminLoginComponent },
      { path: 'panel', component: LobbyComponent }, // TODO: Create AdminPanelComponent
    ],
  },
  { path: '**', redirectTo: '/lobby' },
];
