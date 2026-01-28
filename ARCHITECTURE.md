# Grid Conquest - Architekturális Dokumentáció

## 📐 Rendszer Áttekintés

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────┐
│  Browser        │         │  Backend         │         │  Database    │
│  (Angular SPA)  │◄────────►│  (Laravel)       │◄────────►│  (MySQL)     │
│  Port: 4200     │  HTTP   │  Port: 8000      │  SQL     │              │
└────────┬────────┘         └────────┬─────────┘         └──────────────┘
         │                           │
         │      WebSocket            │
         │      (Socket.IO)          │
         │                           │
         │     Port: 6001            │
         └───────────────────────────┘
              Real-time Sync
         (Reverb / Pusher compatible)
```

---

## 🔐 Autentikáció

### Token-Based Authentication (Sanctum)

**Játékos (Player):**
```
1. POST /auth/register || POST /auth/login
2. Kapja: Bearer Token
3. HTTP Header: Authorization: Bearer {token}
4. Token storage: localStorage (browser)
```

**Admin:**
```
1. POST /admin/login
2. Kapja: Bearer Token (különböző secret key)
3. HTTP Header: Authorization: Bearer {admin_token}
4. Admin Policy ellenőrzés: user.role === 'admin'
```

---

## 🎮 Game Architecture

### Szerver-Autoritatív Design

```
Client Input          Server Computation       State Broadcast
(Move command)    ─→  (Validate + Compute) ─→  (All clients)
  ↓                         ↓
- Direction only        - Collision check      - Authoritative
- Timestamp             - Score calculation      state
- No position           - Pickup collection    - Anti-cheat
```

### Game Loop

```
┌─────────────────────────────────────┐
│ Server-side Game Loop (20 Hz)       │
├─────────────────────────────────────┤
│ 1. Gather client inputs (50ms)      │
│ 2. Update player positions          │
│ 3. Check collisions                 │
│ 4. Update pickups                   │
│ 5. Calculate scores                 │
│ 6. Check win conditions             │
│ 7. Broadcast state to all clients   │
│ 8. Continue...                      │
└─────────────────────────────────────┘
     Repeat every ~50ms (20 Hz)
```

### Anti-Cheat Measures

1. **Input Validation**: Szerver validálja az irányokat
2. **Position Authority**: Csak szerver számít pozíciókat
3. **Score Authority**: Pontok csak szerverről
4. **Rate Limiting**: Input throttle (max 20 cmd/sec)
5. **Signature Verification**: Token-based auth

---

## 🏗️ Backend Architecture (Laravel)

### MVC + Service Layer

```
Routes (api.php)
    ↓
Controllers (Http/Controllers/)
    ├─→ AuthController
    ├─→ RoomController
    ├─→ MatchController
    ├─→ LeaderboardController
    ├─→ AdminController
    └─→ ChatController
    ↓
Services (Services/)
    └─→ GameService (Business Logic)
    ↓
Models (Models/)
    ├─→ User
    ├─→ Room
    ├─→ Match
    └─→ LeaderboardEntry
    ↓
Database (MySQL)
```

### Database Schema Normalization

**Táblák:**

```
users (10 cols)
  ├─ PK: id
  └─ Indexek: username, email, role

rooms (6 cols)
  ├─ PK: id
  ├─ FK: host_user_id → users.id
  └─ Status: open, in_game, closed

room_members (5 cols)
  ├─ PK: id
  ├─ FK: room_id, user_id
  └─ Unique: (room_id, user_id)

matches (7 cols)
  ├─ PK: id
  ├─ FK: room_id
  ├─ Status: running, finished, aborted
  └─ Index: (room_id, ended_at)

match_players (7 cols)
  ├─ PK: id
  ├─ FK: match_id, user_id
  └─ Index: match_id

leaderboard_entries (6 cols)
  ├─ FK: season_id (nullable), user_id
  └─ Index: (season_id, points DESC)

seasons (5 cols)
  ├─ PK: id
  ├─ Status: active/inactive
  └─ Timeframe: starts_at, ends_at

chat_messages (6 cols)
  ├─ FK: room_id, user_id
  └─ Index: (room_id, created_at DESC)

audit_logs (5 cols)
  ├─ FK: admin_user_id
  ├─ Action: BAN_USER, MUTE_USER, DELETE_MESSAGE
  └─ Payload: JSON
```

### API Rate Limiting

```
Auth Endpoints:     60 req/min per IP
Chat:              60 req/min per user
Game Input:        20 msg/sec per user
Admin:             30 req/min per admin
Default:           1000 req/min per user
```

---

## 🌐 Frontend Architecture (Angular)

### Standalone Components + RxJS

```
AppComponent
  ├─ AppRouting
  │   ├─ /login → LoginComponent
  │   ├─ /lobby → LobbyComponent
  │   ├─ /room/:id → RoomDetailComponent
  │   ├─ /game/:id → GameComponent
  │   ├─ /leaderboard → LeaderboardComponent
  │   ├─ /profile → ProfileComponent
  │   └─ /admin/* → AdminPanelComponent
  │
  └─ Services (RxJS BehaviorSubject)
      ├─ AuthService
      │   ├─ currentUser$: BehaviorSubject<User>
      │   ├─ token$: BehaviorSubject<string>
      │   └─ Methods: login(), register(), logout()
      │
      ├─ RoomService
      │   ├─ rooms$: BehaviorSubject<Room[]>
      │   ├─ currentRoom$: BehaviorSubject<Room>
      │   └─ Methods: listRooms(), joinRoom(), startGame()
      │
      ├─ GameService
      │   ├─ gameState$: BehaviorSubject<GameState>
      │   ├─ isPlaying$: BehaviorSubject<boolean>
      │   └─ Methods: sendInput()
      │
      ├─ ChatService
      │   ├─ messages$: Subject<ChatMessage[]>
      │   └─ Methods: addMessage(), sendMessage()
      │
      ├─ LeaderboardService
      │   ├─ globalLeaderboard$: BehaviorSubject
      │   ├─ myRank$: BehaviorSubject
      │   └─ Methods: getGlobalLeaderboard()
      │
      ├─ WebSocketService (Socket.IO)
      │   ├─ connected$: BehaviorSubject<boolean>
      │   ├─ Events: roomState$, matchState$, chatMessage$
      │   └─ Methods: emit(), joinRoom(), sendInput()
      │
      └─ AdminService
          ├─ users$: BehaviorSubject<User[]>
          ├─ adminToken$: BehaviorSubject<string>
          └─ Methods: banUser(), muteUser(), deleteMessage()

Guards:
  ├─ AuthGuard (checkAuth)
  └─ AdminGuard (checkAdminRole)

Interceptors:
  └─ AuthInterceptor (adds Authorization header)
```

### State Management Pattern

```
RxJS Subject Pattern (Observable-based):

┌──────────────────────────────────────┐
│ Component                            │
│ .subscribe(service.property$)        │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│ BehaviorSubject / Subject            │
│ (State container)                    │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│ Service                              │
│ .next() / .emit()                    │
│ (State update)                       │
└──────────────────────────────────────┘
           ↓
┌──────────────────────────────────────┐
│ HTTP / WebSocket                     │
│ (External data source)               │
└──────────────────────────────────────┘
```

### Canvas Game Rendering

```
GameComponent:
1. Subscribe to gameState$ (20 Hz updates)
2. On each update:
   - Clear canvas
   - Scale game coords → canvas pixels
   - Draw players (green squares)
   - Draw pickups (yellow circles)
   - Display scoreboard
3. Keyboard input → WebSocket.emit('match.input')
4. Game ends → Navigate to results
```

---

## 🔌 WebSocket (Real-Time Sync)

### Socket.IO Configuration

```
Client (Angular):
├─ Server: ws://localhost:6001
├─ Auth: { token: localStorage.getItem('token') }
├─ Reconnect: true (10 attempts, 1-5s delay)
└─ Auto-reconnect on connection loss

Server (Laravel Reverb):
├─ Host: 0.0.0.0
├─ Port: 6001
├─ Adapter: Redis (optional)
└─ Pusher-compatible API
```

### Event Flow

```
┌─────────────────────────────────────────────────────┐
│ 1. Client Joins Room                                │
├─────────────────────────────────────────────────────┤
│ Client sends: socket.emit('room.join', {roomId})   │
│ Server receives: Validates member                   │
│ Server broadcasts: room.state to all in room       │
│ Client updates: RoomService.currentRoom$           │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 2. Game Running (20 Hz)                            │
├─────────────────────────────────────────────────────┤
│ Client sends: match.input { direction, ts }        │
│ Server processes input                             │
│ Server broadcasts: match.state { tick, players }   │
│ Client renders: Canvas update                      │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ 3. Chat Message                                     │
├─────────────────────────────────────────────────────┤
│ Client sends: chat.send { roomId, message }        │
│ Server saves: ChatMessage model                    │
│ Server broadcasts: chat.message to all in room    │
│ Client appends: ChatService.messages$              │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagrams

### Login Sequence

```
1. User enters credentials
   ↓
2. LoginComponent → AuthService.login()
   ↓
3. POST /api/auth/login
   ↓
4. Backend validates, returns token + user
   ↓
5. AuthService.setAuthData(token, user)
   ↓
6. localStorage + BehaviorSubject updated
   ↓
7. AuthGuard.canActivate() ✓
   ↓
8. Navigate to /lobby
```

### Game Match Flow

```
1. 2+ players in room, all ready
   ↓
2. Host clicks "Start Game"
   ↓
3. RoomController.start() validates
   ↓
4. GameService.createMatch() → DB
   ↓
5. Match created, status = 'running'
   ↓
6. WebSocket broadcast: match.started
   ↓
7. All clients navigate to /game/:id
   ↓
8. GameComponent subscribes to WebSocket
   ↓
9. Server game loop (20 Hz):
   - Receives input from clients
   - Updates positions
   - Broadcasts match.state
   ↓
10. Clients render canvas
    ↓
11. Match timeout or score reached
    ↓
12. GameService.finishMatch()
    ↓
13. Leaderboard updated
    ↓
14. WebSocket broadcast: match.ended
    ↓
15. Redirect to results page
```

---

## 🔄 Reconnection Strategy

```
Client disconnected?
    ↓
WebSocketService detects
    ↓
Auto-reconnect timer starts
    ↓
Attempt 1: 1 second wait
Attempt 2: 2 second wait
Attempt 3: 3 second wait
...
Attempt 10: 5 second wait
    ↓
Connected again?
    ├─ YES: Re-subscribe to room/match
    ├─ NO: Show "Connection Lost" message
    └─ Queue pending messages during offline
```

---

## 📈 Performance Considerations

### Frontend
- **Change Detection**: Default (not OnPush yet)
- **Bundle Size**: ~500KB (gzip)
- **Render**: 60 FPS canvas on game screen
- **Memory**: ~50MB typical

### Backend
- **Concurrency**: PHP-FPM workers (4-8)
- **WebSocket Connections**: 1000+ concurrent (Reverb)
- **Database Queries**: Indexed for common ops
- **Memory**: ~100MB typical

### Database
- **Query Time**: <50ms p95
- **Connection Pool**: 10 max
- **Backups**: Daily automated

---

## 🛡️ Security

### CORS
```
Allowed Origins: localhost:4200, localhost:3000
Credentials: true
Methods: GET, POST, PATCH, DELETE
Headers: Content-Type, Authorization
```

### CSRF Protection
- Sanctum tokens used
- SameSite=Strict cookies

### Input Validation
- Form Requests in Laravel
- Frontend form validators
- SQL escaping via Eloquent

### Rate Limiting
- Per-IP and per-user limits
- Throttle middleware

### Secrets
- APP_KEY in .env (not in repo)
- Admin tokens different from player tokens
- Password hashing: bcrypt

---

## 📝 Monitoring & Logging

### Backend
```
logs/laravel.log - All errors and debug info
All requests logged with:
- Method, URL, Status
- Response time
- User ID
- Error stack trace
```

### Frontend
```
Console.log() for development
Sentry integration (optional) for production
```

---

## 🚀 Deployment Checklist

- [ ] Set .env APP_DEBUG=false
- [ ] Generate APP_KEY
- [ ] Run migrations on production DB
- [ ] Seed initial seasons
- [ ] Configure CORS for production domain
- [ ] Set up HTTPS (SSL certificate)
- [ ] Configure Redis for sessions
- [ ] Set up automated backups
- [ ] Monitor server resources
- [ ] Set up error tracking (Sentry)

---

**Verzió:** 1.0
**Utolsó frissítés:** 2025-01-28
