# Grid Conquest API - Dokumentáció

## Alap Info

- **Base URL**: `http://localhost:8000/api`
- **Format**: JSON
- **Auth**: Bearer Token (Sanctum)

---

## 🔐 Autentikáció

### POST /auth/register
Új felhasználó regisztrálása

**Request:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "role": "player",
    "is_banned": false,
    "created_at": "2025-01-28T10:00:00Z"
  },
  "token": "1|abc123def456..."
}
```

### POST /auth/login
Bejelentkezés

**Request:**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": { ... },
  "token": "1|abc123def456..."
}
```

### POST /auth/logout
Kijelentkezés

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

### GET /me
Saját profil + statisztikák

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "user": { ... },
  "stats": {
    "matches_played": 5,
    "wins": 2,
    "total_score": 350
  }
}
```

---

## 🏠 Szobák (Rooms)

### GET /rooms
Nyilvános szobák listája

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Pro Players",
    "host": "player1",
    "max_players": 4,
    "current_players": 2,
    "is_private": false,
    "status": "open",
    "created_at": "2025-01-28T10:00:00Z"
  }
]
```

### POST /rooms
Szoba létrehozása

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "My Room",
  "max_players": 3,
  "is_private": false
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "My Room",
  "host_user_id": 1,
  "max_players": 3,
  "is_private": false,
  "status": "open",
  "created_at": "2025-01-28T10:00:00Z"
}
```

### POST /rooms/{id}/join
Csatlakozás szobához

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "message": "Joined room successfully"
}
```

### POST /rooms/{id}/leave
Kilépés szobáról

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "message": "Left room successfully"
}
```

### POST /rooms/{id}/ready
Ready állapot toggle

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "is_ready": true
}
```

### POST /rooms/{id}/start
Meccs indítása (csak host)

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "message": "Game started"
}
```

---

## 💬 Chat

### POST /rooms/{roomId}/chat
Chat üzenet küldése

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "message": "Hello everyone!"
}
```

**Response (201):**
```json
{
  "id": 1,
  "room_id": 1,
  "user_id": 1,
  "message": "Hello everyone!",
  "is_deleted": false,
  "created_at": "2025-01-28T10:00:00Z"
}
```

### GET /rooms/{roomId}/chat
Szoba chat üzeneteinek lekérdezése

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
[
  {
    "id": 1,
    "room_id": 1,
    "user": "player1",
    "message": "Hello everyone!",
    "created_at": "2025-01-28T10:00:00Z",
    "is_deleted": false
  }
]
```

---

## 🎮 Meccsek (Matches)

### GET /matches
Meccsek listája (opcionálisan user szerinti szűrésre)

**Headers:** `Authorization: Bearer {token}`

**Query:** `?userId=1` (opcionális)

**Response (200):**
```json
[
  {
    "id": 1,
    "room_id": 1,
    "started_at": "2025-01-28T10:00:00Z",
    "ended_at": "2025-01-28T10:02:00Z",
    "status": "finished",
    "players": [
      {
        "id": 1,
        "user_id": 1,
        "username": "player1",
        "score": 150,
        "is_winner": true
      }
    ]
  }
]
```

### GET /matches/{id}
Meccs részletei

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "id": 1,
  "room_id": 1,
  "started_at": "2025-01-28T10:00:00Z",
  "ended_at": "2025-01-28T10:02:00Z",
  "status": "finished",
  "seed": 5432,
  "map_config": {
    "width": 100,
    "height": 100,
    "pickups": [...]
  },
  "players": [...]
}
```

---

## 🏆 Leaderboard

### GET /leaderboard/global
Globális top 100

**Response (200):**
```json
[
  {
    "rank": 1,
    "user": "player1",
    "points": 5000,
    "matches_played": 50,
    "wins": 25
  }
]
```

### GET /leaderboard/season/{seasonId}
Szezonális top 100

**Response (200):**
```json
[
  {
    "rank": 1,
    "user": "player1",
    "points": 2500,
    "matches_played": 20,
    "wins": 10
  }
]
```

### GET /leaderboard/me
Saját ranking

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "global": {
    "user_id": 1,
    "points": 5000,
    "matches_played": 50,
    "wins": 25
  },
  "seasonal": {
    "user_id": 1,
    "season_id": 1,
    "points": 2500,
    "matches_played": 20,
    "wins": 10
  }
}
```

---

## 👨‍💼 Admin (Bearer Token)

### POST /admin/login
Admin bejelentkezés

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "token": "1|xyz789...",
  "user": { ... }
}
```

### GET /admin/users
Felhasználók listája

**Headers:** `Authorization: Bearer {admin_token}`

**Response (200):**
```json
[
  {
    "id": 1,
    "username": "player1",
    "email": "player1@example.com",
    "role": "player",
    "is_banned": false,
    "muted_until": null
  }
]
```

### PATCH /admin/users/{id}/ban
Felhasználó kitiltása

**Headers:** `Authorization: Bearer {admin_token}`

**Response (200):**
```json
{
  "message": "User banned"
}
```

### PATCH /admin/users/{id}/mute
Felhasználó némítása

**Headers:** `Authorization: Bearer {admin_token}`

**Request:**
```json
{
  "duration_minutes": 60
}
```

**Response (200):**
```json
{
  "message": "User muted"
}
```

### DELETE /admin/chat/{messageId}
Chat üzenet törlése

**Headers:** `Authorization: Bearer {admin_token}`

**Response (200):**
```json
{
  "message": "Message deleted"
}
```

### GET /admin/audit-logs
Audit napló

**Headers:** `Authorization: Bearer {admin_token}`

**Response (200):**
```json
[
  {
    "id": 1,
    "admin": "admin",
    "action": "BAN_USER",
    "payload": {
      "user_id": 5,
      "username": "badplayer"
    },
    "created_at": "2025-01-28T10:00:00Z"
  }
]
```

---

## 📡 WebSocket Események

### Eseménylista

**Client → Server:**
- `room.join` - szobához csatlakozás
- `room.leave` - szobáról kilépés
- `room.ready` - ready jelzés
- `match.input` - game input
- `chat.send` - chat üzenet
- `ping` - ping

**Server → Client:**
- `room.state` - szoba státusza
- `match.started` - meccs indult
- `match.state` - game state (20 Hz)
- `match.ended` - meccs vége
- `chat.message` - chat üzenet
- `error` - hiba

### Példa: Game Input
```javascript
socket.emit('match.input', {
  matchId: 1,
  direction: 'up', // 'up', 'down', 'left', 'right', null
  action: null,
  ts: Date.now()
});
```

### Példa: Chat Send
```javascript
socket.emit('chat.send', {
  roomId: 1,
  message: 'Hello!'
});
```

---

## ⚠️ Error Handling

Összes error JSON formátumban:

```json
{
  "error": "Invalid credentials",
  "status": 401,
  "message": "Unauthenticated."
}
```

### Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

---

## 🔄 Rate Limiting

- Auth endpoints: 60 req/min per IP
- Chat: 60 req/min per user
- Egyéb: 1000 req/min per user

---

**API Version:** 1.0
**Last Updated:** 2025-01-28
