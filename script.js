// Particle Network Background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouseX = 0;
let mouseY = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function initParticles() {
    const particleCount = Math.min(100, Math.floor(window.innerWidth * window.innerHeight / 15000));
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${0.3 + Math.sin(Date.now() * 0.001 + i) * 0.1})`;
        ctx.fill();
        
        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                const opacity = (1 - distance / 150) * 0.2;
                ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
                ctx.stroke();
            }
        }
    }
    
    requestAnimationFrame(drawParticles);
}

// Mouse trail effect
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Create trail particle
    const trail = document.createElement('div');
    trail.style.position = 'fixed';
    trail.style.width = '4px';
    trail.style.height = '4px';
    trail.style.background = '#3b82f6';
    trail.style.borderRadius = '50%';
    trail.style.left = mouseX - 2 + 'px';
    trail.style.top = mouseY - 2 + 'px';
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '9997';
    trail.style.opacity = '1';
    trail.style.transition = 'opacity 0.5s';
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.style.opacity = '0';
        setTimeout(() => trail.remove(), 500);
    }, 50);
});

// Custom cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
    cursorFollower.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
});

document.addEventListener('mouseenter', () => {
    cursor.style.display = 'block';
    cursorFollower.style.display = 'block';
});

// Hover effect for interactive elements
const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item, .btn-primary, .btn-secondary');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorFollower.style.transform = 'scale(1.5)';
        cursorFollower.style.borderColor = '#d946ef';
    });
    el.addEventListener('mouseleave', () => {
        cursorFollower.style.transform = 'scale(1)';
        cursorFollower.style.borderColor = '#3b82f6';
    });
});

// Typing animation
const typingText = document.querySelector('.typing-text');
const words = ['MERN Stack Developer', 'Full Stack Engineer', 'Problem Solver', 'Tech Enthusiast'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
        return;
    }
    
    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeEffect, 500);
        return;
    }
    
    setTimeout(typeEffect, isDeleting ? 100 : 150);
}

// Counter animation
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (target % 1 !== 0 ? '' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (target % 1 !== 0 ? '' : '');
        }
    }, 30);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('stat-number')) {
                const target = parseFloat(entry.target.dataset.target);
                animateCounter(entry.target, target);
            }
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.stat-number, .skill-item, .project-card').forEach(el => {
    observer.observe(el);
});

// Skill bar animation
const skillItems = document.querySelectorAll('.skill-item');
skillItems.forEach(item => {
    const skillValue = parseInt(item.dataset.skill);
    item.addEventListener('mouseenter', () => {
        item.style.setProperty('--width', skillValue + '%');
    });
});

// Mobile menu
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-link');

menuBtn?.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    const burger = menuBtn.querySelector('.menu-btn__burger');
    if (menuBtn.classList.contains('active')) {
        burger.style.transform = 'rotate(45deg)';
        burger.style.backgroundColor = '#3b82f6';
        const before = burger.previousSibling;
        const after = burger.nextSibling;
    } else {
        burger.style.transform = 'rotate(0)';
        burger.style.backgroundColor = '#eef5ff';
    }
});

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        targetSection?.scrollIntoView({ behavior: 'smooth' });
        navLinks.classList.remove('active');
        menuBtn?.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.glass-nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    // Update active nav link
    const sections = document.querySelectorAll('section');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Form submission
const form = document.getElementById('contact-form');
form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.textContent = '✨ Message sent successfully! I\'ll get back to you soon.';
    successMsg.style.position = 'fixed';
    successMsg.style.bottom = '20px';
    successMsg.style.right = '20px';
    successMsg.style.backgroundColor = '#10b981';
    successMsg.style.color = 'white';
    successMsg.style.padding = '1rem 2rem';
    successMsg.style.borderRadius = '10px';
    successMsg.style.zIndex = '9999';
    successMsg.style.animation = 'slideIn 0.3s ease';
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
        successMsg.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => successMsg.remove(), 300);
    }, 3000);
    
    form.reset();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .visible {
        animation: fadeInUp 0.6s ease forwards;
    }
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .project-card, .skill-category, .glass-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    .project-card.visible, .skill-category.visible, .glass-card.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Initialize
resizeCanvas();
initParticles();
drawParticles();
typeEffect();

window.addEventListener('resize', () => {
    resizeCanvas();
    particles = [];
    initParticles();
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});