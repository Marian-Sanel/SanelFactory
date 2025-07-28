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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Session configuration
app.use(session({
    secret: 'sanel-factory-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

// Helper functions
async function ensureDataFiles() {
    try {
        // Ensure data directory exists
        await fs.mkdir('data', { recursive: true });
        
        // Ensure uploads directory exists
        await fs.mkdir('uploads', { recursive: true });
        await fs.mkdir('uploads/projects', { recursive: true });
        await fs.mkdir('uploads/stl', { recursive: true });
        
        // Initialize data files if they don't exist
        const dataFiles = [
            { file: 'data/orders.json', default: [] },
            { file: 'data/projects.json', default: [] },
            { file: 'data/testimonials.json', default: [] },
            { file: 'data/materials.json', default: {
                fdm: {
                    PLA: { price: 25, colors: ['Alb', 'Negru', 'Roșu', 'Albastru', 'Verde', 'Galben'] },
                    PETG: { price: 35, colors: ['Transparent', 'Negru', 'Alb', 'Roșu'] },
                    ABS: { price: 30, colors: ['Negru', 'Alb', 'Gri'] }
                },
                sla: {
                    'Standard Resin': { price: 80, colors: ['Gri', 'Negru', 'Alb'] },
                    'Tough Resin': { price: 120, colors: ['Negru', 'Gri'] }
                },
                laser: {
                    'Lemn 3mm': { price: 15, colors: ['Natural'] },
                    'Plexiglas 3mm': { price: 25, colors: ['Transparent', 'Negru', 'Alb'] }
                }
            }},
            { file: 'data/blog.json', default: [] },
            { file: 'data/settings.json', default: {
                siteName: 'Sanel Factory',
                logo: '/images/logo.png',
                toneOfVoice: 'profesional și prietenos',
                webhooks: {
                    n8n: '',
                    chatbot: ''
                }
            }}
        ];

        for (const { file, default: defaultData } of dataFiles) {
            try {
                await fs.access(file);
            } catch {
                await fs.writeFile(file, JSON.stringify(defaultData, null, 2));
            }
        }
    } catch (error) {
        console.error('Error ensuring data files:', error);
    }
}

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.authenticated) {
        next();
    } else {
        res.status(401).json({ error: 'Authentication required' });
    }
}

// Routes

// Serve static pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/blog.html'));
});

app.get('/proiecte', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/proiecte.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/admin.html'));
});

// Admin authentication
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Hardcoded credentials as requested
    if (username === 'Marian' && password === 'Mingeci2') {
        req.session.authenticated = true;
        req.session.username = username;
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.post('/api/admin/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

app.get('/api/admin/check', (req, res) => {
    res.json({ authenticated: !!req.session.authenticated });
});

// Orders API
app.post('/api/orders', async (req, res) => {
    try {
        const orderData = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...req.body
        };

        const orders = JSON.parse(await fs.readFile('data/orders.json', 'utf8'));
        orders.push(orderData);
        await fs.writeFile('data/orders.json', JSON.stringify(orders, null, 2));

        res.json({ success: true, orderId: orderData.id });
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ error: 'Failed to save order' });
    }
});

app.get('/api/orders', requireAuth, async (req, res) => {
    try {
        const orders = JSON.parse(await fs.readFile('data/orders.json', 'utf8'));
        res.json(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
        res.status(500).json({ error: 'Failed to load orders' });
    }
});

// Projects API
app.get('/api/projects', async (req, res) => {
    try {
        const projects = JSON.parse(await fs.readFile('data/projects.json', 'utf8'));
        res.json(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
        res.status(500).json({ error: 'Failed to load projects' });
    }
});

app.post('/api/projects', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const imagePath = req.file ? `/uploads/projects/${req.file.filename}` : null;

        const projectData = {
            id: Date.now().toString(),
            title,
            description,
            image: imagePath,
            createdAt: new Date().toISOString()
        };

        const projects = JSON.parse(await fs.readFile('data/projects.json', 'utf8'));
        projects.push(projectData);
        await fs.writeFile('data/projects.json', JSON.stringify(projects, null, 2));

        res.json({ success: true, project: projectData });
    } catch (error) {
        console.error('Error saving project:', error);
        res.status(500).json({ error: 'Failed to save project' });
    }
});

// Blog API
app.get('/api/blog', async (req, res) => {
    try {
        const blog = JSON.parse(await fs.readFile('data/blog.json', 'utf8'));
        res.json(blog);
    } catch (error) {
        console.error('Error loading blog:', error);
        res.status(500).json({ error: 'Failed to load blog' });
    }
});

app.post('/api/blog', requireAuth, async (req, res) => {
    try {
        const articleData = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            ...req.body
        };

        const blog = JSON.parse(await fs.readFile('data/blog.json', 'utf8'));
        blog.push(articleData);
        await fs.writeFile('data/blog.json', JSON.stringify(blog, null, 2));

        res.json({ success: true, article: articleData });
    } catch (error) {
        console.error('Error saving article:', error);
        res.status(500).json({ error: 'Failed to save article' });
    }
});

// Materials API
app.get('/api/materials', async (req, res) => {
    try {
        const materials = JSON.parse(await fs.readFile('data/materials.json', 'utf8'));
        res.json(materials);
    } catch (error) {
        console.error('Error loading materials:', error);
        res.status(500).json({ error: 'Failed to load materials' });
    }
});

app.put('/api/materials', requireAuth, async (req, res) => {
    try {
        await fs.writeFile('data/materials.json', JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving materials:', error);
        res.status(500).json({ error: 'Failed to save materials' });
    }
});

// Testimonials API
app.get('/api/testimonials', async (req, res) => {
    try {
        const testimonials = JSON.parse(await fs.readFile('data/testimonials.json', 'utf8'));
        res.json(testimonials);
    } catch (error) {
        console.error('Error loading testimonials:', error);
        res.status(500).json({ error: 'Failed to load testimonials' });
    }
});

app.post('/api/testimonials', requireAuth, async (req, res) => {
    try {
        const testimonialData = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            ...req.body
        };

        const testimonials = JSON.parse(await fs.readFile('data/testimonials.json', 'utf8'));
        testimonials.push(testimonialData);
        await fs.writeFile('data/testimonials.json', JSON.stringify(testimonials, null, 2));

        res.json({ success: true, testimonial: testimonialData });
    } catch (error) {
        console.error('Error saving testimonial:', error);
        res.status(500).json({ error: 'Failed to save testimonial' });
    }
});

// Settings API
app.get('/api/settings', requireAuth, async (req, res) => {
    try {
        const settings = JSON.parse(await fs.readFile('data/settings.json', 'utf8'));
        res.json(settings);
    } catch (error) {
        console.error('Error loading settings:', error);
        res.status(500).json({ error: 'Failed to load settings' });
    }
});

app.put('/api/settings', requireAuth, async (req, res) => {
    try {
        await fs.writeFile('data/settings.json', JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving settings:', error);
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

// File upload for STL files
app.post('/api/upload-stl', upload.single('stlFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.json({ 
        success: true, 
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
    });
});

// Initialize and start server
async function startServer() {
    await ensureDataFiles();
    
    app.listen(PORT, () => {
        console.log(`🚀 Sanel Factory server running on http://localhost:${PORT}`);
        console.log(`📁 Static files served from: ${__dirname}`);
        console.log(`🔧 Admin panel: http://localhost:${PORT}/admin`);
        console.log(`📝 Blog: http://localhost:${PORT}/blog`);
        console.log(`🖼️  Projects: http://localhost:${PORT}/proiecte`);
    });
}

startServer().catch(console.error);

module.exports = app;