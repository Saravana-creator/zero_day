// ===== CAMPUSLINK INTERACTIVE ANIMATIONS =====

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    setupIntersectionObserver();
    addRippleEffects();
    setupParallaxEffects();
    initEnhancedAnimations();
    setupMagneticEffect();
    createFloatingElements();
    initMatrixEffect();
});

// Initialize all animations
function initializeAnimations() {
    // Add loading animation to body
    document.body.classList.add('animate-page-load');
    
    // Stagger form elements
    const formElements = document.querySelectorAll('input, select, textarea, button');
    formElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('animate-fade-up');
    });
    
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('button, .button, .nav-btn, a');
    interactiveElements.forEach(element => {
        element.classList.add('interactive');
    });
}

// Intersection Observer for scroll animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe cards and posts
    const animatedElements = document.querySelectorAll('.post, .feed-item, .nav-btn');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Add ripple effect to buttons
function addRippleEffects() {
    const rippleElements = document.querySelectorAll('.ripple-effect');
    
    rippleElements.forEach(element => {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Parallax effects for background elements
function setupParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Form validation with animations
function animateFormValidation(input, isValid) {
    if (isValid) {
        input.classList.remove('error-shake');
        input.classList.add('success-pulse');
        setTimeout(() => input.classList.remove('success-pulse'), 600);
    } else {
        input.classList.remove('success-pulse');
        input.classList.add('error-shake');
        setTimeout(() => input.classList.remove('error-shake'), 600);
    }
}

// Loading animation
function showLoading(element) {
    const originalText = element.textContent;
    element.innerHTML = '<span class="loading-spinner"></span> Loading...';
    element.disabled = true;
    
    return () => {
        element.innerHTML = originalText;
        element.disabled = false;
    };
}

// Success animation
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-notification animate-bounce-in';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4caf50, #388e3c);
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(76, 175, 80, 0.3);
        z-index: 1000;
        font-weight: 600;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.classList.add('animate-fade-out');
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}

// Error animation
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification animate-bounce-in';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #f44336, #d32f2f);
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(244, 67, 54, 0.3);
        z-index: 1000;
        font-weight: 600;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.classList.add('animate-fade-out');
        setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
}

// Typewriter effect
function typeWriter(element, text, speed = 50) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Counter animation
function animateCounter(element, start, end, duration = 2000) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);
        
        if (current >= end) {
            element.textContent = end;
            clearInterval(timer);
        }
    }, 16);
}

// Card flip animation
function flipCard(card) {
    card.style.transform = 'rotateY(180deg)';
    setTimeout(() => {
        card.style.transform = 'rotateY(0deg)';
    }, 600);
}

// Smooth scroll with animation
function smoothScrollTo(target, duration = 1000) {
    const targetElement = document.querySelector(target);
    if (!targetElement) return;
    
    const targetPosition = targetElement.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Enhanced Animations
function initEnhancedAnimations() {
    // Add morphing background
    const morphingBg = document.createElement('div');
    morphingBg.className = 'morphing-bg';
    document.body.appendChild(morphingBg);
    
    // Add breathing effect to containers
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => {
        container.classList.add('breathing');
    });
    
    // Add holographic effect to main titles
    const titles = document.querySelectorAll('h1');
    titles.forEach(title => {
        title.classList.add('holographic');
        title.setAttribute('data-text', title.textContent);
    });
}

// Magnetic Effect for Interactive Elements
function setupMagneticEffect() {
    const magneticElements = document.querySelectorAll('.nav-btn, .button, button');
    
    magneticElements.forEach(element => {
        element.classList.add('magnetic');
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            element.style.setProperty('--x', `${x * 0.3}px`);
            element.style.setProperty('--y', `${y * 0.3}px`);
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.setProperty('--x', '0px');
            element.style.setProperty('--y', '0px');
        });
    });
}

// Create Floating Elements
function createFloatingElements() {
    for (let i = 0; i < 5; i++) {
        const floater = document.createElement('div');
        floater.style.cssText = `
            position: fixed;
            width: ${Math.random() * 20 + 10}px;
            height: ${Math.random() * 20 + 10}px;
            background: rgba(63, 81, 181, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            pointer-events: none;
            z-index: -1;
            animation: floatUpDown ${Math.random() * 3 + 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        document.body.appendChild(floater);
    }
}

// Matrix Rain Effect
function initMatrixEffect() {
    const matrix = document.createElement('div');
    matrix.className = 'matrix-bg';
    document.body.appendChild(matrix);
}

// Glitch Effect for Special Elements
function addGlitchEffect(element) {
    element.classList.add('glitch-title');
    element.setAttribute('data-text', element.textContent);
}

// Neon Glow Toggle
function toggleNeonGlow(element) {
    element.classList.toggle('neon-glow');
}

// Enhanced Page Transition
function enhancedPageTransition(url) {
    document.body.style.animation = 'fadeOut 0.5s ease-out';
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

// Particle Explosion Effect
function createParticleExplosion(x, y) {
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: #3f51b5;
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 1000;
        `;
        
        const angle = (Math.PI * 2 * i) / 15;
        const velocity = Math.random() * 100 + 50;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { 
                transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`, 
                opacity: 0 
            }
        ], {
            duration: 1000,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }).onfinish = () => particle.remove();
        
        document.body.appendChild(particle);
    }
}

// Export functions for global use
window.CampusLinkAnimations = {
    showLoading,
    showSuccess,
    showError,
    typeWriter,
    animateCounter,
    flipCard,
    smoothScrollTo,
    animateFormValidation,
    addGlitchEffect,
    toggleNeonGlow,
    enhancedPageTransition,
    createParticleExplosion
};

// Enhanced click effects
document.addEventListener('click', function(e) {
    if (e.target.matches('.nav-btn, .button, button')) {
        CampusLinkAnimations.createParticleExplosion(e.clientX, e.clientY);
    }
});

// Add CSS for additional animations
const additionalCSS = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.error-shake {
    animation: shake 0.5s ease-in-out;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

.success-pulse {
    animation: success-pulse 0.6s ease-in-out;
}

@keyframes success-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(76, 175, 80, 0.5); }
    100% { transform: scale(1); }
}

.animate-fade-out {
    animation: fadeOut 0.3s ease-out forwards;
}

@keyframes fadeOut {
    to {
        opacity: 0;
        transform: translateY(-20px);
    }
}

.parallax {
    transition: transform 0.1s ease-out;
}

/* Enhanced Fade Out Animation */
@keyframes fadeOut {
    to {
        opacity: 0;
        transform: scale(0.9);
        filter: blur(5px);
    }
}

/* Particle Burst Effect */
.particle-burst {
    position: relative;
    overflow: visible;
}

.particle-burst::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(circle, #3f51b5 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: particleBurst 0.6s ease-out;
    pointer-events: none;
}

@keyframes particleBurst {
    0% {
        width: 0;
        height: 0;
        opacity: 1;
    }
    100% {
        width: 200px;
        height: 200px;
        opacity: 0;
    }
}
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);