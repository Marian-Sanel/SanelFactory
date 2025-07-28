# 🏭 Sanel Factory - Website Complet

Website modern pentru servicii de printare 3D și gravură laser cu design dark mode, accente neon și funcționalități avansate.

## 🚀 Funcționalități Principale

### ✨ Pagini și Secțiuni
- **Pagina Principală** - Design modern cu hero section, servicii, testimoniale
- **Blog** - Sistem complet de blog cu căutare și filtrare
- **Proiecte** - Galerie cu proiectele realizate
- **Upload STL** - Calculator de prețuri și formular de comandă
- **Admin Panel** - Panou complet de administrare

### 🔧 Servicii Suportate
- **Printare 3D FDM** - Filamente PLA, PETG, ABS, TPU, etc.
- **Printare 3D SLA** - Rășini standard, tough, flexibile
- **Gravură Laser** - Lemn, plexiglas, piele, carton

### 🤖 Integrări Avansate
- **N8N Automation** - Automatizare publicare blog și procese
- **Chatbot AI** - Asistent virtual cu OpenAI
- **Admin Panel** - Gestionare completă conținut
- **Calculator Prețuri** - Estimare în timp real

## 📦 Instalare și Configurare

### Cerințe Sistem
- Node.js 16+ 
- NPM sau Yarn
- Browser modern (Chrome, Firefox, Safari, Edge)

### Instalare Rapidă

```bash
# Clonează repository-ul
git clone <repository-url>
cd sanelfactory

# Instalează dependențele
npm install

# Pornește server-ul backend
npm run server

# În alt terminal, pornește server-ul de dezvoltare (opțional)
npm run dev

# Sau pornește ambele simultan
npm run dev-full
```

### Accesare
- **Website Principal**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Blog**: http://localhost:3000/blog
- **Proiecte**: http://localhost:3000/proiecte

## 🔐 Admin Panel

### Credențiale de Acces
- **Username**: `Marian`
- **Parolă**: `Mingeci2`

### Funcționalități Admin
1. **Comenzi** - Vizualizare toate comenzile primite
2. **Proiecte** - Upload și gestionare proiecte pentru galerie
3. **Blog** - Adăugare și gestionare articole
4. **Testimoniale** - Gestionare comentarii clienți
5. **Materiale & Prețuri** - Configurare materiale și prețuri
6. **Setări** - Configurare generală și webhook-uri N8N

## 🤖 Integrarea N8N

### Configurare Rapidă N8N

```bash
# Instalare N8N global
npm install n8n -g

# Pornire N8N
n8n start
```

Accesează N8N la: http://localhost:5678

### Webhook-uri Configurate
- **Blog Automation**: `http://localhost:5678/webhook/blog-publish`
- **Chatbot AI**: `http://localhost:5678/webhook/chatbot`

### Configurare în Admin Panel
1. Accesează Admin Panel → Setări
2. Completează URL-urile webhook-urilor N8N
3. Testează funcționarea din interfața N8N

Documentație completă: [INTEGRARI_N8N.md](./INTEGRARI_N8N.md)

## 📊 Structura Proiectului

```
sanelfactory/
├── server.js                 # Server Node.js/Express
├── package.json              # Dependențe și scripturi
├── index.html                # Pagina principală
├── INTEGRARI_N8N.md          # Ghid integrare N8N
├── pages/                    # Pagini suplimentare
│   ├── blog.html            # Pagina blog
│   ├── proiecte.html        # Galerie proiecte
│   ├── admin.html           # Panou administrare
│   └── upload.html          # Upload STL și calculator
├── js/                       # JavaScript
│   ├── main.js              # Funcționalități principale
│   ├── blog.js              # Logica blog
│   ├── proiecte.js          # Logica galerie proiecte
│   ├── admin.js             # Logica admin panel
│   └── upload.js            # Calculator prețuri și upload
├── css/                      # Stiluri CSS
│   ├── styles.css           # Stiluri principale
│   └── upload.css           # Stiluri pagina upload
├── images/                   # Imagini și resurse
├── data/                     # Fișiere JSON (create automat)
│   ├── orders.json          # Comenzi primite
│   ├── projects.json        # Proiecte galerie
│   ├── blog.json            # Articole blog
│   ├── testimonials.json    # Testimoniale
│   ├── materials.json       # Materiale și prețuri
│   └── settings.json        # Setări generale
└── uploads/                  # Fișiere încărcate
    ├── projects/            # Imagini proiecte
    └── stl/                 # Fișiere STL
```

## 🛠️ Comenzi Disponibile

```bash
# Dezvoltare
npm run server          # Pornește doar server-ul backend
npm run dev            # Pornește server-ul static pentru frontend
npm run dev-full       # Pornește ambele servere simultan
npm start              # Alias pentru npm run server

# Build și Optimizare
npm run build          # Build pentru producție
npm run minify-css     # Minifică fișierele CSS
npm run minify-js      # Minifică fișierele JavaScript
npm run optimize-images # Optimizează imaginile

# Calitate Cod
npm run lint           # Verifică JavaScript cu ESLint
npm run format         # Formatează codul cu Prettier
npm run validate-html  # Validează HTML-ul
```

## 🎨 Design și Stilizare

### Tema Principală
- **Background**: Dark mode (#0a0a0a)
- **Accente**: Neon cyan (#00ffff), purple (#bf00ff)
- **Efecte**: Glass effect, backdrop blur, neon glow
- **Typography**: Inter font family
- **Responsive**: Complet responsive pentru toate dispozitivele

### Componente Personalizate
- Carduri cu efect de sticlă mată
- Butoane cu gradient neon
- Animații smooth și hover effects
- Loading states și skeleton screens
- Notificări toast personalizate

## 🔧 Configurare Avansată

### Materiale și Prețuri
Editează din Admin Panel → Materiale & Prețuri sau direct în `data/materials.json`:

```json
{
  "fdm": {
    "PLA": { "price": 25, "colors": ["Alb", "Negru", "Roșu"] }
  },
  "sla": {
    "Standard Resin": { "price": 80, "colors": ["Gri", "Negru"] }
  },
  "laser": {
    "Lemn 3mm": { "price": 15, "colors": ["Natural"] }
  }
}
```

### Webhook-uri N8N
Configurează în Admin Panel → Setări:
- **N8N Webhook**: Pentru automatizare blog
- **Chatbot Webhook**: Pentru chatbot AI

### Customizare Setări
```json
{
  "siteName": "Sanel Factory",
  "logo": "/images/logo.png",
  "toneOfVoice": "profesional și prietenos",
  "webhooks": {
    "n8n": "http://localhost:5678/webhook/blog-publish",
    "chatbot": "http://localhost:5678/webhook/chatbot"
  }
}
```

## 🚀 Deployment

### Producție
1. Rulează `npm run build` pentru optimizare
2. Configurează variabilele de mediu
3. Deploy pe server cu Node.js support
4. Configurează proxy reverse (nginx/apache)
5. Activează HTTPS pentru securitate

### Variabile de Mediu
```bash
PORT=3000                    # Port server
NODE_ENV=production          # Mediu producție
SESSION_SECRET=your-secret   # Secret pentru sesiuni
```

## 📞 Suport și Contact

### Pentru Dezvoltatori
- Documentația completă în fișierele markdown
- Comentarii extensive în cod
- Structură modulară și extensibilă
- API RESTful pentru toate operațiunile

### Pentru Utilizatori Non-Tehnici
- Interface intuitivă în Admin Panel
- Configurare prin interfață grafică
- Backup automat al datelor
- Instrucțiuni pas cu pas în documentație

## 📄 Licență

MIT License - Vezi fișierul LICENSE pentru detalii.

---

**Dezvoltat pentru Sanel Factory** - Website modern pentru servicii de printare 3D și gravură laser.

*Ultima actualizare: Decembrie 2024*