// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#contact') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80; // Account for fixed navigation
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Add scroll effect to navigation
const nav = document.querySelector('.nav');

if (nav) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.boxShadow = 'none';
        }
    });
}

// Scroll animations using Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            // Optionally stop observing after animation
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with animation classes
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in-up to section titles
    document.querySelectorAll('.section-title').forEach((el, index) => {
        el.classList.add('fade-in-up');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Add fade-in-up to stat cards
    document.querySelectorAll('.stat-card').forEach((el, index) => {
        el.classList.add('fade-in-up');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Add fade-in-up to steps
    document.querySelectorAll('.step').forEach((el, index) => {
        el.classList.add('fade-in-up');
        el.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(el);
    });

    // Add slide-in animations to system cards
    document.querySelectorAll('.system-card').forEach((el, index) => {
        el.classList.add(index % 2 === 0 ? 'slide-in-left' : 'slide-in-right');
        el.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(el);
    });

    // Add fade-in-up to industry cards
    document.querySelectorAll('.industry-card').forEach((el, index) => {
        el.classList.add('fade-in-up');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Add scale-in to solution feature cards
    document.querySelectorAll('.solution-feature-card').forEach((el, index) => {
        el.classList.add('scale-in');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Add fade-in to calculator section
    const calculator = document.querySelector('.calculator');
    if (calculator) {
        calculator.classList.add('fade-in-up');
        observer.observe(calculator);
    }

    // Add fade-in to CTA section
    const ctaContent = document.querySelector('.cta-content');
    if (ctaContent) {
        ctaContent.classList.add('fade-in-up');
        observer.observe(ctaContent);
    }

    // Add fade-in to section subtitles
    document.querySelectorAll('.section-subtitle').forEach((el) => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Animate counting numbers
    function animateNumber(element) {
        const text = element.textContent.trim();
        const originalText = text;
        
        // Skip non-numeric values like "24/7"
        if (text.includes('/')) {
            return;
        }
        
        // Extract number and suffix (like %)
        const match = text.match(/(\d+(?:\.\d+)?)(.*)/);
        if (!match) return;
        
        const targetValue = parseFloat(match[1]);
        const suffix = match[2] || '';
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        const startValue = 0;
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (targetValue - startValue) * easeOutQuart;
            
            // Format number based on if it's a decimal or integer
            if (targetValue % 1 === 0) {
                element.textContent = Math.floor(currentValue) + suffix;
            } else {
                element.textContent = currentValue.toFixed(1) + suffix;
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = originalText;
            }
        }
        
        requestAnimationFrame(update);
    }

    // Create observer for counting animation
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('counted')) {
                    statNumber.classList.add('counted');
                    animateNumber(statNumber);
                }
                countObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Observe stat cards for counting animation
    document.querySelectorAll('.stat-card').forEach((card) => {
        countObserver.observe(card);
    });

    // FAQ Accordion functionality
    document.querySelectorAll('.faq-question').forEach((question) => {
        question.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const isOpen = faqItem.classList.contains('open');
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach((item) => {
                item.classList.remove('open');
            });
            
            // Toggle current item
            if (!isOpen) {
                faqItem.classList.add('open');
            }
        });
    });

    // Multi-view Carousel functionality for agents section
    const agentsDisplay = document.querySelector('.agents-display');
    const prevBtnNew = document.querySelector('.carousel-prev-new');
    const nextBtnNew = document.querySelector('.carousel-next-new');
    
    if (agentsDisplay && prevBtnNew && nextBtnNew) {
        const agents = [
            { img: '/assets/team/1.png', name: 'Julia - Receptionist Agent' },
            { img: '/assets/team/2.png', name: 'Michael - Receptionist Agent' },
            { img: '/assets/team/3.png', name: 'Sarah - Receptionist Agent' }
        ];
        
        let currentIndex = 1; // Start with middle agent
        let isAnimating = false; // Prevent rapid clicking
        
        function getAgentHTML(agent, position) {
            const isCenter = position === 'center';
            const className = isCenter 
                ? 'agent-card-center active' 
                : `agent-card-side agent-${position}`;
            const label = isCenter ? `
                <div class="agent-label">
                    <span class="agent-name-label">${agent.name}</span>
                </div>
            ` : '';
            
            return `
                <div class="${className}">
                    <div class="agent-background">
                        <img src="${agent.img}" alt="Receptionist Agent">
                    </div>
                    ${label}
                </div>
            `;
        }
        
        function updateCarousel(direction = 'next', skipAnimation = false) {
            if (isAnimating && !skipAnimation) return;
            
            const leftIndex = (currentIndex - 1 + agents.length) % agents.length;
            const centerIndex = currentIndex;
            const rightIndex = (currentIndex + 1) % agents.length;
            
            if (skipAnimation) {
                // Initial load - no animation
                agentsDisplay.innerHTML = 
                    getAgentHTML(agents[leftIndex], 'left') +
                    getAgentHTML(agents[centerIndex], 'center') +
                    getAgentHTML(agents[rightIndex], 'right');
                return;
            }
            
            isAnimating = true;
            
            // Get current images and start smooth fade-out
            const allImages = agentsDisplay.querySelectorAll('.agent-background img');
            allImages.forEach((img) => {
                // Force reflow for smooth transition
                void img.offsetWidth;
                img.classList.add('fade-out');
            });
            
            // Start crossfade - update content while old images are fading
            // This creates a smooth overlap effect
            setTimeout(() => {
                // Update content
                agentsDisplay.innerHTML = 
                    getAgentHTML(agents[leftIndex], 'left') +
                    getAgentHTML(agents[centerIndex], 'center') +
                    getAgentHTML(agents[rightIndex], 'right');
                
                // Force reflow to ensure pseudo-elements (overlays) are rendered immediately
                const backgroundElements = agentsDisplay.querySelectorAll('.agent-background');
                backgroundElements.forEach(el => {
                    void el.offsetHeight; // Force reflow
                });
                
                // Use requestAnimationFrame to ensure browser has painted overlays
                requestAnimationFrame(() => {
                    // Start fade-in on new images with slight stagger for fluidity
                    const newImages = agentsDisplay.querySelectorAll('.agent-background img');
                    newImages.forEach((img, index) => {
                        // Force reflow for each image
                        void img.offsetWidth;
                        // Small stagger for smoother visual flow
                        setTimeout(() => {
                            img.classList.add('fade-in');
                        }, index * 20);
                    });
                    
                    // Clean up after animation completes
                    setTimeout(() => {
                        newImages.forEach(img => {
                            img.classList.remove('fade-in');
                        });
                        isAnimating = false;
                    }, 650);
                });
            }, 200); // Optimal delay for smooth crossfade
        }
        
        prevBtnNew.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + agents.length) % agents.length;
            updateCarousel('prev');
        });
        
        nextBtnNew.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % agents.length;
            updateCarousel('next');
        });
        
        // Initialize without animation
        updateCarousel('next', true);
    }
});
