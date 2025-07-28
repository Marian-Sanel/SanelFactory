# Sanel Factory - Website Printare 3D

Un website modern și profesional pentru o companie de printare 3D, cu temă dark, efecte frosted glass și funcționalități avansate.

## 🚀 Caracteristici

### Design
- **Temă Dark Modern**: Background negru cu efecte de sticlă mată (frosted glass)
- **Accent Neon Coral**: Culoare principală #ff6b6b pentru butoane și hover effects
- **Tipografie Sans-serif**: Font Inter pentru aspect modern și profesional
- **Margini Rotunjite**: Design minimalist cu colțuri rotunjite
- **Responsive Design**: Optimizat pentru desktop, tablet și mobile

### Funcționalități Principale

#### 🏠 Homepage
- Hero section cu animații CSS
- Prezentare servicii (FDM, SLA, CAD, Gravură Laser)
- Testimoniale clienți
- FAQ interactiv
- Formular de contact

#### 📤 Upload STL & Calculator Preț
- **Drag & Drop Upload**: Încărcare fișiere prin drag & drop sau click
- **Formate Acceptate**: STL, OBJ, 3MF, STEP
- **Analiză Automată**: Calculează dimensiuni, volum și complexitate
- **Calculator Preț în Timp Real**: Actualizare automată în funcție de opțiuni
- **Formular Complet**: Tehnologie, material, culoare, calitate, servicii extra
- **Estimare Timp**: Calculează timpul de printare și livrare

#### 🤖 Chatbot AI
- **Răspunsuri Inteligente**: Procesează întrebări despre printare 3D
- **Categorii Multiple**: Prețuri, materiale, tehnologii, timpi de livrare
- **Interfață Modernă**: Design consistent cu tema site-ului
- **Indicator Typing**: Animație realistă de scriere

#### 📱 Funcționalități Mobile
- **Navigation Responsive**: Meniu hamburger pentru mobile
- **Touch Optimized**: Toate elementele sunt optimizate pentru touch
- **Calculator Adaptat**: Se transformă în layout vertical pe mobile

### 🛠 Tehnologii Utilizate

- **HTML5**: Structură semantică și accesibilă
- **CSS3**: 
  - Custom Properties (CSS Variables)
  - Flexbox și CSS Grid
  - Backdrop-filter pentru efecte glass
  - Animații și tranziții moderne
- **JavaScript ES6+**:
  - Module pattern
  - Async/await pentru operații asincrone
  - Local Storage pentru persistența datelor
  - Intersection Observer pentru animații
- **Font Awesome**: Iconuri vectoriale
- **Google Fonts**: Tipografia Inter

## 📁 Structura Proiectului

```
sanelfactory/
├── index.html                 # Homepage principal
├── css/
│   ├── styles.css            # Stiluri principale
│   └── upload.css            # Stiluri pentru pagina upload
├── js/
│   ├── main.js               # Funcționalități principale
│   ├── upload.js             # Logica upload și calculator
│   └── chatbot.js            # Chatbot AI
├── pages/
│   ├── upload.html           # Pagina upload STL
│   ├── servicii.html         # Pagina servicii detaliate
│   ├── blog.html             # Blog cu articole SEO
│   └── contact.html          # Pagina contact
├── images/                   # Imagini și logo-uri
├── api/                      # Endpoint-uri pentru integrări
└── README.md                 # Documentația proiectului
```

## 🎨 Ghid de Culori

```css
/* Culori principale */
--bg-primary: #0a0a0a;        /* Background principal */
--bg-secondary: #1a1a1a;      /* Background secundar */
--bg-glass: rgba(255, 255, 255, 0.05);  /* Efecte glass */

/* Text */
--text-primary: #ffffff;       /* Text principal */
--text-secondary: #b0b0b0;     /* Text secundar */
--text-muted: #808080;         /* Text estompat */

/* Accent */
--accent-coral: #ff6b6b;       /* Coral neon principal */
--accent-green: #00ff88;       /* Verde neon secundar */
--accent-blue: #4dabf7;        /* Albastru accent */
```

## 🚦 Instalare și Configurare

### 1. Clonează Repository-ul
```bash
git clone [repository-url]
cd sanelfactory
```

### 2. Configurare Server Local
Pentru dezvoltare locală, folosește un server HTTP simplu:

```bash
# Cu Python 3
python -m http.server 8000

# Cu Node.js (http-server)
npx http-server -p 8000

# Cu PHP
php -S localhost:8000
```

### 3. Accesează Site-ul
Deschide `http://localhost:8000` în browser.

## ⚙️ Configurare pentru Producție

### 1. Actualizează Date de Contact
În fișierele HTML, înlocuiește:
- `+40 XXX XXX XXX` cu numărul real de telefon
- `contact@sanelfactory.ro` cu email-ul real
- Adresa completă a companiei

### 2. Configurare Integrări

#### n8n Automation
Pentru automatizarea formularelor și blog-ului:
```javascript
// În main.js și upload.js, înlocuiește URL-urile cu endpoint-urile n8n
const N8N_WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/sanel-factory';
```

#### Calculator Preț Extern
Pentru integrarea cu AutoQuote3D sau alt serviciu:
```html
<!-- În upload.html -->
<iframe src="https://autoquote3d.com/embed/your-key" 
        width="100%" height="600"></iframe>
```

#### Analytics
Adaugă Google Analytics sau alt serviciu:
```html
<!-- În <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

### 3. Optimizare SEO

#### Meta Tags
Toate paginile au meta tags complete pentru SEO.

#### JSON-LD
Schema.org markup pentru business local inclus în homepage.

#### Sitemap
Creează un sitemap.xml:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sanelfactory.ro/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://sanelfactory.ro/pages/upload.html</loc>
    <priority>0.9</priority>
  </url>
</urlset>
```

## 🔧 Customizare

### Modificare Culori
Editează variabilele CSS în `css/styles.css`:
```css
:root {
  --accent-coral: #your-color;  /* Schimbă culoarea accent */
  --bg-primary: #your-bg;       /* Schimbă background-ul */
}
```

### Adăugare Materiale Noi
În `pages/upload.html`, adaugă opțiuni noi în select:
```html
<option value="new-material" data-price="3.0">Material Nou - 3 RON/cm³</option>
```

Și actualizează logica în `js/upload.js`.

### Modificare Răspunsuri Chatbot
În `js/chatbot.js`, editează funcția `processMessage()` pentru a adăuga răspunsuri noi.

## 📊 Funcționalități Avansate

### Auto-save Formulare
Formularele salvează automat progresul în localStorage.

### Analiză STL Client-side
Parser basic STL pentru calcularea dimensiunilor și volumului.

### Sistem Notificări
Notificări toast pentru feedback utilizator.

### Performance Monitoring
Monitorizare timp de încărcare și erori JavaScript.

## 🌐 Integrări Recomandate

### Backend Services
- **n8n**: Automatizare workflow-uri și procesare formulare
- **Stripe**: Procesare plăți online
- **EmailJS**: Trimitere email-uri fără backend
- **Cloudflare**: CDN și protecție

### Analytics și Marketing
- **Google Analytics 4**: Tracking utilizatori
- **Google Search Console**: Monitorizare SEO
- **Facebook Pixel**: Marketing pe social media
- **Hotjar**: Heatmaps și înregistrări sesiuni

### Hosting Recomandat
- **HostAge**: Hosting România (menționat în brief)
- **Netlify**: Hosting static cu CI/CD
- **Vercel**: Hosting cu preview deployments
- **Cloudflare Pages**: Hosting cu CDN global

## 🔐 Securitate

### Validare Formulare
- Validare client-side și server-side
- Sanitizare input-uri
- Rate limiting pentru formulare

### Upload Fișiere
- Validare tip fișier
- Limitare dimensiune (50MB)
- Scanare malware recomandat

### Headers Securitate
```apache
# .htaccess
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set Referrer-Policy strict-origin-when-cross-origin
```

## 📱 PWA (Progressive Web App)

Site-ul este pregătit pentru PWA cu:
- Service Worker registration
- Manifest.json pentru instalare
- Offline functionality

## 🐛 Debugging

### Console Logs
Site-ul loghează informații utile în consolă:
- Timp de încărcare pagină
- Erori JavaScript
- Analytics chatbot

### Local Storage
Datele salvate în localStorage:
- `chatbot_welcomed`: Flag pentru mesaj welcome
- `form_*`: Date formulare auto-salvate

## 📞 Support

Pentru întrebări tehnice sau customizări:
- Documentația este în acest README
- Comentariile din cod explică funcționalitățile
- Structura modulară permite modificări ușoare

## 📄 Licență

Acest proiect este dezvoltat pentru Sanel Factory. Toate drepturile rezervate.

---

**Dezvoltat cu ❤️ pentru comunitatea maker din România**