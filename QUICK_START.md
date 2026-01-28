# Grid Conquest - Gyors Kezdés

## 🚀 1 perces telepítés

### Előfeltételek
- XAMPP (PHP 8.2+, MySQL)
- Node.js 18+
- Composer

### Lépések

#### 1. Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
```

#### 3. Futtatás (3 terminal szükséges)

**Terminal 1 - API szerver:**
```bash
cd backend
php artisan serve
# http://localhost:8000
```

**Terminal 2 - WebSocket szerver (opcionális):**
```bash
cd backend
php artisan reverb:start --host=0.0.0.0 --port=6001
# ws://localhost:6001
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start
# http://localhost:4200
```

---

## 👤 Demo Bejelentkezés

### Admin
- **Username:** `admin`
- **Password:** `admin123`

### Játékos
- **Username:** `player1` - `player5`
- **Password:** `password123`

---

## 🎮 Játék Indítása

1. Login → `http://localhost:4200`
2. Lobby → Szoba létrehozása vagy csatlakozás
3. Ready jelzés → Az összes játékosnak kell Ready legyen
4. Start → Host indíthatja el a meccset
5. Play! → Grid-en mozgás és pontgyűjtés

---

## 🔧 Hibakeresés

### Database nem működik?
```bash
# .env-ben módosítsd:
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=grid_conquest
DB_USERNAME=root
DB_PASSWORD=  # XAMPP üres jelszó

# Majd:
php artisan migrate --seed
```

### WebSocket ConnectionError?
- Előfeltétel: PHP 8.2+
- Reverb szerver nem fut? Indítsd meg **Terminal 2**-ben
- Frontend .env: `wsUrl: 'http://localhost:6001'`

### Frontend nem töltödik be?
```bash
cd frontend
npm cache clean --force
npm install
npm start
```

---

## 📊 Projekt Szerkezet

```
/
├── backend/          (Laravel API + WebSocket)
├── frontend/         (Angular SPA)
├── README.md         (Teljes dokumentáció)
└── INSTALL.bat       (Windows installer)
```

---

## ✅ Tesztelés

### Backend tesztek
```bash
cd backend
php artisan test
```

### Frontend tesztek
```bash
cd frontend
npm test
```

---

## 🐛 Támogatott Funkciók

- ✅ Autentikáció (token alapú)
- ✅ Szobák kezelése (create, join, leave)
- ✅ Multiplayer játék WebSocket-en
- ✅ Chat real-time
- ✅ Leaderboard
- ✅ Admin moderáció
- ✅ Anti-cheat (szerver-autoritatív)

---

## 🌐 URL-ek

| Komponens | URL |
|-----------|-----|
| Frontend | http://localhost:4200 |
| API | http://localhost:8000/api |
| WebSocket | ws://localhost:6001 |
| API Docs | http://localhost:8000 |

---

## 📝 Következő lépések

1. **Szoba menedzser UI** - Szoba taglista megjelenítés
2. **Game canvas** - Fejlettebb grafika
3. **Reconnect logika** - Lecsatlakozás kezelés
4. **Mobile support** - Responsive design
5. **Tournament mode** - Több meccs turnéja

---

**Élvezhető játékot! 🎮**
