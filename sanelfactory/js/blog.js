// Blog functionality
class BlogManager {
    constructor() {
        this.articles = [];
        this.filteredArticles = [];
        this.currentPage = 1;
        this.articlesPerPage = 6;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadArticles();
        this.setupMobileMenu();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterArticles());
        }
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterArticles());
        }

        // Pagination
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousPage());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextPage());
        }

        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        }
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

    async loadArticles() {
        try {
            const response = await fetch('/api/blog');
            
            if (response.ok) {
                this.articles = await response.json();
                this.filteredArticles = [...this.articles];
                this.renderArticles();
            } else {
                console.error('Failed to load articles');
                this.showNoArticles();
            }
        } catch (error) {
            console.error('Error loading articles:', error);
            this.showNoArticles();
        } finally {
            this.hideLoading();
        }
    }

    filterArticles() {
        const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
        const selectedCategory = document.getElementById('category-filter')?.value || '';

        this.filteredArticles = this.articles.filter(article => {
            const matchesSearch = !searchTerm || 
                article.title.toLowerCase().includes(searchTerm) ||
                article.content.toLowerCase().includes(searchTerm) ||
                article.excerpt?.toLowerCase().includes(searchTerm);
            
            const matchesCategory = !selectedCategory || article.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });

        this.currentPage = 1;
        this.renderArticles();
    }

    renderArticles() {
        const container = document.getElementById('articles-container');
        const noArticlesDiv = document.getElementById('no-articles');
        
        if (!container) return;

        if (this.filteredArticles.length === 0) {
            container.classList.add('hidden');
            if (noArticlesDiv) {
                noArticlesDiv.classList.remove('hidden');
            }
            this.hidePagination();
            return;
        }

        // Show articles container
        container.classList.remove('hidden');
        if (noArticlesDiv) {
            noArticlesDiv.classList.add('hidden');
        }

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        const articlesToShow = this.filteredArticles.slice(startIndex, endIndex);

        // Render articles
        container.innerHTML = articlesToShow.map(article => this.createArticleCard(article)).join('');

        // Update pagination
        this.updatePagination();
    }

    createArticleCard(article) {
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('ro-RO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const getCategoryName = (category) => {
            const categories = {
                '3d-printing': 'Printare 3D',
                'laser-engraving': 'Gravură Laser',
                'tutorials': 'Tutoriale',
                'projects': 'Proiecte',
                'news': 'Știri'
            };
            return categories[category] || category;
        };

        const excerpt = article.excerpt || article.content.substring(0, 150) + '...';
        const imageUrl = article.image || '/images/default-blog.jpg';
        const tags = article.tags || [];

        return `
            <article class="article-card glass-effect rounded-lg overflow-hidden neon-border">
                <div class="relative overflow-hidden">
                    <img 
                        src="${imageUrl}" 
                        alt="${article.title}"
                        class="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                        onerror="this.src='/images/default-blog.jpg'"
                    >
                    <div class="absolute top-4 left-4">
                        <span class="tag px-3 py-1 rounded-full text-sm font-semibold text-neon-cyan">
                            ${getCategoryName(article.category)}
                        </span>
                    </div>
                </div>
                
                <div class="p-6">
                    <div class="flex items-center text-sm text-gray-400 mb-3">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        ${formatDate(article.createdAt)}
                    </div>
                    
                    <h2 class="text-xl font-bold mb-3 text-white hover:text-neon-cyan transition-colors duration-300">
                        <a href="/blog/${article.id}" class="block">
                            ${article.title}
                        </a>
                    </h2>
                    
                    <p class="text-gray-300 mb-4 leading-relaxed">
                        ${excerpt}
                    </p>
                    
                    ${tags.length > 0 ? `
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${tags.map(tag => `
                                <span class="px-2 py-1 text-xs rounded-full bg-dark-card border border-dark-border text-neon-cyan">
                                    #${tag}
                                </span>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="flex justify-between items-center">
                        <a 
                            href="/blog/${article.id}" 
                            class="inline-flex items-center text-neon-cyan hover:text-white transition-colors duration-300 font-semibold"
                        >
                            Citește mai mult
                            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </a>
                        
                        <div class="flex items-center text-sm text-gray-400">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            ${article.views || 0}
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage);
        const paginationDiv = document.getElementById('pagination');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const pageInfo = document.getElementById('page-info');

        if (totalPages <= 1) {
            this.hidePagination();
            return;
        }

        // Show pagination
        if (paginationDiv) {
            paginationDiv.classList.remove('hidden');
        }

        // Update buttons
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages;
        }

        // Update page info
        if (pageInfo) {
            pageInfo.textContent = `Pagina ${this.currentPage} din ${totalPages}`;
        }
    }

    hidePagination() {
        const paginationDiv = document.getElementById('pagination');
        if (paginationDiv) {
            paginationDiv.classList.add('hidden');
        }
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderArticles();
            this.scrollToTop();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderArticles();
            this.scrollToTop();
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    hideLoading() {
        const loadingState = document.getElementById('loading-state');
        if (loadingState) {
            loadingState.classList.add('hidden');
        }
    }

    showNoArticles() {
        const container = document.getElementById('articles-container');
        const noArticlesDiv = document.getElementById('no-articles');
        
        if (container) {
            container.classList.add('hidden');
        }
        
        if (noArticlesDiv) {
            noArticlesDiv.classList.remove('hidden');
        }
        
        this.hidePagination();
    }

    async handleNewsletterSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const email = form.querySelector('input[type="email"]').value;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Se procesează...';
        
        try {
            // Here you would typically send the email to your newsletter service
            // For now, we'll just simulate a successful subscription
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.showNotification('Te-ai abonat cu succes la newsletter!', 'success');
            form.reset();
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            this.showNotification('A apărut o eroare. Te rugăm să încerci din nou.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Abonează-te';
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

// Initialize blog manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogManager();
});

// Add some sample articles for demonstration (remove this in production)
window.addSampleArticles = async function() {
    const sampleArticles = [
        {
            title: "Ghidul Complet pentru Printarea 3D cu PLA",
            content: "PLA (Polylactic Acid) este unul dintre cele mai populare materiale pentru printarea 3D, fiind ideal pentru începători datorită ușurinței de utilizare și a proprietăților sale ecologice...",
            excerpt: "Descoperă totul despre printarea 3D cu PLA - de la setări optime la trucuri pentru rezultate perfecte.",
            category: "3d-printing",
            tags: ["PLA", "printare 3D", "materiale", "tutorial"],
            image: "/images/blog/pla-guide.jpg",
            author: "Echipa Sanel Factory",
            views: 1250
        },
        {
            title: "Gravura Laser: Tehnici Avansate pentru Rezultate Profesionale",
            content: "Gravura laser oferă posibilități infinite pentru personalizarea obiectelor. În acest articol, vom explora tehnicile avansate care te vor ajuta să obții rezultate de nivel profesional...",
            excerpt: "Învață tehnicile avansate de gravură laser pentru a crea lucrări de calitate profesională.",
            category: "laser-engraving",
            tags: ["gravură laser", "tehnici avansate", "personalizare"],
            image: "/images/blog/laser-engraving.jpg",
            author: "Marian Sanel",
            views: 890
        },
        {
            title: "Proiect: Crearea unei Miniaturi Arhitecturale cu SLA",
            content: "Printarea SLA (Stereolithography) este perfectă pentru detalii fine și suprafețe netede. În acest proiect, vom crea o miniatură arhitecturală detaliată...",
            excerpt: "Pas cu pas: cum să creezi o miniatură arhitecturală perfectă folosind tehnologia SLA.",
            category: "projects",
            tags: ["SLA", "arhitectură", "miniaturi", "proiect"],
            image: "/images/blog/sla-architecture.jpg",
            author: "Echipa Sanel Factory",
            views: 645
        }
    ];

    for (const article of sampleArticles) {
        try {
            const response = await fetch('/api/blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(article)
            });
            
            if (response.ok) {
                console.log('Sample article added:', article.title);
            }
        } catch (error) {
            console.error('Error adding sample article:', error);
        }
    }
};