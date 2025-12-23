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
    // Animate Hero Section
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const heroLeft = heroContent.querySelector('.hero-left');
        const heroRight = heroContent.querySelector('.hero-right');
        if (heroLeft) {
            heroLeft.classList.add('fade-in-up');
            observer.observe(heroLeft);
        }
        if (heroRight) {
            heroRight.classList.add('fade-in-up');
            heroRight.style.transitionDelay = '0.2s';
            observer.observe(heroRight);
        }
    }

    // Animate AI Agents Section
    const agentsSection = document.querySelector('.agents-section');
    if (agentsSection) {
        agentsSection.classList.add('fade-in-up');
        observer.observe(agentsSection);
    }

    // Animate Workflow Section
    document.querySelectorAll('.workflow-card').forEach((el, index) => {
        el.classList.add('fade-in-up');
        el.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(el);
    });

    // Add fade-in-up to section titles
    document.querySelectorAll('.section-title').forEach((el, index) => {
        el.classList.add('fade-in-up');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Add fade-in to section subtitles
    document.querySelectorAll('.section-subtitle').forEach((el) => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Add fade-in-up to stat cards
    document.querySelectorAll('.stat-card').forEach((el, index) => {
        el.classList.add('fade-in-up');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Animate Comparison Section
    const comparisonSection = document.querySelector('.comparison-section');
    if (comparisonSection) {
        const comparisonHeader = comparisonSection.querySelector('.comparison-header');
        const comparisonContainer = comparisonSection.querySelector('.comparison-container');
        if (comparisonHeader) {
            comparisonHeader.classList.add('fade-in-up');
            observer.observe(comparisonHeader);
        }
        if (comparisonContainer) {
            comparisonContainer.classList.add('fade-in-up');
            comparisonContainer.style.transitionDelay = '0.2s';
            observer.observe(comparisonContainer);
        }
    }

    // Add fade-in-up to steps
    document.querySelectorAll('.step').forEach((el, index) => {
        el.classList.add('fade-in-up');
        el.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(el);
    });

    // Animate Philosophy Section
    const philosophySection = document.querySelector('.philosophy-section');
    if (philosophySection) {
        const philosophyIntro = philosophySection.querySelector('.philosophy-intro');
        const philosophyValues = philosophySection.querySelectorAll('.philosophy-value');
        if (philosophyIntro) {
            philosophyIntro.classList.add('fade-in-up');
            observer.observe(philosophyIntro);
        }
        philosophyValues.forEach((el, index) => {
            el.classList.add('fade-in-up');
            el.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
    }

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

    // Animate Tutorials Section
    document.querySelectorAll('.tutorial-card').forEach((el, index) => {
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

    // Animate FAQ Section
    document.querySelectorAll('.faq-item').forEach((el, index) => {
        el.classList.add('fade-in-up');
        el.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(el);
    });

    // Animate Final CTA Section
    const finalCtaCard = document.querySelector('.final-cta-card');
    if (finalCtaCard) {
        finalCtaCard.classList.add('scale-in');
        observer.observe(finalCtaCard);
    }

    // Add fade-in to CTA section
    const ctaContent = document.querySelector('.cta-content');
    if (ctaContent) {
        ctaContent.classList.add('fade-in-up');
        observer.observe(ctaContent);
    }

    // Animate main sections that don't have specific child animations
    const sectionsToAnimate = [
        '.workflow-section',
        '.stats-section',
        '.how-it-works',
        '.industries',
        '.tutorials',
        '.calculator-section',
        '.faq-section'
    ];

    sectionsToAnimate.forEach((selector) => {
        const section = document.querySelector(selector);
        if (section) {
            // Only animate the section container if it doesn't have animated children
            const hasAnimatedChildren = section.querySelectorAll('.fade-in-up, .fade-in, .slide-in-left, .slide-in-right, .scale-in').length > 0;
            if (!hasAnimatedChildren) {
                section.style.opacity = '0';
                section.style.transform = 'translateY(30px)';
                section.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                
                const sectionObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                            sectionObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
                
                sectionObserver.observe(section);
            }
        }
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
        
        function updateCarousel(direction = 'next', skipAnimation = false) {
            if (isAnimating && !skipAnimation) return;
            
            const leftIndex = (currentIndex - 1 + agents.length) % agents.length;
            const centerIndex = currentIndex;
            const rightIndex = (currentIndex + 1) % agents.length;
            
            // Get current image elements (overlays stay in DOM)
            const leftImgEl = agentsDisplay.querySelector('.agent-left img');
            const centerImgEl = agentsDisplay.querySelector('.agent-card-center img');
            const rightImgEl = agentsDisplay.querySelector('.agent-right img');
            const centerLabelEl = agentsDisplay.querySelector('.agent-name-label');
            
            if (skipAnimation) {
                // Initial load - just update sources, overlays already exist in HTML
                if (leftImgEl) leftImgEl.src = agents[leftIndex].img;
                if (centerImgEl) centerImgEl.src = agents[centerIndex].img;
                if (rightImgEl) rightImgEl.src = agents[rightIndex].img;
                if (centerLabelEl) centerLabelEl.textContent = agents[centerIndex].name;
                return;
            }
            
            isAnimating = true;
            
            // Fade out current images (overlays remain visible)
            const images = [leftImgEl, centerImgEl, rightImgEl].filter(Boolean);
            images.forEach((img) => {
                void img.offsetWidth; // Force reflow
                img.classList.add('fade-out');
            });
            
            // Update image sources while old images fade out
            setTimeout(() => {
                // Update sources - overlays never change, so they stay rendered
                if (leftImgEl) leftImgEl.src = agents[leftIndex].img;
                if (centerImgEl) centerImgEl.src = agents[centerIndex].img;
                if (rightImgEl) rightImgEl.src = agents[rightIndex].img;
                if (centerLabelEl) centerLabelEl.textContent = agents[centerIndex].name;
                
                // Start fade-in on new images
                images.forEach((img, index) => {
                    img.classList.remove('fade-out');
                    void img.offsetWidth; // Force reflow
                    setTimeout(() => {
                        img.classList.add('fade-in');
                    }, index * 20);
                });
                
                // Clean up after animation
                setTimeout(() => {
                    images.forEach(img => {
                        img.classList.remove('fade-in');
                    });
                    isAnimating = false;
                }, 650);
            }, 200);
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
