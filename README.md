# Grid Conquest - Realtime Multiplayer Game Platform

> Böngészőből játszható, valós idejű multiplayer játékplatform Angular + Laravel + WebSocket alapokon.

## 📋 Projekt Áttekintés

A **Grid Conquest** egy komplex multiplayer játékplatform, ahol 2-6 játékos versenyez egy rácson, pontokat gyűjtve. A játék teljes **szerver-autoritatív** logikára épül az anti-cheat védelemhez.

### Fő Funkciók
- ✅ **Autentikáció**: Token-alapú bejelentkezés (Sanctum)
- ✅ **Lobby rendszer**: Szoba-keresés, csatlakozás, ready state
- ✅ **Multiplayer játék**: WebSocket valós idejű szinkronizáció
- ✅ **Chat**: Szobán belüli valós idejű üzenetváltás
- ✅ **Leaderboard**: Globális és szezonális rangsor
- ✅ **Admin panel**: Felhasználók kezelése, moderáció
- ✅ **Szerver-autoritatív**: Anti-cheat védelemmel

---

## 🚀 Telepítés és Futtatás

### Előfeltételek
- **PHP 8.2+**
- **MySQL 8.0+** (XAMPP MySQL szervere vagy önálló)
- **Node.js 18+** és **npm**
- **Composer** (PHP package manager)

### Backend (Laravel) Telepítés

```bash
cd backend

# 1. Composer függőségek
composer install

# 2. .env fájl másolása
cp .env.example .env

# 3. Alkalmazás kulcs generálása
php artisan key:generate

# 4. Adatbázis konfigurálása
# Módosítsd a .env fájlt:
DB_DATABASE=grid_conquest
DB_USERNAME=root
DB_PASSWORD=  # XAMPP esetén üres

# 5. Adatbázis migrálása és seed
php artisan migrate
php artisan db:seed

# 6. API szerver indítása (8000-es port)
php artisan serve
```

### Frontend (Angular) Telepítés

```bash
cd frontend

# 1. NPM függőségek
npm install

# 2. Fejlesztői szerver (4200-es port)
npm start
```

### WebSocket Szerver (opcionális - Laravel Reverb)

```bash
# Backend könyvtárból:
php artisan reverb:start --host=0.0.0.0 --port=6001
```

---

## 📍 URL-ek

| Komponens | URL | Port |
|-----------|-----|------|
| **Frontend** | http://localhost:4200 | 4200 |
| **API** | http://localhost:8000/api | 8000 |
| **WebSocket** | ws://localhost:6001 | 6001 |

---

## 🗄️ Adatbázis Séma

### Fő Táblák
- **users**: Felhasználó fiókok
- **rooms**: Játékszobák
- **room_members**: Szoba tagságok
- **matches**: Meccsek
- **match_players**: Meccs résztvevők
- **leaderboard_entries**: Rangsor bejegyzések
- **seasons**: Játékszezók
- **chat_messages**: Chat üzenetek
- **audit_logs**: Adminisztratív naplók

---

## 🎮 Játékszabályok (Grid Conquest)

- **Játékosok**: 2-6 játékos egy szobában
- **Pálya**: 100x100-as rács
- **Cél**: Pontok gyűjtése (pickup-ok)
- **Meccs időtartama**: 120 másodperc vagy 50 pont limit
- **Szerver-autoritatív**: Szerver számítja a valid mozgásokat és pontszámot

---

## 🔐 Autentikáció

### Player Auth
```bash
POST /api/auth/register
POST /api/auth/login
Authorization: Bearer {token}
```

### Admin Auth
```bash
POST /api/admin/login
Authorization: Bearer {admin_token}
```

---

## 📡 API Végpontok

### Auth
- `POST /api/auth/register` - Regisztráció
- `POST /api/auth/login` - Bejelentkezés
- `POST /api/auth/logout` - Kijelentkezés
- `GET /api/me` - Saját profil

### Szobák
- `GET /api/rooms` - Szobák listája
- `POST /api/rooms` - Szoba létrehozása
- `POST /api/rooms/{id}/join` - Csatlakozás
- `POST /api/rooms/{id}/leave` - Kilépés
- `POST /api/rooms/{id}/ready` - Ready toggle
- `POST /api/rooms/{id}/start` - Meccs indítása

### Meccsek
- `GET /api/matches` - Meccsek listája
- `GET /api/matches/{id}` - Meccs részletei

### Leaderboard
- `GET /api/leaderboard/global` - Top 100 globális
- `GET /api/leaderboard/season/{seasonId}` - Top 100 szezonális
- `GET /api/leaderboard/me` - Saját rang

### Admin
- `POST /api/admin/login` - Admin bejelentkezés
- `GET /api/admin/users` - Felhasználók
- `PATCH /api/admin/users/{id}/ban` - Ban user
- `PATCH /api/admin/users/{id}/mute` - Mute user
- `DELETE /api/admin/chat/{messageId}` - Chat törlés
- `GET /api/admin/audit-logs` - Audit log

---

## 🔌 WebSocket Események

### Client → Server
```javascript
// Szoba-kezelés
socket.emit('room.join', { roomId: 1 });
socket.emit('room.leave', { roomId: 1 });
socket.emit('room.ready', { roomId: 1, ready: true });

// Game input
socket.emit('match.input', { 
  matchId: 1, 
  direction: 'up', 
  ts: Date.now() 
});

// Chat
socket.emit('chat.send', { roomId: 1, message: 'Hello!' });

// Ping
socket.emit('ping', { ts: Date.now() });
```

### Server → Client
```javascript
// Szoba státusza
socket.on('room.state', (data) => {
  // { roomId, members, status, ... }
});

// Meccs indult
socket.on('match.started', (data) => {
  // { matchId, config, players, ... }
});

// Game state (20 Hz)
socket.on('match.state', (state) => {
  // { tick, players: {...}, pickups: [...] }
});

// Meccs vége
socket.on('match.ended', (results) => {
  // { matchId, results: [...] }
});

// Chat üzenet
socket.on('chat.message', (msg) => {
  // { id, user, message, createdAt }
});

// Hiba
socket.on('error', (error) => {
  // { code, message }
});
```

---

## 👥 Demo Felhasználók

Seeding után:

| Username | Email | Password | Role |
|----------|-------|----------|------|
| admin | admin@gridconquest.local | admin123 | admin |
| player1 | player1@gridconquest.local | password123 | player |
| player2 | player2@gridconquest.local | password123 | player |
| player3 | player3@gridconquest.local | password123 | player |
| player4 | player4@gridconquest.local | password123 | player |
| player5 | player5@gridconquest.local | password123 | player |

---

## 🧪 Tesztek

### Backend (Laravel)
```bash
cd backend
php artisan test
```

### Frontend (Angular)
```bash
cd frontend
npm test
```

---

## 📐 Projekt Szerkezet

```
/
├── backend/                    # Laravel API + WebSocket
│   ├── app/
│   │   ├── Models/            # Eloquent modellek
│   │   ├── Http/Controllers/  # API kontrollerek
│   │   ├── Http/Requests/     # Request validáció
│   │   ├── Services/          # Game logika
│   │   └── Events/            # WebSocket broadcast
│   ├── database/
│   │   ├── migrations/        # DB schema
│   │   └── seeders/           # Dummy adatok
│   ├── routes/
│   │   ├── api.php            # REST API routes
│   │   └── channels.php       # WebSocket csatornák
│   └── README.md
│
└── frontend/                   # Angular SPA
    ├── src/
    │   ├── app/
    │   │   ├── services/      # RxJS alapú services
    │   │   ├── guards/        # Route guards
    │   │   ├── components/    # UI komponensek
    │   │   ├── models/        # TypeScript interfészek
    │   │   ├── interceptors/  # HTTP interceptors
    │   │   └── websocket/     # Socket.IO kliens
    │   └── environments/      # Config (dev/prod)
    └── README.md
```

---

## ⚙️ Konfigurációs Fájlok

### Backend (.env.example)
```env
APP_NAME="Grid Conquest"
DB_DATABASE=grid_conquest
BROADCAST_DRIVER=pusher
WEBSOCKET_SERVER_PORT=6001
```

### Frontend (src/environments/)
```typescript
export const environment = {
  apiUrl: 'http://localhost:8000/api',
  wsUrl: 'http://localhost:6001',
};
```

---

## 🐛 Fejlesztés / Debugging

### Laravel Tinker (Backend Console)
```bash
cd backend
php artisan tinker

# Lekérdezés:
> User::all();
> Room::with('activeMembers')->get();
```

### Angular DevTools
- Chrome DevTools: `F12` → Network/Console
- Angular DevTools Extension: Developer Experience javítás

---

## 📋 Megvalósított Funkciók Checklist

- ✅ Valós idejű WebSocket multiplayer
- ✅ Szerver-autoritatív játéklogika
- ✅ Chat real-time + mentés
- ✅ Leaderboard frissülés meccs után
- ✅ Admin Bearer token auth + moderáció
- ✅ DB migrációk + 5 dummy user + 1 admin
- ✅ README: telepítés, futtatás, env, arch
- ✅ RxJS állapotkezelés (BehaviorSubject)
- ✅ Route guardok (auth + admin)
- ✅ Validáció minden bemeneten
- ✅ Hibakezelés (JSON)
- ✅ Tesztek (auth, room, guard)

---

## 📝 Megjegyzések

- **Reconnect**: WebSocket auto-reconnect 10 próbálkozásig
- **Rate limiting**: Auth, chat endpointok throttled
- **Validáció**: Form Requests Laravel-ben, form validators Angular-ben
- **Anti-cheat**: Szerver számít mindent, kliens nem bízható meg

---

## 🔗 Dokumentáció

- [Laravel API Documentation](backend/README.md)
- [Angular Frontend Documentation](frontend/README.md)
- [Game Architecture](#)

---

## 👨‍💻 Szerzők

- **Full Stack Developer**: Grid Conquest Team

---

## 📄 Licenc

MIT License - Lásd LICENSE fájlt.

---

**Jó játékot! 🎮**
