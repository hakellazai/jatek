export interface User {
  id: number;
  username: string;
  email: string;
  role: 'player' | 'admin';
  is_banned: boolean;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PlayerStats {
  matches_played: number;
  wins: number;
  total_score: number;
}

export interface Room {
  id: number;
  name: string;
  host: string;
  max_players: number;
  current_players: number;
  is_private: boolean;
  status: 'open' | 'in_game' | 'closed';
  created_at: string;
}

export interface RoomMember {
  id: number;
  user_id: number;
  room_id: number;
  is_ready: boolean;
  joined_at: string;
  left_at: string | null;
}

export interface Match {
  id: number;
  room_id: number;
  started_at: string;
  ended_at: string | null;
  status: 'running' | 'finished' | 'aborted';
  players: MatchPlayer[];
}

export interface MatchPlayer {
  id: number;
  match_id: number;
  user_id: number;
  username: string;
  score: number;
  kills: number;
  deaths: number;
  is_winner: boolean;
}

export interface GameState {
  tick: number;
  players: { [userId: number]: PlayerGameState };
  pickups: Pickup[];
}

export interface PlayerGameState {
  user_id: number;
  username: string;
  x: number;
  y: number;
  score: number;
  velocity: { x: number; y: number };
  disconnected: boolean;
}

export interface Pickup {
  id: string;
  x: number;
  y: number;
  value: number;
}

export interface LeaderboardEntry {
  rank: number;
  user: string;
  points: number;
  matches_played: number;
  wins: number;
}

export interface ChatMessage {
  id: number;
  room_id: number;
  user: string;
  message: string;
  created_at: string;
  is_deleted: boolean;
}

export interface AuditLog {
  id: number;
  admin: string;
  action: string;
  payload: any;
  created_at: string;
}
