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
});
