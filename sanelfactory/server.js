const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const bcrypt = require('bcrypt');
const session = require('express-session');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));
app.use(cors());
app.use(session({
    secret: 'sanelfactory-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 ore
}));

// Configurare multer pentru upload imagini
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/projects/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Doar fișiere imagine sunt permise!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Funcții helper pentru gestionarea datelor
async function ensureDataFiles() {
    const dataDir = 'data';
    const files = [
        'orders.json',
        'projects.json', 
        'testimonials.json',
        'blog-posts.json',
        'config.json'
    ];
    
    try {
        await fs.mkdir(dataDir, { recursive: true });
        await fs.mkdir('images/projects', { recursive: true });
        
        for (const file of files) {
            const filePath = path.join(dataDir, file);
            try {
                await fs.access(filePath);
            } catch {
                // Fișierul nu există, îl creez cu date inițiale
                let initialData = [];
                if (file === 'config.json') {
                    initialData = {
                        colors: [
                            { name: 'Alb', price: 0.5 },
                            { name: 'Negru', price: 0.5 },
                            { name: 'Roșu', price: 0.6 },
                            { name: 'Albastru', price: 0.6 },
                            { name: 'Verde', price: 0.6 },
                            { name: 'Galben', price: 0.7 },
                            { name: 'Portocaliu', price: 0.7 },
                            { name: 'Roz', price: 0.7 }
                        ],
                        prices: {
                            fdm: { base: 2.5, perGram: 0.05 },
                            sla: { base: 5.0, perGram: 0.08 },
                            laser: { base: 1.0, perCm2: 0.02 }
                        },
                        company: {
                            name: 'SanelFactory',
                            description: 'Servicii profesionale de printare 3D',
                            contact: {
                                email: 'contact@sanelfactory.ro',
                                phone: '+40 123 456 789',
                                address: 'România'
                            }
                        }
                    };
                }
                await fs.writeFile(filePath, JSON.stringify(initialData, null, 2));
            }
        }
    } catch (error) {
        console.error('Eroare la crearea fișierelor de date:', error);
    }
}

async function readDataFile(filename) {
    try {
        const data = await fs.readFile(`data/${filename}`, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Eroare la citirea ${filename}:`, error);
        return [];
    }
}

async function writeDataFile(filename, data) {
    try {
        await fs.writeFile(`data/${filename}`, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Eroare la scrierea ${filename}:`, error);
        return false;
    }
}

// Middleware de autentificare pentru admin
function requireAuth(req, res, next) {
    if (req.session.authenticated) {
        next();
    } else {
        res.status(401).json({ error: 'Necesită autentificare' });
    }
}

// Rute publice
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/blog.html'));
});

app.get('/projects', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/projects.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/admin.html'));
});

// API pentru blog
app.get('/api/blog-posts', async (req, res) => {
    try {
        const posts = await readDataFile('blog-posts.json');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Eroare la încărcarea articolelor' });
    }
});

// API pentru proiecte
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await readDataFile('projects.json');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Eroare la încărcarea proiectelor' });
    }
});

// API pentru testimoniale
app.get('/api/testimonials', async (req, res) => {
    try {
        const testimonials = await readDataFile('testimonials.json');
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ error: 'Eroare la încărcarea testimonialelor' });
    }
});

// API pentru configurare
app.get('/api/config', async (req, res) => {
    try {
        const config = await readDataFile('config.json');
        res.json(config);
    } catch (error) {
        res.status(500).json({ error: 'Eroare la încărcarea configurației' });
    }
});

// API pentru comenzi
app.post('/api/orders', async (req, res) => {
    try {
        const orders = await readDataFile('orders.json');
        const newOrder = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...req.body
        };
        orders.push(newOrder);
        await writeDataFile('orders.json', orders);
        res.json({ success: true, orderId: newOrder.id });
    } catch (error) {
        res.status(500).json({ error: 'Eroare la salvarea comenzii' });
    }
});

// Rute admin (necesită autentificare)
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Verificare credențiale hardcodate (în producție ar trebui să fie în DB)
    if (username === 'Marian' && password === 'Mingeci2') {
        req.session.authenticated = true;
        req.session.user = username;
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Credențiale invalide' });
    }
});

app.post('/api/admin/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// API pentru comenzi (admin)
app.get('/api/admin/orders', requireAuth, async (req, res) => {
    try {
        const orders = await readDataFile('orders.json');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Eroare la încărcarea comenzilor' });
    }
});

// API pentru proiecte (admin)
app.post('/api/admin/projects', requireAuth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nu s-a încărcat nicio imagine' });
        }

        const projects = await readDataFile('projects.json');
        const newProject = {
            id: Date.now().toString(),
            title: req.body.title,
            description: req.body.description,
            image: req.file.filename,
            timestamp: new Date().toISOString()
        };
        
        projects.push(newProject);
        await writeDataFile('projects.json', projects);
        res.json({ success: true, project: newProject });
    } catch (error) {
        res.status(500).json({ error: 'Eroare la salvarea proiectului' });
    }
});

app.delete('/api/admin/projects/:id', requireAuth, async (req, res) => {
    try {
        const projects = await readDataFile('projects.json');
        const filteredProjects = projects.filter(p => p.id !== req.params.id);
        await writeDataFile('projects.json', filteredProjects);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Eroare la ștergerea proiectului' });
    }
});

// API pentru testimoniale (admin)
app.post('/api/admin/testimonials', requireAuth, async (req, res) => {
    try {
        const testimonials = await readDataFile('testimonials.json');
        const newTestimonial = {
            id: Date.now().toString(),
            ...req.body,
            timestamp: new Date().toISOString()
        };
        testimonials.push(newTestimonial);
        await writeDataFile('testimonials.json', testimonials);
        res.json({ success: true, testimonial: newTestimonial });
    } catch (error) {
        res.status(500).json({ error: 'Eroare la salvarea testimonialului' });
    }
});

app.put('/api/admin/testimonials/:id', requireAuth, async (req, res) => {
    try {
        const testimonials = await readDataFile('testimonials.json');
        const index = testimonials.findIndex(t => t.id === req.params.id);
        if (index !== -1) {
            testimonials[index] = { ...testimonials[index], ...req.body };
            await writeDataFile('testimonials.json', testimonials);
            res.json({ success: true, testimonial: testimonials[index] });
        } else {
            res.status(404).json({ error: 'Testimonialul nu a fost găsit' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Eroare la actualizarea testimonialului' });
    }
});

app.delete('/api/admin/testimonials/:id', requireAuth, async (req, res) => {
    try {
        const testimonials = await readDataFile('testimonials.json');
        const filteredTestimonials = testimonials.filter(t => t.id !== req.params.id);
        await writeDataFile('testimonials.json', filteredTestimonials);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Eroare la ștergerea testimonialului' });
    }
});

// API pentru configurare (admin)
app.put('/api/admin/config', requireAuth, async (req, res) => {
    try {
        const config = await readDataFile('config.json');
        const updatedConfig = { ...config, ...req.body };
        await writeDataFile('config.json', updatedConfig);
        res.json({ success: true, config: updatedConfig });
    } catch (error) {
        res.status(500).json({ error: 'Eroare la actualizarea configurației' });
    }
});

// API pentru blog posts (admin)
app.post('/api/admin/blog-posts', requireAuth, async (req, res) => {
    try {
        const posts = await readDataFile('blog-posts.json');
        const newPost = {
            id: Date.now().toString(),
            ...req.body,
            timestamp: new Date().toISOString()
        };
        posts.push(newPost);
        await writeDataFile('blog-posts.json', posts);
        res.json({ success: true, post: newPost });
    } catch (error) {
        res.status(500).json({ error: 'Eroare la salvarea articolului' });
    }
});

app.put('/api/admin/blog-posts/:id', requireAuth, async (req, res) => {
    try {
        const posts = await readDataFile('blog-posts.json');
        const index = posts.findIndex(p => p.id === req.params.id);
        if (index !== -1) {
            posts[index] = { ...posts[index], ...req.body };
            await writeDataFile('blog-posts.json', posts);
            res.json({ success: true, post: posts[index] });
        } else {
            res.status(404).json({ error: 'Articolul nu a fost găsit' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Eroare la actualizarea articolului' });
    }
});

app.delete('/api/admin/blog-posts/:id', requireAuth, async (req, res) => {
    try {
        const posts = await readDataFile('blog-posts.json');
        const filteredPosts = posts.filter(p => p.id !== req.params.id);
        await writeDataFile('blog-posts.json', filteredPosts);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Eroare la ștergerea articolului' });
    }
});

// Webhook pentru n8n
app.post('/api/webhook/n8n', async (req, res) => {
    try {
        const { type, data } = req.body;
        
        switch (type) {
            case 'blog_post':
                const posts = await readDataFile('blog-posts.json');
                posts.push({
                    id: Date.now().toString(),
                    ...data,
                    timestamp: new Date().toISOString(),
                    source: 'n8n'
                });
                await writeDataFile('blog-posts.json', posts);
                break;
                
            case 'order':
                const orders = await readDataFile('orders.json');
                orders.push({
                    id: Date.now().toString(),
                    ...data,
                    timestamp: new Date().toISOString(),
                    source: 'n8n'
                });
                await writeDataFile('orders.json', orders);
                break;
                
            default:
                return res.status(400).json({ error: 'Tip de webhook necunoscut' });
        }
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Eroare la procesarea webhook-ului' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        port: PORT 
    });
});

// Server control endpoints (admin only)
app.post('/api/admin/server/start', requireAuth, (req, res) => {
    // In a real implementation, this would start the server process
    // For now, we'll just return a success message since the server is already running
    res.json({ 
        success: true, 
        message: 'Server is already running',
        port: PORT 
    });
});

app.post('/api/admin/server/stop', requireAuth, (req, res) => {
    // In a real implementation, this would stop the server process
    // For safety, we'll not actually stop the server but return a message
    res.json({ 
        success: true, 
        message: 'Server stop command received. Please stop manually for safety.',
        warning: 'Automatic server stop is disabled for safety reasons.'
    });
});

// Pornire server
async function startServer() {
    await ensureDataFiles();
    
    app.listen(PORT, () => {
        console.log(`🚀 Serverul SanelFactory rulează pe portul ${PORT}`);
        console.log(`📱 Accesează: http://localhost:${PORT}`);
        console.log(`🔧 Admin panel: http://localhost:${PORT}/admin`);
    });
}

startServer().catch(console.error);