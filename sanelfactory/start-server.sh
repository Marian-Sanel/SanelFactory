#!/bin/bash

# Script pentru pornirea serverului SanelFactory

echo "🚀 Pornire Server SanelFactory..."
echo "================================"

# Verifică dacă Node.js este instalat
if ! command -v node &> /dev/null; then
    echo "❌ Node.js nu este instalat. Instalează Node.js pentru a continua."
    exit 1
fi

# Navighează în directorul aplicației
cd "$(dirname "$0")"

# Verifică dacă există package.json
if [ ! -f "package.json" ]; then
    echo "❌ Nu s-a găsit package.json în directorul curent."
    exit 1
fi

# Instalează dependențele dacă nu există
if [ ! -d "node_modules" ]; then
    echo "📦 Instalare dependențe..."
    npm install
fi

# Pornește serverul
echo "✅ Pornire server pe portul 3000..."
echo "📱 Accesează: http://localhost:3000"
echo "🔧 Admin panel: http://localhost:3000/pages/admin.html"
echo "================================"
echo "Apasă Ctrl+C pentru a opri serverul"
echo ""

npm start