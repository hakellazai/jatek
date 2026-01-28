# Grid Conquest - Frontend (Angular)

## Telepítés

```bash
cd frontend
npm install
```

## Futtatás

```bash
ng serve
# vagy
npm start
```

A frontend a `http://localhost:4200` alatt lesz elérhető.

## Építés

```bash
ng build --configuration production
```

## Architektúra

### Könyvtárstruktúra:
- **src/app/services** - Business logika (auth, rooms, game, leaderboard)
- **src/app/guards** - Route guards (auth, admin)
- **src/app/components** - UI komponensek (login, lobby, game, etc.)
- **src/app/models** - TypeScript interfészek és típusok
- **src/app/interceptors** - HTTP interceptors (token handling)
- **src/app/websocket** - WebSocket kliens

### Állapotkezelés:
- **RxJS Subjects** alapú (BehaviorSubject, Subject)
- Legalább 3 fő service: `AuthService`, `RoomService`, `GameService`
- `Store`-szerű pattern (lekérdezésre és frissítésre)

### Autentikáció:
- Token tárolása `localStorage`-ben
- HTTP header-ben: `Authorization: Bearer <token>`
- Route guardok: player és admin szintekhez

### WebSocket:
- Socket.IO kliens a valós idejű szoba/meccs szinkronizációhoz
- Auto-reconnect logika
- Message queueing (offline támogatás)

## UI képernyők

1. **Landing / Auth** - Regisztráció / Bejelentkezés
2. **Lobby** - Szobák listája, szoba-keresés/létrehozás
3. **Room Detail** - Szoba státusza, játékos lista, ready állapot, chat
4. **Game** - Canvas-alapú játék megjelenítés, valós idejű input handling
5. **Leaderboard** - Globális és szezonális top 100
6. **Profile** - Saját statisztikák és utolsó 10 meccs
7. **Admin Panel** - Felhasználók kezelése (ban/mute), chat moderáció, audit log

## WebSocket eventos

### Client → Server
- `room.join` - Szobához csatlakozás
- `room.leave` - Kilépés
- `room.ready` - Ready toggle
- `match.input` - Game input (direction)
- `chat.send` - Chat üzenet
- `ping` - Latency check

### Server → Client
- `room.state` - Szoba frissítése
- `match.started` - Meccs indult
- `match.state` - Game state tick
- `match.ended` - Meccs vége
- `chat.message` - Chat üzenet
- `error` - Hiba

## Fejlesztés

### Tesztek futtatása:
```bash
ng test
```

### Linting:
```bash
ng lint
```

### Environment beállítás:
- `src/environments/environment.ts` - Development
- `src/environments/environment.prod.ts` - Production

Mindkettőben:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  wsUrl: 'http://localhost:6001',
};
```

## Bootstrap / Material UI

Az alkalmazás **Angular Material** és **CSS Grid** kombinációját használja a responsive design-ért.

## Megjegyzések

- Az **WebSocket kliens** a `Socket.IO` klienst használja (kompatibilis a Pusher-rel)
- A **játékállapot** szerver-autoritatív: a kliens csak inputot küld
- **Offline támogatás**: hosszabb szünet után reconnect
- **Real-time chat** a szobán belül
