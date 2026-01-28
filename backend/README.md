# Grid Conquest - Backend (Laravel)

## Telepítés

1. **Composer függőségek telepítése:**
```bash
cd backend
composer install
```

2. **.env fájl beállítása:**
```bash
cp .env.example .env
php artisan key:generate
```

3. **Adatbázis beállítása (MySQL):**
```bash
# MySQL szerver futásban kell legyen
php artisan migrate
php artisan db:seed
```

## Futtatás

### API szerver (8000-es port)
```bash
php artisan serve
```

### WebSocket szerver (6001-es port)
```bash
php artisan reverb:start
```

Vagy az `artisan serve` mellett háttérben:
```bash
php artisan reverb:start --host=0.0.0.0 --port=6001 &
```

## Architektúra

### Könyvtárstruktúra:
- **app/Models** - Adatbázis modellek
- **app/Http/Controllers** - Request/response logika
- **app/Http/Requests** - Request validáció
- **app/Services** - Game logika (autoritatív szerver)
- **app/Events** - WebSocket broadcast események
- **app/Listeners** - Event hallgatók
- **database/migrations** - Adatbázis táblastruktúra
- **database/seeders** - Dummy adatok
- **routes/api.php** - API végpontok
- **routes/channels.php** - WebSocket csatornák

### Autentikáció:
- **Player auth**: Laravel Sanctum token alapú
- **Admin auth**: Bearer token (personal_access_tokens)

### WebSocket (Laravel Reverb + Pusher):
- Valós idejű szoba és match state szinkronizáció
- Chat üzenetek broadcast
- Match tick frissítések (10-20 tick/s)

### Játéklogika:
- Szerver autoritatív (anti-cheat)
- Kliens input validáció
- Pontszámítás, mozgás, ütközés szerver oldalon

## Fő API végpontok

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/me`

### Rooms
- `GET /api/rooms` - Szobák listázása
- `POST /api/rooms` - Szoba létrehozása
- `POST /api/rooms/{id}/join` - Csatlakozás
- `POST /api/rooms/{id}/leave` - Kilépés
- `POST /api/rooms/{id}/ready` - Ready toggle

### Matches
- `GET /api/matches` - Meccsek listázása
- `GET /api/matches/{id}` - Meccs részletei

### Leaderboard
- `GET /api/leaderboard/global` - Globális top 100
- `GET /api/leaderboard/season/{seasonId}` - Szezonális top 100
- `GET /api/leaderboard/me` - Saját ranking

### Admin (Bearer token)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - Felhasználók listázása
- `PATCH /api/admin/users/{id}/ban` - Ban user
- `PATCH /api/admin/users/{id}/mute` - Mute user
- `DELETE /api/admin/chat/{messageId}` - Chat moderáció
- `GET /api/admin/audit-logs` - Audit log

## WebSocket események

### Client → Server
- `room.join` - Szobához csatlakozás
- `room.leave` - Szobáról kilépés
- `room.ready` - Ready state bejelentés
- `match.input` - Game input (mozgás, akció)
- `chat.send` - Chat üzenet
- `ping` - Latency check

### Server → Client
- `room.state` - Szoba státusza frissül
- `match.started` - Meccs indított
- `match.state` - Játékállapot tick (20 Hz)
- `match.ended` - Meccs vége, eredmények
- `chat.message` - Chat üzenet érkezett
- `error` - Hiba

## Fejlesztés

### Tesztek futtatása:
```bash
php artisan test
```

### Migrációk visszaállítása (dev):
```bash
php artisan migrate:refresh --seed
```

### Redis / WebSocket teszteléshez:
```bash
php artisan tinker
# vagy WebSocket kliens teszteléshez lásd: frontend/README.md
```

## Többi megjegyzés

- Az **admin autentifikáció** a `PersonalAccessToken`-t használja (Sanctum-on keresztül)
- A **game state** szerver oldalt számított: a kliens csak inputot küld
- **Rate limiting**: Auth és chat endpontok 60 req/min
- **Validáció**: Form Request classes az összes bemenetre
- **CORS**: Frontend domain whitelistelve (.env-ben)
