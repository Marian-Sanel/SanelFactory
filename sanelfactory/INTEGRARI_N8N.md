# 🔗 Integrări N8N pentru Sanel Factory

Acest document explică cum să configurezi și să folosești n8n pentru automatizarea proceselor pe website-ul Sanel Factory.

## 📋 Cuprins

1. [Configurarea Instanței N8N](#configurarea-instanței-n8n)
2. [Automatizarea Publicării Articolelor](#automatizarea-publicării-articolelor)
3. [Chatbot AI Integrat](#chatbot-ai-integrat)
4. [Webhook-uri și Configurări](#webhook-uri-și-configurări)
5. [Exemple de Workflow-uri](#exemple-de-workflow-uri)
6. [Depanare și Suport](#depanare-și-suport)

---

## 🚀 Configurarea Instanței N8N

### Pasul 1: Instalarea N8N Local

```bash
# Instalare prin npm (recomandat pentru dezvoltare)
npm install n8n -g

# Sau folosind Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -e WEBHOOK_URL=http://localhost:5678/ \
  n8nio/n8n
```

### Pasul 2: Pornirea N8N

```bash
# Pornire simplă
n8n start

# Pornire cu configurări personalizate
N8N_BASIC_AUTH_ACTIVE=true \
N8N_BASIC_AUTH_USER=admin \
N8N_BASIC_AUTH_PASSWORD=admin123 \
n8n start
```

### Pasul 3: Accesarea Interfeței

- Deschide browserul la `http://localhost:5678`
- Configurează contul de administrator
- Familiarizează-te cu interfața

---

## 📝 Automatizarea Publicării Articolelor

### Workflow: Publicare Automată Blog

#### Componente Necesare:
1. **Webhook Trigger** - Primește date de la surse externe
2. **Function Node** - Procesează și formatează conținutul
3. **HTTP Request** - Trimite articolul la API-ul website-ului

#### Configurare Pas cu Pas:

1. **Creează un Workflow Nou**
   - Numele: "Auto-Publish Blog Articles"
   - Descriere: "Automatizează publicarea articolelor de blog"

2. **Adaugă Webhook Trigger**
   ```json
   {
     "httpMethod": "POST",
     "path": "blog-publish",
     "responseMode": "onReceived"
   }
   ```

3. **Configurează Function Node**
   ```javascript
   // Procesează datele primite
   const articleData = {
     title: $json.title || 'Articol Nou',
     content: $json.content || '',
     excerpt: $json.excerpt || $json.content.substring(0, 150) + '...',
     category: $json.category || '3d-printing',
     tags: $json.tags || [],
     author: $json.author || 'Echipa Sanel Factory',
     image: $json.image || null
   };

   // Validare conținut
   if (!articleData.title || !articleData.content) {
     throw new Error('Titlu și conținut sunt obligatorii');
   }

   return {
     json: articleData
   };
   ```

4. **Adaugă HTTP Request Node**
   ```json
   {
     "method": "POST",
     "url": "http://localhost:3000/api/blog",
     "headers": {
       "Content-Type": "application/json",
       "Authorization": "Bearer YOUR_API_TOKEN"
     },
     "body": "={{ JSON.stringify($json) }}"
   }
   ```

#### URL Webhook Final:
`http://localhost:5678/webhook/blog-publish`

### Exemple de Utilizare:

#### Publicare prin cURL:
```bash
curl -X POST http://localhost:5678/webhook/blog-publish \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ghidul Complet PLA",
    "content": "PLA este unul dintre cele mai populare materiale...",
    "category": "3d-printing",
    "tags": ["PLA", "printare 3D", "materiale"],
    "author": "Marian Sanel"
  }'
```

#### Integrare cu CMS Extern:
- WordPress: Folosește plugin-ul "Webhooks" pentru a trimite automat articolele
- Ghost: Configurează webhook-uri în setările de publicare
- Notion: Folosește API-ul Notion pentru a sincroniza paginile

---

## 🤖 Chatbot AI Integrat

### Configurarea Chatbot-ului

#### Workflow: "AI Customer Support Chatbot"

1. **Webhook pentru Mesaje**
   ```json
   {
     "httpMethod": "POST",
     "path": "chatbot",
     "responseMode": "onReceived"
   }
   ```

2. **OpenAI Node Configuration**
   ```json
   {
     "resource": "chat",
     "operation": "message",
     "model": "gpt-3.5-turbo",
     "messages": [
       {
         "role": "system",
         "content": "Ești asistentul virtual al Sanel Factory, o companie specializată în printare 3D și gravură laser. Răspunde profesional și prietenos la întrebările clienților despre serviciile noastre. Cunoști următoarele servicii: Printare 3D FDM, Printare 3D SLA, Gravură Laser. Materialele disponibile includ PLA, PETG, ABS pentru FDM, rășini pentru SLA, și lemn/plexiglas pentru gravură laser."
       },
       {
         "role": "user",
         "content": "={{ $json.message }}"
       }
     ],
     "temperature": 0.7,
     "maxTokens": 500
   }
   ```

3. **Function Node pentru Procesare Răspuns**
   ```javascript
   const response = $json.choices[0].message.content;
   const userMessage = $('Webhook').first().json.message;
   const sessionId = $('Webhook').first().json.sessionId;

   // Salvează conversația pentru istoric
   const conversationData = {
     sessionId: sessionId,
     userMessage: userMessage,
     botResponse: response,
     timestamp: new Date().toISOString()
   };

   return {
     json: {
       response: response,
       sessionId: sessionId,
       conversation: conversationData
     }
   };
   ```

4. **HTTP Response Node**
   ```json
   {
     "statusCode": 200,
     "headers": {
       "Content-Type": "application/json"
     },
     "body": "={{ JSON.stringify({\"response\": $json.response, \"sessionId\": $json.sessionId}) }}"
   }
   ```

### Integrarea în Website

#### JavaScript pentru Chat Widget:
```javascript
class SanelChatbot {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.webhookUrl = 'http://localhost:5678/webhook/chatbot';
        this.init();
    }

    async sendMessage(message) {
        try {
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    sessionId: this.sessionId
                })
            });

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Chatbot error:', error);
            return 'Ne pare rău, am întâmpinat o problemă tehnică. Te rugăm să ne contactezi direct.';
        }
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}
```

### Configurări Avansate Chatbot

#### Integrare cu Baza de Date Cunoștințe:
```javascript
// Function Node pentru căutare în cunoștințe
const userQuestion = $json.message.toLowerCase();
const knowledgeBase = {
    'printare 3d': {
        response: 'Oferim servicii de printare 3D folosind tehnologiile FDM și SLA...',
        followUp: ['Ce material preferi?', 'Ai un fișier STL pregătit?']
    },
    'gravura laser': {
        response: 'Serviciile noastre de gravură laser includ personalizarea pe lemn, plexiglas...',
        followUp: ['Ce dimensiuni ai nevoie?', 'Ce material vrei să gravezi?']
    },
    'preturi': {
        response: 'Prețurile variază în funcție de material și complexitate. Folosește calculatorul nostru de prețuri...',
        followUp: ['Vrei să încarci un fișier pentru cotație?']
    }
};

// Căutare în baza de cunoștințe
let foundAnswer = null;
for (const [key, value] of Object.entries(knowledgeBase)) {
    if (userQuestion.includes(key)) {
        foundAnswer = value;
        break;
    }
}

if (foundAnswer) {
    return {
        json: {
            useKnowledgeBase: true,
            response: foundAnswer.response,
            followUp: foundAnswer.followUp
        }
    };
} else {
    return {
        json: {
            useKnowledgeBase: false,
            message: $json.message
        }
    };
}
```

---

## ⚙️ Webhook-uri și Configurări

### Configurarea în Admin Panel

1. **Accesează Admin Panel** (`/admin`)
2. **Mergi la tab-ul "Setări"**
3. **Completează URL-urile webhook-urilor:**
   - **Webhook N8N**: `http://localhost:5678/webhook/blog-publish`
   - **Webhook Chatbot**: `http://localhost:5678/webhook/chatbot`

### Testarea Webhook-urilor

#### Test Blog Webhook:
```bash
curl -X POST http://localhost:5678/webhook/blog-publish \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "content": "Acesta este un articol de test pentru a verifica funcționarea webhook-ului.",
    "category": "news"
  }'
```

#### Test Chatbot Webhook:
```bash
curl -X POST http://localhost:5678/webhook/chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Salut! Ce servicii oferiți?",
    "sessionId": "test_session_123"
  }'
```

---

## 📊 Exemple de Workflow-uri

### 1. Notificări Email pentru Comenzi Noi

```javascript
// Trigger: Webhook pentru comenzi noi
// URL: /webhook/new-order

// Function Node: Formatează email
const orderData = $json;
const emailContent = `
Comandă nouă primită!

Detalii client:
- Nume: ${orderData.name}
- Email: ${orderData.email}
- Telefon: ${orderData.phone}

Detalii comandă:
- Material: ${orderData.material}
- Culoare: ${orderData.color}
- Cantitate: ${orderData.quantity}
- Fișier: ${orderData.fileName}

Data comenzii: ${new Date().toLocaleString('ro-RO')}
`;

return {
    json: {
        to: 'comenzi@sanelfactory.ro',
        subject: `Comandă nouă #${orderData.id}`,
        content: emailContent
    }
};
```

### 2. Sincronizare Inventar

```javascript
// Workflow pentru actualizarea stocului de materiale
// Trigger: Cron job (zilnic la 09:00)

// HTTP Request Node: Verifică stocul curent
const materials = await fetch('http://localhost:3000/api/materials').then(r => r.json());

// Function Node: Verifică nivelurile critice
const lowStockAlerts = [];
Object.keys(materials).forEach(service => {
    Object.keys(materials[service]).forEach(material => {
        const stock = materials[service][material].stock || 0;
        const minStock = materials[service][material].minStock || 10;
        
        if (stock < minStock) {
            lowStockAlerts.push({
                service,
                material,
                currentStock: stock,
                minStock
            });
        }
    });
});

return { json: { alerts: lowStockAlerts } };
```

### 3. Backup Automat Date

```javascript
// Workflow pentru backup zilnic
// Trigger: Cron job (zilnic la 02:00)

// Function Node: Creează backup
const backupData = {
    timestamp: new Date().toISOString(),
    orders: await fetch('http://localhost:3000/api/orders').then(r => r.json()),
    projects: await fetch('http://localhost:3000/api/projects').then(r => r.json()),
    blog: await fetch('http://localhost:3000/api/blog').then(r => r.json()),
    testimonials: await fetch('http://localhost:3000/api/testimonials').then(r => r.json())
};

// Salvează în fișier sau trimite în cloud
return { 
    json: {
        filename: `backup_${new Date().toISOString().split('T')[0]}.json`,
        data: backupData
    }
};
```

---

## 🔧 Depanare și Suport

### Probleme Comune

#### 1. Webhook-ul nu funcționează
**Soluție:**
- Verifică că n8n rulează pe portul corect (5678)
- Testează URL-ul în browser: `http://localhost:5678/webhook/test`
- Verifică firewall-ul și setările de rețea

#### 2. Chatbot-ul nu răspunde
**Soluție:**
- Verifică API key-ul OpenAI în configurările n8n
- Testează conexiunea la API-ul OpenAI
- Verifică limitele de utilizare ale API-ului

#### 3. Articolele nu se publică automat
**Soluție:**
- Verifică formatul JSON al datelor trimise
- Testează endpoint-ul `/api/blog` manual
- Verifică autentificarea în header-ele HTTP

### Loguri și Monitorizare

#### Activarea Logurilor în N8N:
```bash
# Pornire cu loguri detaliate
N8N_LOG_LEVEL=debug n8n start
```

#### Monitorizare Webhook-uri:
```javascript
// Function Node pentru logging
const logData = {
    timestamp: new Date().toISOString(),
    webhook: $node.name,
    data: $json,
    success: true
};

console.log('Webhook executed:', JSON.stringify(logData, null, 2));
return { json: logData };
```

### Resurse Utile

- **Documentația N8N**: https://docs.n8n.io/
- **Comunitatea N8N**: https://community.n8n.io/
- **Exemple de Workflow-uri**: https://n8n.io/workflows/
- **API OpenAI**: https://platform.openai.com/docs/

---

## 🚀 Configurare Rapidă (Quick Start)

### Pentru Utilizatori Non-Tehnici:

1. **Descarcă și instalează N8N Desktop** (versiunea GUI)
2. **Importă template-urile** din folderul `n8n-templates/`
3. **Configurează API key-urile** în setările fiecărui workflow
4. **Testează webhook-urile** folosind butoanele de test
5. **Activează workflow-urile** pentru funcționare automată

### Template-uri Gata de Folosit:

- `blog-automation.json` - Automatizare publicare blog
- `chatbot-basic.json` - Chatbot simplu cu OpenAI
- `order-notifications.json` - Notificări comenzi noi
- `backup-system.json` - Sistem backup automat

---

## 📞 Contact și Suport

Pentru întrebări tehnice sau suport în configurarea n8n:

- **Email**: support@sanelfactory.ro
- **Telefon**: +40 XXX XXX XXX
- **Discord**: [Link către server-ul de suport]

---

*Documentul a fost creat pentru Sanel Factory - versiunea 1.0*
*Ultima actualizare: Decembrie 2024*