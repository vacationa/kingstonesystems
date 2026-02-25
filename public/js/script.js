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
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Helper: register an element with an animation class + optional delay (seconds)
function animate(el, animClass, delay = 0) {
    if (!el) return;
    if (delay) el.style.setProperty('--anim-delay', `${delay}s`);
    el.classList.add(animClass);
    observer.observe(el);
}

// Helper: stagger a NodeList
function animateList(els, animClass, baseDelay = 0, step = 0.12) {
    els.forEach((el, i) => animate(el, animClass, baseDelay + i * step));
}

document.addEventListener('DOMContentLoaded', () => {

    /* ── Hero ───────────────────────────────────────── */
    animate(document.querySelector('.hero-left'), 'fade-in-up', 0);
    animate(document.querySelector('.hero-right'), 'fade-in-up', 0.18);

    /* ── Workflow cards (staggered rise) ────────────── */
    animateList(document.querySelectorAll('.workflow-card'), 'fade-in-up', 0, 0.13);
    animateList(document.querySelectorAll('.section-title'), 'reveal-up', 0, 0);
    animateList(document.querySelectorAll('.section-subtitle'), 'fade-in', 0.1, 0);

    /* ── Stats (scale-in stagger) ───────────────────── */
    animateList(document.querySelectorAll('.stat-card'), 'scale-in', 0, 0.12);

    /* ── Comparison ─────────────────────────────────── */
    animate(document.querySelector('.comparison-header'), 'fade-in-up', 0);
    animate(document.querySelector('.comparison-left'), 'slide-in-left', 0.1);
    animate(document.querySelector('.comparison-right'), 'slide-in-right', 0.1);

    /* ── How It Works steps ─────────────────────────── */
    animateList(document.querySelectorAll('.step'), 'fade-in-up', 0, 0.14);

    /* ── Philosophy ─────────────────────────────────── */
    animate(document.querySelector('.philosophy-intro'), 'fade-in-up', 0);
    animateList(document.querySelectorAll('.philosophy-value'), 'fade-in-up', 0.08, 0.1);

    /* ── System cards (alternate sides) ────────────── */
    document.querySelectorAll('.system-card').forEach((el, i) => {
        animate(el, i % 2 === 0 ? 'slide-in-left' : 'slide-in-right', i * 0.13);
    });

    /* ── Industry cards ─────────────────────────────── */
    animateList(document.querySelectorAll('.industry-card'), 'fade-in-up', 0, 0.1);

    /* ── Tutorial / solution cards ──────────────────── */
    animateList(document.querySelectorAll('.tutorial-card'), 'fade-in-up', 0, 0.1);
    animateList(document.querySelectorAll('.solution-feature-card'), 'scale-in', 0, 0.1);

    /* ── Calculator ─────────────────────────────────── */
    animate(document.querySelector('.calculator'), 'fade-in-up', 0.05);

    /* ── FAQ items ──────────────────────────────────── */
    animateList(document.querySelectorAll('.faq-item'), 'fade-in-up', 0, 0.06);

    /* ── Final CTA card ─────────────────────────────── */
    animate(document.querySelector('.final-cta-card'), 'scale-in', 0);
    animate(document.querySelector('.cta-content'), 'fade-in-up', 0);

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
        question.addEventListener('click', function () {
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
