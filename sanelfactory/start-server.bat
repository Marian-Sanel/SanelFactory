@echo off
echo ========================================
echo 🚀 Pornire Server SanelFactory...
echo ========================================

REM Verifică dacă Node.js este instalat
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js nu este instalat. Instalează Node.js pentru a continua.
    pause
    exit /b 1
)

REM Navighează în directorul scriptului
cd /d "%~dp0"

REM Verifică dacă există package.json
if not exist "package.json" (
    echo ❌ Nu s-a găsit package.json în directorul curent.
    pause
    exit /b 1
)

REM Instalează dependențele dacă nu există
if not exist "node_modules" (
    echo 📦 Instalare dependențe...
    call npm install
)

echo.
echo ✅ Pornire server pe portul 3000...
echo 📱 Accesează: http://localhost:3000
echo 🔧 Admin panel: http://localhost:3000/pages/admin.html
echo ========================================
echo Apasă Ctrl+C pentru a opri serverul
echo.

npm start