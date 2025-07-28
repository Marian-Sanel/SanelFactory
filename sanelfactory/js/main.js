// Main JavaScript file for Sanel Factory website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initFAQ();
    initContactForm();
    initAnimations();
    initBackToTop();
    initSmoothScroll();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(26, 26, 26, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.05)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateContactForm(data)) {
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Se trimite...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Show success message
                    showNotification('Mesajul a fost trimis cu succes! Îți vom răspunde în cel mai scurt timp.', 'success');
                }, 2000);
            }
        });
    }
}

// Form validation
function validateContactForm(data) {
    let isValid = true;
    const errors = {};
    
    // Required fields
    if (!data.name || data.name.trim().length < 2) {
        errors.name = 'Numele este obligatoriu și trebuie să aibă cel puțin 2 caractere';
        isValid = false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.email = 'Email-ul este obligatoriu și trebuie să aibă un format valid';
        isValid = false;
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.message = 'Mesajul este obligatoriu și trebuie să aibă cel puțin 10 caractere';
        isValid = false;
    }
    
    // Display errors
    displayFormErrors(errors);
    
    return isValid;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Display form errors
function displayFormErrors(errors) {
    // Clear previous errors
    document.querySelectorAll('.form-group.error').forEach(group => {
        group.classList.remove('error');
        const errorMsg = group.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    });
    
    // Display new errors
    Object.keys(errors).forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            const formGroup = input.closest('.form-group');
            formGroup.classList.add('error');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${errors[field]}`;
            formGroup.appendChild(errorDiv);
        }
    });
}

// Animations on scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .testimonial-card, .faq-item');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.classList.add(`delay-${Math.min(index % 3 + 1, 3)}`);
        observer.observe(el);
    });
}

// Back to top functionality
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        zIndex: '9999',
        background: type === 'success' ? 'rgba(0, 255, 136, 0.1)' : 
                   type === 'error' ? 'rgba(255, 68, 68, 0.1)' : 'rgba(77, 171, 247, 0.1)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${type === 'success' ? 'rgba(0, 255, 136, 0.3)' : 
                            type === 'error' ? 'rgba(255, 68, 68, 0.3)' : 'rgba(77, 171, 247, 0.3)'}`,
        borderRadius: '16px',
        padding: '16px',
        color: '#ffffff',
        maxWidth: '400px',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        boxShadow: '0 16px 64px rgba(0, 0, 0, 0.5)'
    });
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Get notification icon based on type
function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format price
function formatPrice(price) {
    return price.toFixed(2).replace('.', ',') + ' RON';
}

// Generate random ID
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Local storage helpers
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
        return false;
    }
}

function getFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Failed to read from localStorage:', e);
        return null;
    }
}

function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error('Failed to remove from localStorage:', e);
        return false;
    }
}

// Form data persistence
function saveFormData(formId, data) {
    saveToStorage(`form_${formId}`, data);
}

function loadFormData(formId) {
    return getFromStorage(`form_${formId}`);
}

function clearFormData(formId) {
    removeFromStorage(`form_${formId}`);
}

// Auto-save form data
function initFormAutoSave(formElement) {
    if (!formElement) return;
    
    const formId = formElement.id || generateId();
    
    // Load saved data
    const savedData = loadFormData(formId);
    if (savedData) {
        Object.keys(savedData).forEach(key => {
            const input = formElement.querySelector(`[name="${key}"]`);
            if (input && input.type !== 'file') {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    if (savedData[key]) {
                        input.checked = true;
                    }
                } else {
                    input.value = savedData[key];
                }
            }
        });
    }
    
    // Save data on input
    const saveData = debounce(() => {
        const formData = new FormData(formElement);
        const data = Object.fromEntries(formData);
        saveFormData(formId, data);
    }, 1000);
    
    formElement.addEventListener('input', saveData);
    formElement.addEventListener('change', saveData);
    
    // Clear data on successful submit
    formElement.addEventListener('submit', () => {
        setTimeout(() => clearFormData(formId), 1000);
    });
}

// Initialize form auto-save for all forms
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        if (!form.hasAttribute('data-no-autosave')) {
            initFormAutoSave(form);
        }
    });
});

// Performance monitoring
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                console.log('Page load time:', loadTime + 'ms');
                
                // You can send this data to analytics
                // analytics.track('page_load_time', { time: loadTime });
            }, 0);
        });
    }
}

// Initialize performance monitoring
measurePerformance();

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // You can send error reports to your logging service
    // errorReporting.log(e.error);
});

// Service worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}