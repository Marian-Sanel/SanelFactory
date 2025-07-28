# Control Server - Panoul de Administrare

## Funcționalitate Nouă: Control Server

A fost adăugată o nouă secțiune în panoul de administrare care permite controlul serverului direct din interfața web.

### Cum să accesezi funcționalitatea

1. **Accesează panoul de administrare**: http://localhost:3000/pages/admin.html
2. **Autentifică-te** cu credențialele de admin
3. **Navighează la secțiunea "Control Server"** din meniul de navigare

### Funcționalități disponibile

#### 1. Status Server
- **Status**: Afișează dacă serverul este online sau offline
- **Port**: Afișează portul pe care rulează serverul (3000)
- **Uptime**: Afișează timpul de funcționare al serverului în format HH:MM:SS

#### 2. Comenzi Server
- **Pornește Server**: Confirmă că serverul rulează (serverul este deja pornit dacă poți accesa interfața)
- **Restart Server**: Restartează serverul (va întrerupe conexiunile active)
- **Oprește Server**: Oprește serverul complet (va întrerupe toate conexiunile)

#### 3. Loguri Server
- **Vizualizare loguri**: Afișează logurile în timp real
- **Refresh**: Actualizează logurile
- **Clear**: Șterge logurile din interfață

### Funcții de siguranță

- **Confirmare acțiuni**: Acțiunile de oprire și restart necesită confirmare
- **Mesaje de avertizare**: Interfața afișează avertismente despre întreruperea conexiunilor
- **Autentificare**: Toate funcțiile necesită autentificare ca administrator

### API Endpoints

Funcționalitatea folosește următoarele endpoint-uri:

- `POST /api/admin/server/start` - Pornește serverul
- `POST /api/admin/server/stop` - Oprește serverul
- `POST /api/admin/server/restart` - Restartează serverul
- `GET /api/admin/server/status` - Obține statusul serverului

### Notă importantă

⚠️ **Atenție**: Oprirea sau restartarea serverului va întrerupe toate conexiunile active. Asigură-te că nu sunt comenzi în curs de procesare înainte de a efectua aceste operații.

### Pentru dezvoltatori

Pentru un restart automat în caz de oprire, se recomandă folosirea unui process manager precum PM2:

```bash
npm install -g pm2
pm2 start server.js --name "sanelfactory"
pm2 startup
pm2 save
```

Cu PM2, serverul va fi restartat automat în caz de oprire neașteptată.