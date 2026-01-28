@echo off
REM Grid Conquest - Telepítési script Windows-hoz

echo.
echo ========================================
echo Grid Conquest - Telepítés
echo ========================================
echo.

REM Backend telepítés
echo [1/4] Laravel Backend - Composer függőségek...
cd backend
call composer install
copy .env.example .env
call php artisan key:generate
echo.

echo [2/4] Laravel Backend - Adatbázis migrálás...
call php artisan migrate
call php artisan db:seed
echo.

cd ..

REM Frontend telepítés
echo [3/4] Angular Frontend - NPM függőségek...
cd frontend
call npm install
echo.

echo [4/4] Kész!
echo.
echo ========================================
echo Futtatás:
echo ========================================
echo.
echo 1. Terminal 1 - Backend API (port 8000):
echo    cd backend
echo    php artisan serve
echo.
echo 2. Terminal 2 - WebSocket (port 6001):
echo    cd backend
echo    php artisan reverb:start --host=0.0.0.0 --port=6001
echo.
echo 3. Terminal 3 - Frontend (port 4200):
echo    cd frontend
echo    npm start
echo.
echo Frontend: http://localhost:4200
echo API: http://localhost:8000/api
echo WebSocket: ws://localhost:6001
echo.
echo Demo felhasználók:
echo - admin / admin123 (admin)
echo - player1 / password123 (játékos)
echo.
pause
