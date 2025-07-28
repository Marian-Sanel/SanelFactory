# Server Control Feature - SanelFactory

## Descriere

Am adăugat o funcționalitate de control server în panoul de administrare care permite pornirea, oprirea și repornirea serverului direct din interfața web.

## Funcționalități

### 1. Status Server
- Afișează statusul curent al serverului (rulează/oprit)
- Indică portul pe care rulează serverul
- Afișează timpul de funcționare (uptime)

### 2. Controale Server
- **Pornește Serverul**: Pornește serverul (dacă nu rulează deja)
- **Oprește Serverul**: Oprește serverul
- **Repornește Serverul**: Repornește serverul

### 3. Logs Server
- Afișează logurile serverului în timp real
- Posibilitatea de a șterge logurile
- Actualizare manuală a logurilor

## Cum să accesezi

1. Pornește serverul: `npm start` sau `node server.js`
2. Accesează panoul de administrare: `http://localhost:3000/admin`
3. Autentifică-te cu credențialele:
   - Username: `Marian`
   - Password: `Mingeci2`
4. Navighează la secțiunea "Server Control" din meniul de navigare

## API Endpoints

### GET /api/server/status
Returnează statusul curent al serverului:
```json
{
  "status": "running",
  "port": 3000,
  "uptime": 1234567,
  "startTime": 1640995200000
}
```

### POST /api/server/start
Pornește serverul (pentru demonstrație - serverul este deja pornit):
```json
{
  "success": true,
  "message": "Serverul este deja pornit",
  "status": "running"
}
```

### POST /api/server/stop
Oprește serverul:
```json
{
  "success": true,
  "message": "Comandă de oprire primită",
  "status": "stopped"
}
```

### POST /api/server/restart
Repornește serverul:
```json
{
  "success": true,
  "message": "Serverul a fost repornit",
  "status": "running"
}
```

## Interfața Utilizator

Interfața include:
- **Indicator de status** cu culori (verde = rulează, roșu = oprit)
- **Butoane de control** cu iconițe Font Awesome
- **Logs în timp real** cu timestamp-uri
- **Design modern** cu efecte de sticlă și culori neon

## Note Tehnice

- Funcționalitatea este implementată pentru demonstrație
- În producție, ar trebui implementată o gestionare mai robustă a proceselor
- Logurile sunt stocate temporar în memorie
- Statusul serverului este verificat prin API calls

## Securitate

- Toate endpoint-urile de control server necesită autentificare
- Utilizatorul trebuie să fie logat în panoul de administrare
- Credențialele sunt hardcodate pentru demonstrație (în producție ar trebui să fie în baza de date)

## Dezvoltare Viitoare

- Implementarea unui sistem de procese real pentru controlul serverului
- Loguri persistente în fișiere
- Monitorizare în timp real a resurselor serverului
- Notificări pentru evenimente importante
- Backup automat al datelor