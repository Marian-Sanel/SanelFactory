#!/bin/bash

# Culori pentru output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Pornesc serverul Sanel Factory...${NC}"

# Verifică dacă node_modules există
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Instalez dependențele...${NC}"
    npm install
fi

# Pornește serverul în background
npm start &
SERVER_PID=$!

# Așteaptă puțin ca serverul să pornească
echo -e "${BLUE}⏳ Aștept ca serverul să pornească...${NC}"
sleep 3

# Deschide browserul
echo -e "${GREEN}🌐 Deschid browserul pe http://localhost:3000${NC}"
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:3000
elif command -v gnome-open > /dev/null; then
    gnome-open http://localhost:3000
elif command -v firefox > /dev/null; then
    firefox http://localhost:3000
elif command -v google-chrome > /dev/null; then
    google-chrome http://localhost:3000
elif command -v chromium > /dev/null; then
    chromium http://localhost:3000
else
    echo -e "${GREEN}Nu am putut deschide browserul automat. Te rog deschide manual: http://localhost:3000${NC}"
fi

echo -e "${GREEN}✅ Serverul rulează! Apasă Ctrl+C pentru a opri.${NC}"

# Așteaptă ca serverul să fie oprit
wait $SERVER_PID