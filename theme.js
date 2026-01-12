// ============================================
// THEME TOGGLE FUNCTIONALITY
// ============================================

class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        // Set initial theme
        document.documentElement.setAttribute('data-theme', this.theme);

        // Create theme toggle button if it doesn't exist
        if (!document.querySelector('.theme-toggle')) {
            this.createToggleButton();
        }

        // Add event listener
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleTheme());
        }
    }

    createToggleButton() {
        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.setAttribute('aria-label', 'Toggle theme');
        button.innerHTML = `
            <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
            <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
        `;
        document.body.appendChild(button);
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);

        // Add smooth transition
        document.documentElement.style.transition = 'background-color 0.4s ease, color 0.4s ease';
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 400);
    }
}

// ============================================
// SMOOTH SCROLL ANIMATIONS
// ============================================

class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.fade-in, .slide-in');
        this.init();
    }

    init() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, options);

        this.elements.forEach(el => observer.observe(el));
    }
}

// ============================================
// HORIZONTAL SCROLL SNAP
// ============================================

class HorizontalScroll {
    constructor(container) {
        this.container = container;
        if (this.container) {
            this.init();
        }
    }

    init() {
        // Add smooth scroll behavior
        this.container.style.scrollBehavior = 'smooth';

        // Optional: Add keyboard navigation
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                this.container.scrollLeft += this.container.offsetWidth;
            } else if (e.key === 'ArrowLeft') {
                this.container.scrollLeft -= this.container.offsetWidth;
            }
        });
    }
}

// ============================================
// ANIMATED COUNTERS
// ============================================

class AnimatedCounter {
    constructor(element) {
        this.element = element;
        this.target = parseInt(element.getAttribute('data-target'));
        this.duration = 2000;
        this.hasAnimated = false;
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animate();
                    this.hasAnimated = true;
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.element);
    }

    animate() {
        const start = 0;
        const increment = this.target / (this.duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= this.target) {
                this.element.textContent = this.target + '+';
                clearInterval(timer);
            } else {
                this.element.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme manager
    new ThemeManager();

    // Initialize scroll animations
    new ScrollAnimations();

    // Initialize horizontal scroll
    const horizontalContainer = document.querySelector('.horizontal-scroll');
    if (horizontalContainer) {
        new HorizontalScroll(horizontalContainer);
    }

    // Initialize animated counters
    document.querySelectorAll('.counter').forEach(counter => {
        new AnimatedCounter(counter);
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add js-active class for progressive enhancement
    document.body.classList.add('js-active');
});

// ============================================
// MOBILE MENU TOGGLE
// ============================================

const mobileMenuToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}
