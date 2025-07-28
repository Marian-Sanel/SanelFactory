// Chatbot functionality for Sanel Factory

document.addEventListener('DOMContentLoaded', function() {
    initChatbot();
});

// Chatbot initialization
function initChatbot() {
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    
    let isOpen = false;
    
    // Toggle chatbot window
    if (chatbotButton) {
        chatbotButton.addEventListener('click', function() {
            toggleChatbot();
        });
    }
    
    // Close chatbot
    if (chatbotClose) {
        chatbotClose.addEventListener('click', function() {
            closeChatbot();
        });
    }
    
    // Send message
    if (chatbotSend) {
        chatbotSend.addEventListener('click', function() {
            sendMessage();
        });
    }
    
    // Send message on Enter key
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Close on outside click
    document.addEventListener('click', function(e) {
        if (isOpen && !chatbotButton.contains(e.target) && !chatbotWindow.contains(e.target)) {
            closeChatbot();
        }
    });
    
    function toggleChatbot() {
        if (isOpen) {
            closeChatbot();
        } else {
            openChatbot();
        }
    }
    
    function openChatbot() {
        chatbotWindow.classList.add('active');
        isOpen = true;
        
        // Focus input
        setTimeout(() => {
            if (chatbotInput) chatbotInput.focus();
        }, 300);
        
        // Show welcome message if first time
        if (!localStorage.getItem('chatbot_welcomed')) {
            setTimeout(() => {
                addBotMessage('Bună! Sunt asistentul virtual Sanel Factory. Te pot ajuta cu informații despre serviciile noastre de printare 3D. Cu ce te pot ajuta?');
                localStorage.setItem('chatbot_welcomed', 'true');
            }, 500);
        }
    }
    
    function closeChatbot() {
        chatbotWindow.classList.remove('active');
        isOpen = false;
    }
    
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;
        
        // Add user message
        addUserMessage(message);
        
        // Clear input
        chatbotInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Process message and respond
        setTimeout(() => {
            hideTypingIndicator();
            const response = processMessage(message);
            addBotMessage(response);
        }, 1000 + Math.random() * 1000); // Random delay for realism
    }
    
    function addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.textContent = message;
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    function addBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = message;
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }
    
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
        typingDiv.id = 'typing-indicator';
        chatbotMessages.appendChild(typingDiv);
        scrollToBottom();
    }
    
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
}

// Message processing and AI responses
function processMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Greeting responses
    if (containsAny(lowerMessage, ['salut', 'bună', 'hello', 'hi', 'bună ziua', 'bună seara'])) {
        return randomChoice([
            'Salut! Cu ce te pot ajuta astăzi?',
            'Bună! Sunt aici să răspund la întrebările tale despre printarea 3D.',
            'Salut! Ce informații îți pot oferi despre serviciile noastre?'
        ]);
    }
    
    // Pricing questions
    if (containsAny(lowerMessage, ['preț', 'cost', 'cât', 'tarif', 'prețuri'])) {
        return `Prețurile noastre depind de mai mulți factori:
        
<strong>Printare FDM:</strong>
• PLA: 2 RON/cm³
• PETG: 2.5 RON/cm³
• ABS: 2.2 RON/cm³

<strong>Printare SLA:</strong>
• Rășină standard: 5 RON/cm³
• Rășină transparentă: 6 RON/cm³

Pentru o estimare exactă, te rog să folosești <a href="pages/upload.html">calculatorul nostru online</a> sau să încarci fișierul STL.`;
    }
    
    // Materials questions
    if (containsAny(lowerMessage, ['material', 'materiale', 'pla', 'petg', 'abs', 'rășină'])) {
        return `Avem o gamă largă de materiale disponibile:

<strong>Pentru FDM:</strong>
• PLA - perfect pentru începători, biodegradabil
• PETG - rezistent chimic, transparent
• ABS - rezistent la temperaturi înalte
• TPU - flexibil, pentru obiecte elastice
• Wood Fill - aspect de lemn
• Carbon Fiber - foarte rezistent

<strong>Pentru SLA:</strong>
• Rășină standard - detalii fine
• Rășină transparentă - pentru obiecte transparente
• Rășină flexibilă - pentru piese elastice
• Rășină castabilă - pentru bijuterii

Ce tip de proiect ai în vedere?`;
    }
    
    // Technology questions
    if (containsAny(lowerMessage, ['fdm', 'sla', 'diferența', 'tehnologie', 'ce să aleg'])) {
        return `<strong>FDM (Fused Deposition Modeling):</strong>
• Folosește filament încălzit
• Ideal pentru prototipuri și piese funcționale
• Volum de printare mare
• Preț accesibil

<strong>SLA (Stereolithography):</strong>
• Folosește rășină și laser UV
• Detalii foarte fine (0.01mm)
• Finisaj neted
• Perfect pentru miniaturi și bijuterii

<strong>Recomandarea mea:</strong>
• Pentru prototipuri mari → FDM
• Pentru detalii fine → SLA

Ce tip de obiect vrei să printezi?`;
    }
    
    // Time/delivery questions
    if (containsAny(lowerMessage, ['timp', 'cât durează', 'livrare', 'când', 'rapid'])) {
        return `<strong>Timpi de execuție:</strong>
• Piese simple (sub 50cm³): 24h
• Piese medii: 24-48h
• Piese complexe: 2-3 zile

<strong>Opțiuni de livrare:</strong>
• Ridicare personală: Gratis
• Curier în România: +15 RON (24-48h)
• Express București: +35 RON (aceeași zi)

Pentru comenzi urgente, te rog să ne contactezi telefonic la +40 XXX XXX XXX.`;
    }
    
    // File format questions
    if (containsAny(lowerMessage, ['format', 'fișier', 'stl', 'obj', 'ce format'])) {
        return `Acceptăm următoarele formate de fișiere:

<strong>Recomandate:</strong>
• STL - cel mai comun format
• OBJ - cu texturi
• 3MF - format Microsoft 3D

<strong>Profesionale:</strong>
• STEP - pentru inginerie
• IGES - pentru CAD

<strong>Cerințe:</strong>
• Dimensiune maximă: 50MB
• Rezoluție recomandată: 0.1-0.2mm

Poți încărca fișierul direct pe <a href="pages/upload.html">pagina de upload</a>.`;
    }
    
    // Quality questions
    if (containsAny(lowerMessage, ['calitate', 'rezoluție', 'layer', 'finisaj'])) {
        return `<strong>Opțiuni de calitate disponibile:</strong>

<strong>FDM:</strong>
• 0.1mm - Foarte fină (detalii mici)
• 0.15mm - Fină (echilibru calitate/timp)
• 0.2mm - Standard (recomandat)
• 0.3mm - Rapidă (prototipuri)

<strong>SLA:</strong>
• 0.01mm - Rezoluție extremă
• Finisaj neted din fabrică
• Post-procesare disponibilă

Ce nivel de detaliu îți dorești pentru proiectul tău?`;
    }
    
    // Contact questions
    if (containsAny(lowerMessage, ['contact', 'telefon', 'email', 'adresă', 'unde'])) {
        return `<strong>Date de contact:</strong>

📧 <strong>Email:</strong> contact@sanelfactory.ro
📞 <strong>Telefon:</strong> +40 XXX XXX XXX
📍 <strong>Adresă:</strong> București, România

<strong>Program:</strong>
• Luni - Vineri: 09:00 - 18:00
• Sâmbătă: 10:00 - 14:00

Pentru comenzi urgente sau întrebări tehnice, sună-ne direct!`;
    }
    
    // Services questions
    if (containsAny(lowerMessage, ['servicii', 'ce faceți', 'ce oferiți'])) {
        return `<strong>Serviciile noastre complete:</strong>

🖨️ <strong>Printare 3D:</strong>
• FDM (filament)
• SLA (rășină)

✏️ <strong>Design:</strong>
• Modelare CAD
• Optimizare pentru printare
• Reverse engineering

🔥 <strong>Gravură laser:</strong>
• Lemn, acrilic, piele
• Personalizare produse

🎨 <strong>Post-procesare:</strong>
• Șlefuire și finisaj
• Vopsire profesională
• Asamblare piese

Ce tip de serviciu te interesează?`;
    }
    
    // CAD/Design questions
    if (containsAny(lowerMessage, ['cad', 'design', 'modelare', 'nu am fișier', 'fără fișier'])) {
        return `<strong>Servicii de design și modelare CAD:</strong>

✅ <strong>Ce includem:</strong>
• Modelare 3D de la zero
• Optimizare pentru printare 3D
• Modificări și adaptări
• Documentație tehnică

💡 <strong>Proces:</strong>
1. Îmi trimiți schița/ideea
2. Creez modelul 3D
3. Îți trimit preview-ul
4. Printăm după aprobare

💰 <strong>Preț:</strong> 50-150 RON/oră (depinde de complexitate)

Ai o schiță sau poți descrie ce vrei să creezi?`;
    }
    
    // Troubleshooting questions
    if (containsAny(lowerMessage, ['problemă', 'eroare', 'nu merge', 'defect'])) {
        return `<strong>Probleme comune și soluții:</strong>

🔧 <strong>Fișierul nu se încarcă:</strong>
• Verifică formatul (STL, OBJ, 3MF)
• Dimensiunea maximă: 50MB

⚠️ <strong>Modelul are erori:</strong>
• Trimite-ne fișierul, îl reparăm gratuit
• Folosim software profesional de reparare

📏 <strong>Dimensiuni greșite:</strong>
• Specifică dimensiunile dorite în observații
• Putem scala modelul

Descrie-mi problema ta specifică și te voi ajuta!`;
    }
    
    // Payment questions
    if (containsAny(lowerMessage, ['plată', 'cum plătesc', 'card', 'transfer', 'factura'])) {
        return `<strong>Modalități de plată acceptate:</strong>

💳 <strong>Online:</strong>
• Card bancar (Visa, Mastercard)
• PayPal
• Transfer bancar

💰 <strong>La ridicare:</strong>
• Numerar
• Card POS

📄 <strong>Facturare:</strong>
• Facturi pentru persoane fizice
• Facturi cu TVA pentru firme
• Trimitem facturile pe email

Preferi să plătești online sau la ridicare?`;
    }
    
    // Thank you responses
    if (containsAny(lowerMessage, ['mulțumesc', 'mersi', 'thanks', 'ms'])) {
        return randomChoice([
            'Cu plăcere! Dacă mai ai întrebări, sunt aici să te ajut.',
            'Îmi pare bine că te-am putut ajuta! Pentru comenzi, folosește formularul de pe site.',
            'Mulțumesc și eu! Nu ezita să mă întrebi orice despre printarea 3D.'
        ]);
    }
    
    // Goodbye responses
    if (containsAny(lowerMessage, ['pa', 'bye', 'la revedere', 'pe curând'])) {
        return randomChoice([
            'La revedere! Să ai o zi frumoasă!',
            'Pe curând! Așteptăm comanda ta.',
            'Pa pa! Revino oricând cu întrebări.'
        ]);
    }
    
    // Default response for unrecognized messages
    return `Nu sunt sigur că înțeleg întrebarea ta. Pot să te ajut cu informații despre:

• 💰 Prețuri și costuri
• 🔧 Materiale și tehnologii
• ⏱️ Timpi de execuție
• 📁 Formate de fișiere
• 🎨 Servicii de design
• 📞 Date de contact

Sau poți să:
• <a href="pages/upload.html">Încarci un fișier STL</a> pentru ofertă
• <a href="#contact">Ne contactezi direct</a>
• Reformulezi întrebarea

Cu ce anume te pot ajuta?`;
}

// Helper functions
function containsAny(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
}

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Add CSS for typing indicator
const typingCSS = `
.typing-indicator {
    padding: 8px 12px !important;
}

.typing-dots {
    display: flex;
    gap: 4px;
    align-items: center;
}

.typing-dots span {
    width: 6px;
    height: 6px;
    background: var(--accent-coral);
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
    0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.5;
    }
    40% {
        transform: scale(1);
        opacity: 1;
    }
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = typingCSS;
document.head.appendChild(style);

// Advanced chatbot features
class ChatbotAnalytics {
    constructor() {
        this.conversations = [];
        this.currentSession = {
            startTime: Date.now(),
            messages: [],
            userSatisfaction: null
        };
    }
    
    logMessage(type, message) {
        this.currentSession.messages.push({
            type: type, // 'user' or 'bot'
            message: message,
            timestamp: Date.now()
        });
    }
    
    endSession(satisfaction = null) {
        this.currentSession.userSatisfaction = satisfaction;
        this.currentSession.endTime = Date.now();
        this.conversations.push({...this.currentSession});
        
        // Reset for new session
        this.currentSession = {
            startTime: Date.now(),
            messages: [],
            userSatisfaction: null
        };
    }
    
    getAnalytics() {
        return {
            totalConversations: this.conversations.length,
            averageSessionLength: this.conversations.reduce((acc, conv) => 
                acc + (conv.endTime - conv.startTime), 0) / this.conversations.length || 0,
            commonQuestions: this.getMostCommonQuestions(),
            satisfactionRate: this.getSatisfactionRate()
        };
    }
    
    getMostCommonQuestions() {
        const questions = {};
        this.conversations.forEach(conv => {
            conv.messages.filter(msg => msg.type === 'user').forEach(msg => {
                const category = this.categorizeMessage(msg.message);
                questions[category] = (questions[category] || 0) + 1;
            });
        });
        return Object.entries(questions).sort((a, b) => b[1] - a[1]).slice(0, 5);
    }
    
    categorizeMessage(message) {
        const lowerMessage = message.toLowerCase();
        if (containsAny(lowerMessage, ['preț', 'cost', 'cât'])) return 'Pricing';
        if (containsAny(lowerMessage, ['material', 'pla', 'petg'])) return 'Materials';
        if (containsAny(lowerMessage, ['timp', 'durează', 'livrare'])) return 'Delivery';
        if (containsAny(lowerMessage, ['format', 'stl', 'fișier'])) return 'File Formats';
        if (containsAny(lowerMessage, ['calitate', 'rezoluție'])) return 'Quality';
        return 'Other';
    }
    
    getSatisfactionRate() {
        const ratings = this.conversations
            .filter(conv => conv.userSatisfaction !== null)
            .map(conv => conv.userSatisfaction);
        
        return ratings.length > 0 ? 
            ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length : 0;
    }
}

// Initialize analytics (optional)
const chatbotAnalytics = new ChatbotAnalytics();

// Export for potential use
window.chatbotAnalytics = chatbotAnalytics;