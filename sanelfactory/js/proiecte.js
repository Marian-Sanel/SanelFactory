// Projects gallery functionality
class ProjectsManager {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.currentFilter = 'all';
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadProjects();
        this.setupMobileMenu();
    }

    setupEventListeners() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterClick(e));
        });

        // Modal functionality
        const modal = document.getElementById('project-modal');
        const closeModal = document.getElementById('close-modal');
        
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Share button
        const shareBtn = document.getElementById('share-project');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareProject());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }

    async loadProjects() {
        try {
            const response = await fetch('/api/projects');
            
            if (response.ok) {
                this.projects = await response.json();
                this.filteredProjects = [...this.projects];
                this.renderProjects();
            } else {
                console.error('Failed to load projects');
                this.showNoProjects();
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            this.showNoProjects();
        } finally {
            this.hideLoading();
        }
    }

    handleFilterClick(e) {
        const filter = e.target.dataset.filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Filter projects
        this.currentFilter = filter;
        this.filterProjects(filter);
    }

    filterProjects(filter) {
        if (filter === 'all') {
            this.filteredProjects = [...this.projects];
        } else {
            this.filteredProjects = this.projects.filter(project => 
                project.category === filter
            );
        }
        
        this.renderProjects();
    }

    renderProjects() {
        const container = document.getElementById('projects-container');
        const noProjectsDiv = document.getElementById('no-projects');
        
        if (!container) return;

        if (this.filteredProjects.length === 0) {
            container.classList.add('hidden');
            if (noProjectsDiv) {
                noProjectsDiv.classList.remove('hidden');
            }
            return;
        }

        // Show projects container
        container.classList.remove('hidden');
        if (noProjectsDiv) {
            noProjectsDiv.classList.add('hidden');
        }

        // Render projects
        container.innerHTML = this.filteredProjects.map(project => this.createProjectCard(project)).join('');
        
        // Add click listeners to project cards
        this.setupProjectCardListeners();
    }

    createProjectCard(project) {
        const getCategoryName = (category) => {
            const categories = {
                '3d-printing': 'Printare 3D',
                'laser-engraving': 'Gravură Laser',
                'prototyping': 'Prototipare',
                'custom': 'Personalizate'
            };
            return categories[category] || category;
        };

        const imageUrl = project.image || '/images/default-project.jpg';
        
        // Generate random height for masonry effect
        const heights = ['h-64', 'h-48', 'h-56', 'h-72', 'h-60'];
        const randomHeight = heights[Math.floor(Math.random() * heights.length)];

        return `
            <div class="masonry-item">
                <div class="project-card glass-effect rounded-lg overflow-hidden neon-border" data-project-id="${project.id}">
                    <div class="relative overflow-hidden">
                        <img 
                            src="${imageUrl}" 
                            alt="${project.title}"
                            class="w-full ${randomHeight} object-cover transition-transform duration-300"
                            onerror="this.src='/images/default-project.jpg'"
                        >
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div class="absolute top-4 left-4">
                            <span class="px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-neon-cyan to-neon-purple text-black">
                                ${getCategoryName(project.category)}
                            </span>
                        </div>
                        <div class="absolute bottom-4 left-4 right-4">
                            <h3 class="text-white font-bold text-lg mb-2 line-clamp-2">
                                ${project.title}
                            </h3>
                        </div>
                    </div>
                    
                    <div class="p-4">
                        <p class="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                            ${project.description}
                        </p>
                        
                        <div class="flex justify-between items-center">
                            <div class="flex items-center text-xs text-gray-400">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                ${this.formatDate(project.createdAt)}
                            </div>
                            
                            <button class="text-neon-cyan hover:text-white transition-colors duration-300 text-sm font-semibold">
                                Vezi detalii →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupProjectCardListeners() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const projectId = e.currentTarget.dataset.projectId;
                this.openProjectModal(projectId);
            });
        });
    }

    openProjectModal(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const modal = document.getElementById('project-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalImage = document.getElementById('modal-image');
        const modalCategory = document.getElementById('modal-category');
        const modalDescription = document.getElementById('modal-description');
        const modalDetails = document.getElementById('modal-details');
        const modalDate = document.getElementById('modal-date');

        if (modalTitle) modalTitle.textContent = project.title;
        if (modalImage) {
            modalImage.src = project.image || '/images/default-project.jpg';
            modalImage.alt = project.title;
        }
        if (modalCategory) modalCategory.textContent = this.getCategoryName(project.category);
        if (modalDescription) modalDescription.textContent = project.description;
        if (modalDate) modalDate.textContent = this.formatDate(project.createdAt);

        // Populate technical details
        if (modalDetails) {
            const details = project.technicalDetails || [];
            modalDetails.innerHTML = details.length > 0 
                ? details.map(detail => `<li>• ${detail}</li>`).join('')
                : '<li>• Detalii tehnice vor fi adăugate în curând</li>';
        }

        // Store current project for sharing
        this.currentProject = project;

        // Show modal
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('project-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
        this.currentProject = null;
    }

    shareProject() {
        if (!this.currentProject) return;

        const shareData = {
            title: `${this.currentProject.title} - Sanel Factory`,
            text: `Descoperă acest proiect realizat prin ${this.getCategoryName(this.currentProject.category)}: ${this.currentProject.description}`,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData).catch(console.error);
        } else {
            // Fallback to copying URL
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('Link-ul a fost copiat în clipboard!', 'success');
            }).catch(() => {
                this.showNotification('Nu s-a putut copia link-ul', 'error');
            });
        }
    }

    getCategoryName(category) {
        const categories = {
            '3d-printing': 'Printare 3D',
            'laser-engraving': 'Gravură Laser',
            'prototyping': 'Prototipare',
            'custom': 'Personalizate'
        };
        return categories[category] || category;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ro-RO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    hideLoading() {
        const loadingState = document.getElementById('loading-state');
        if (loadingState) {
            loadingState.classList.add('hidden');
        }
    }

    showNoProjects() {
        const container = document.getElementById('projects-container');
        const noProjectsDiv = document.getElementById('no-projects');
        
        if (container) {
            container.classList.add('hidden');
        }
        
        if (noProjectsDiv) {
            noProjectsDiv.classList.remove('hidden');
        }
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

// Initialize projects manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsManager();
});

// Add some sample projects for demonstration (remove this in production)
window.addSampleProjects = async function() {
    const sampleProjects = [
        {
            title: "Figurină Dragon Detaliat",
            description: "Figurină de dragon printată în 3D cu detalii fine, realizată în rășină SLA pentru o calitate superioară. Proiectul a necesitat post-procesare avansată pentru finisajul perfect.",
            category: "3d-printing",
            image: "/images/projects/dragon-figurine.jpg",
            technicalDetails: [
                "Material: Rășină SLA Standard",
                "Înălțime: 15cm",
                "Rezoluție: 0.05mm",
                "Timp de printare: 8 ore",
                "Post-procesare: Curățare UV + Vopsire"
            ]
        },
        {
            title: "Placă Personalizată Gravată Laser",
            description: "Placă comemorative din lemn de stejar cu gravură laser de precizie. Design personalizat cu text și elemente decorative complexe.",
            category: "laser-engraving",
            image: "/images/projects/laser-plaque.jpg",
            technicalDetails: [
                "Material: Lemn de stejar 10mm",
                "Dimensiuni: 30x20cm",
                "Adâncime gravură: 2mm",
                "Finisaj: Lac mat protector"
            ]
        },
        {
            title: "Prototip Carcasă Electronică",
            description: "Prototip funcțional pentru carcasă de dispozitiv electronic, cu compartimente precise pentru componente și sistem de răcire integrat.",
            category: "prototyping",
            image: "/images/projects/electronic-case.jpg",
            technicalDetails: [
                "Material: PETG transparent",
                "Dimensiuni: 12x8x4cm",
                "Toleranțe: ±0.1mm",
                "Caracteristici: Compartimente modulare"
            ]
        },
        {
            title: "Set Bijuterii Personalizate",
            description: "Colecție de bijuterii personalizate realizate prin printare 3D în rășină specială, cu finisaje metalice și pietre decorative aplicate manual.",
            category: "custom",
            image: "/images/projects/jewelry-set.jpg",
            technicalDetails: [
                "Material: Rășină bijuterii",
                "Finisaj: Auriu 18k",
                "Set: Cercei, pandantiv, inel",
                "Pietre: Zirconia cubică"
            ]
        },
        {
            title: "Miniatură Arhitecturală",
            description: "Reproducere la scară a unei clădiri istorice, cu toate detaliile arhitecturale păstrate fidel originalului. Proiect complex cu multiple componente.",
            category: "3d-printing",
            image: "/images/projects/architecture-model.jpg",
            technicalDetails: [
                "Material: PLA Premium",
                "Scara: 1:100",
                "Componente: 25 piese",
                "Bază: 40x30cm",
                "Detalii: Ferestre, uși, ornamente"
            ]
        },
        {
            title: "Trofeu Corporativ Gravat",
            description: "Trofeu elegant din plexiglas transparent cu gravură laser 3D și bază din lemn masiv. Design modern pentru eveniment corporativ.",
            category: "laser-engraving",
            image: "/images/projects/corporate-trophy.jpg",
            technicalDetails: [
                "Material: Plexiglas 15mm + Lemn de nuc",
                "Înălțime: 25cm",
                "Gravură: 3D în volum",
                "Iluminare: LED integrat"
            ]
        }
    ];

    for (const project of sampleProjects) {
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(project)
            });
            
            if (response.ok) {
                console.log('Sample project added:', project.title);
            }
        } catch (error) {
            console.error('Error adding sample project:', error);
        }
    }
};