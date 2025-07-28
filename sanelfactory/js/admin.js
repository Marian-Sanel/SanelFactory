// Admin panel functionality
class AdminPanel {
    constructor() {
        this.isAuthenticated = false;
        this.currentTab = 'orders';
        
        this.init();
    }

    async init() {
        await this.checkAuthentication();
        this.setupEventListeners();
        
        if (this.isAuthenticated) {
            this.showDashboard();
            this.loadTabContent(this.currentTab);
        } else {
            this.showLogin();
        }
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Tab buttons
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleTabClick(e));
        });

        // Project modal
        this.setupProjectModal();

        // Settings form
        const settingsForm = document.getElementById('settings-form');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => this.handleSettingsSubmit(e));
        }

        // Materials save button
        const saveMaterialsBtn = document.getElementById('save-materials-btn');
        if (saveMaterialsBtn) {
            saveMaterialsBtn.addEventListener('click', () => this.saveMaterials());
        }
    }

    setupProjectModal() {
        const addProjectBtn = document.getElementById('add-project-btn');
        const projectModal = document.getElementById('project-modal');
        const closeModalBtn = document.getElementById('close-project-modal');
        const cancelBtn = document.getElementById('cancel-project-btn');
        const addProjectForm = document.getElementById('add-project-form');

        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', () => this.showProjectModal());
        }

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.hideProjectModal());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideProjectModal());
        }

        if (projectModal) {
            projectModal.addEventListener('click', (e) => {
                if (e.target === projectModal) {
                    this.hideProjectModal();
                }
            });
        }

        if (addProjectForm) {
            addProjectForm.addEventListener('submit', (e) => this.handleAddProject(e));
        }
    }

    async checkAuthentication() {
        try {
            const response = await fetch('/api/admin/check');
            const data = await response.json();
            this.isAuthenticated = data.authenticated;
        } catch (error) {
            console.error('Error checking authentication:', error);
            this.isAuthenticated = false;
        }
    }

    showLogin() {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('admin-dashboard').classList.add('hidden');
    }

    showDashboard() {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.remove('hidden');
        
        // Set admin username
        const usernameEl = document.getElementById('admin-username');
        if (usernameEl) {
            usernameEl.textContent = 'Marian';
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const loginBtn = document.getElementById('login-btn');
        const errorDiv = document.getElementById('login-error');
        
        // Disable button and show loading
        loginBtn.disabled = true;
        loginBtn.textContent = 'Se conectează...';
        errorDiv.classList.add('hidden');
        
        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.get('username'),
                    password: formData.get('password')
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.isAuthenticated = true;
                this.showDashboard();
                this.loadTabContent(this.currentTab);
            } else {
                errorDiv.textContent = 'Credențiale invalide';
                errorDiv.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Login error:', error);
            errorDiv.textContent = 'Eroare de conectare. Încercați din nou.';
            errorDiv.classList.remove('hidden');
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Conectează-te';
        }
    }

    async handleLogout() {
        try {
            await fetch('/api/admin/logout', {
                method: 'POST'
            });
            
            this.isAuthenticated = false;
            this.showLogin();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    handleTabClick(e) {
        const tabName = e.target.dataset.tab;
        
        // Update active tab button
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Show/hide tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        document.getElementById(`${tabName}-tab`).classList.remove('hidden');
        
        this.currentTab = tabName;
        this.loadTabContent(tabName);
    }

    async loadTabContent(tabName) {
        switch (tabName) {
            case 'orders':
                await this.loadOrders();
                break;
            case 'projects':
                await this.loadProjects();
                break;
            case 'blog':
                await this.loadBlog();
                break;
            case 'testimonials':
                await this.loadTestimonials();
                break;
            case 'materials':
                await this.loadMaterials();
                break;
            case 'settings':
                await this.loadSettings();
                break;
        }
    }

    async loadOrders() {
        try {
            const response = await fetch('/api/orders');
            const orders = await response.json();
            
            const tbody = document.getElementById('orders-table-body');
            if (!tbody) return;
            
            if (orders.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="9" class="text-center py-8 text-gray-400">Nu există comenzi</td>
                    </tr>
                `;
                return;
            }
            
            tbody.innerHTML = orders.map(order => `
                <tr>
                    <td>${this.formatDate(order.timestamp)}</td>
                    <td>${order.name || '-'}</td>
                    <td>${order.email || '-'}</td>
                    <td>${order.fileName || '-'}</td>
                    <td>${order.material || '-'}</td>
                    <td>${order.color || '-'}</td>
                    <td>${order.quality || '-'}</td>
                    <td>${order.quantity || '-'}</td>
                    <td>
                        <button 
                            onclick="adminPanel.viewOrder('${order.id}')"
                            class="px-3 py-1 bg-neon-cyan text-black rounded text-sm hover:scale-105 transition-transform duration-300"
                        >
                            Vezi
                        </button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    }

    async loadProjects() {
        try {
            const response = await fetch('/api/projects');
            const projects = await response.json();
            
            const grid = document.getElementById('projects-grid');
            if (!grid) return;
            
            if (projects.length === 0) {
                grid.innerHTML = `
                    <div class="col-span-full text-center py-8 text-gray-400">
                        Nu există proiecte. Adaugă primul proiect!
                    </div>
                `;
                return;
            }
            
            grid.innerHTML = projects.map(project => `
                <div class="glass-effect rounded-lg overflow-hidden neon-border">
                    <img 
                        src="${project.image || '/images/default-project.jpg'}" 
                        alt="${project.title}"
                        class="w-full h-48 object-cover"
                        onerror="this.src='/images/default-project.jpg'"
                    >
                    <div class="p-4">
                        <h3 class="font-bold mb-2">${project.title}</h3>
                        <p class="text-gray-300 text-sm mb-3 line-clamp-2">${project.description}</p>
                        <div class="flex justify-between items-center">
                            <span class="px-2 py-1 bg-neon-cyan text-black rounded text-xs">
                                ${this.getCategoryName(project.category)}
                            </span>
                            <button 
                                onclick="adminPanel.deleteProject('${project.id}')"
                                class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:scale-105 transition-transform duration-300"
                            >
                                Șterge
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }

    async loadBlog() {
        try {
            const response = await fetch('/api/blog');
            const articles = await response.json();
            
            const list = document.getElementById('articles-list');
            if (!list) return;
            
            if (articles.length === 0) {
                list.innerHTML = `
                    <div class="text-center py-8 text-gray-400">
                        Nu există articole. Adaugă primul articol!
                    </div>
                `;
                return;
            }
            
            list.innerHTML = articles.map(article => `
                <div class="glass-effect rounded-lg p-4 neon-border">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <h3 class="font-bold mb-2">${article.title}</h3>
                            <p class="text-gray-300 text-sm mb-2">${article.excerpt || article.content.substring(0, 100) + '...'}</p>
                            <div class="flex items-center text-xs text-gray-400">
                                <span>${this.formatDate(article.createdAt)}</span>
                                <span class="mx-2">•</span>
                                <span>${this.getCategoryName(article.category)}</span>
                            </div>
                        </div>
                        <button 
                            onclick="adminPanel.deleteArticle('${article.id}')"
                            class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:scale-105 transition-transform duration-300 ml-4"
                        >
                            Șterge
                        </button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading blog:', error);
        }
    }

    async loadTestimonials() {
        try {
            const response = await fetch('/api/testimonials');
            const testimonials = await response.json();
            
            const list = document.getElementById('testimonials-list');
            if (!list) return;
            
            if (testimonials.length === 0) {
                list.innerHTML = `
                    <div class="text-center py-8 text-gray-400">
                        Nu există testimoniale. Adaugă primul testimonial!
                    </div>
                `;
                return;
            }
            
            list.innerHTML = testimonials.map(testimonial => `
                <div class="glass-effect rounded-lg p-4 neon-border">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <h3 class="font-bold mb-2">${testimonial.name}</h3>
                            <p class="text-gray-300 text-sm mb-2">"${testimonial.message}"</p>
                            <div class="flex items-center text-xs text-gray-400">
                                <span>${testimonial.company || 'Client particular'}</span>
                                <span class="mx-2">•</span>
                                <span>${this.formatDate(testimonial.createdAt)}</span>
                            </div>
                        </div>
                        <button 
                            onclick="adminPanel.deleteTestimonial('${testimonial.id}')"
                            class="px-3 py-1 bg-red-600 text-white rounded text-sm hover:scale-105 transition-transform duration-300 ml-4"
                        >
                            Șterge
                        </button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading testimonials:', error);
        }
    }

    async loadMaterials() {
        try {
            const response = await fetch('/api/materials');
            const materials = await response.json();
            
            const editor = document.getElementById('materials-editor');
            if (!editor) return;
            
            let html = '';
            
            Object.keys(materials).forEach(service => {
                const serviceName = {
                    'fdm': 'Printare 3D FDM',
                    'sla': 'Printare 3D SLA',
                    'laser': 'Gravură Laser'
                }[service] || service;
                
                html += `
                    <div class="glass-effect rounded-lg p-6 neon-border">
                        <h3 class="text-xl font-bold neon-text mb-4">${serviceName}</h3>
                        <div class="space-y-4">
                `;
                
                Object.keys(materials[service]).forEach(material => {
                    const materialData = materials[service][material];
                    html += `
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-1">Material</label>
                                <input 
                                    type="text" 
                                    value="${material}"
                                    data-service="${service}"
                                    data-material="${material}"
                                    data-field="name"
                                    class="material-input w-full bg-dark-card text-white rounded px-3 py-2 border border-dark-border focus:border-neon-cyan focus:outline-none"
                                >
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-1">Preț (RON/bucată)</label>
                                <input 
                                    type="number" 
                                    value="${materialData.price}"
                                    data-service="${service}"
                                    data-material="${material}"
                                    data-field="price"
                                    class="material-input w-full bg-dark-card text-white rounded px-3 py-2 border border-dark-border focus:border-neon-cyan focus:outline-none"
                                >
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-1">Culori disponibile</label>
                                <input 
                                    type="text" 
                                    value="${materialData.colors.join(', ')}"
                                    data-service="${service}"
                                    data-material="${material}"
                                    data-field="colors"
                                    class="material-input w-full bg-dark-card text-white rounded px-3 py-2 border border-dark-border focus:border-neon-cyan focus:outline-none"
                                    placeholder="Separă culorile cu virgulă"
                                >
                            </div>
                        </div>
                    `;
                });
                
                html += `
                        </div>
                    </div>
                `;
            });
            
            editor.innerHTML = html;
            
            // Store original materials data
            this.materialsData = materials;
        } catch (error) {
            console.error('Error loading materials:', error);
        }
    }

    async loadSettings() {
        try {
            const response = await fetch('/api/settings');
            const settings = await response.json();
            
            document.getElementById('site-name').value = settings.siteName || '';
            document.getElementById('logo-url').value = settings.logo || '';
            document.getElementById('tone-of-voice').value = settings.toneOfVoice || '';
            document.getElementById('n8n-webhook').value = settings.webhooks?.n8n || '';
            document.getElementById('chatbot-webhook').value = settings.webhooks?.chatbot || '';
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    showProjectModal() {
        const modal = document.getElementById('project-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    hideProjectModal() {
        const modal = document.getElementById('project-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
        
        // Reset form
        const form = document.getElementById('add-project-form');
        if (form) {
            form.reset();
        }
    }

    async handleAddProject(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                this.hideProjectModal();
                this.loadProjects();
                this.showNotification('Proiectul a fost adăugat cu succes!', 'success');
            } else {
                this.showNotification('Eroare la adăugarea proiectului', 'error');
            }
        } catch (error) {
            console.error('Error adding project:', error);
            this.showNotification('Eroare la adăugarea proiectului', 'error');
        }
    }

    async handleSettingsSubmit(e) {
        e.preventDefault();
        
        const settings = {
            siteName: document.getElementById('site-name').value,
            logo: document.getElementById('logo-url').value,
            toneOfVoice: document.getElementById('tone-of-voice').value,
            webhooks: {
                n8n: document.getElementById('n8n-webhook').value,
                chatbot: document.getElementById('chatbot-webhook').value
            }
        };
        
        try {
            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });
            
            if (response.ok) {
                this.showNotification('Setările au fost salvate!', 'success');
            } else {
                this.showNotification('Eroare la salvarea setărilor', 'error');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showNotification('Eroare la salvarea setărilor', 'error');
        }
    }

    async saveMaterials() {
        try {
            // Collect updated materials data
            const updatedMaterials = JSON.parse(JSON.stringify(this.materialsData));
            
            const materialInputs = document.querySelectorAll('.material-input');
            materialInputs.forEach(input => {
                const service = input.dataset.service;
                const material = input.dataset.material;
                const field = input.dataset.field;
                
                if (field === 'colors') {
                    updatedMaterials[service][material][field] = input.value.split(',').map(c => c.trim());
                } else if (field === 'price') {
                    updatedMaterials[service][material][field] = parseFloat(input.value);
                } else if (field === 'name') {
                    // Handle material name changes
                    if (input.value !== material) {
                        updatedMaterials[service][input.value] = updatedMaterials[service][material];
                        delete updatedMaterials[service][material];
                    }
                }
            });
            
            const response = await fetch('/api/materials', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedMaterials)
            });
            
            if (response.ok) {
                this.materialsData = updatedMaterials;
                this.showNotification('Materialele au fost salvate!', 'success');
            } else {
                this.showNotification('Eroare la salvarea materialelor', 'error');
            }
        } catch (error) {
            console.error('Error saving materials:', error);
            this.showNotification('Eroare la salvarea materialelor', 'error');
        }
    }

    // Utility methods
    viewOrder(orderId) {
        // Implementation for viewing order details
        this.showNotification('Funcționalitatea de vizualizare comenzi va fi implementată în curând', 'info');
    }

    async deleteProject(projectId) {
        if (!confirm('Ești sigur că vrei să ștergi acest proiect?')) return;
        
        // Implementation for deleting project
        this.showNotification('Funcționalitatea de ștergere proiecte va fi implementată în curând', 'info');
    }

    async deleteArticle(articleId) {
        if (!confirm('Ești sigur că vrei să ștergi acest articol?')) return;
        
        // Implementation for deleting article
        this.showNotification('Funcționalitatea de ștergere articole va fi implementată în curând', 'info');
    }

    async deleteTestimonial(testimonialId) {
        if (!confirm('Ești sigur că vrei să ștergi acest testimonial?')) return;
        
        // Implementation for deleting testimonial
        this.showNotification('Funcționalitatea de ștergere testimoniale va fi implementată în curând', 'info');
    }

    getCategoryName(category) {
        const categories = {
            '3d-printing': 'Printare 3D',
            'laser-engraving': 'Gravură Laser',
            'prototyping': 'Prototipare',
            'custom': 'Personalizate',
            'tutorials': 'Tutoriale',
            'projects': 'Proiecte',
            'news': 'Știri'
        };
        return categories[category] || category;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ro-RO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
        
        if (type === 'success') {
            notification.classList.add('bg-green-600', 'text-white');
        } else if (type === 'error') {
            notification.classList.add('bg-red-600', 'text-white');
        } else {
            notification.classList.add('glass-effect', 'text-neon-cyan', 'neon-border');
        }
        
        notification.innerHTML = `
            <div class="flex items-center">
                <span class="mr-3">${message}</span>
                <button class="ml-auto text-white hover:text-gray-300" onclick="this.parentElement.parentElement.remove()">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
}

// Initialize admin panel
const adminPanel = new AdminPanel();

// Make it globally available for onclick handlers
window.adminPanel = adminPanel;