/* ==========================================================================
   FUTURISTIC CYBERNETIC INTERACTIVE SYSTEM (SCRIPT.JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --------------------------------------------------------------------------
       1. GLOBAL STATE & CONFIGURATION
       -------------------------------------------------------------------------- */
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const cursor = { dotX: 0, dotY: 0, glowX: 0, glowY: 0 };
    
    // Select elements
    const cursorGlow = document.getElementById('cursor-glow');
    const cursorDot = document.getElementById('cursor-dot');
    const navHeader = document.querySelector('.glass-nav');
    const menuBtn = document.getElementById('menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const terminalBody = document.getElementById('terminal-body');
    const terminalForm = document.getElementById('terminal-form');
    const terminalInput = document.getElementById('terminal-input');
    const footerPing = document.getElementById('footer-ping');
    
    /* --------------------------------------------------------------------------
       2. LAGGING CUSTOM CURSOR PHYSICS (LERP)
       -------------------------------------------------------------------------- */
    if (!isTouchDevice && cursorGlow && cursorDot) {
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        // Frame rendering cursor animation
        const updateCursor = () => {
            // LERP (Linear Interpolation) calculations for smooth drag
            cursor.dotX += (mouse.x - cursor.dotX) * 0.35;
            cursor.dotY += (mouse.y - cursor.dotY) * 0.35;
            
            cursor.glowX += (mouse.x - cursor.glowX) * 0.12;
            cursor.glowY += (mouse.y - cursor.glowY) * 0.12;
            
            cursorDot.style.left = `${cursor.dotX}px`;
            cursorDot.style.top = `${cursor.dotY}px`;
            
            cursorGlow.style.left = `${cursor.glowX}px`;
            cursorGlow.style.top = `${cursor.glowY}px`;
            
            requestAnimationFrame(updateCursor);
        };
        updateCursor();

        // Mouse hover interactions triggers
        const interactables = 'a, button, input, textarea, .quick-cmd-btn, .menu-btn, .contact-node';
        document.body.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactables)) {
                cursorGlow.classList.add('cursor-hovering');
                cursorDot.classList.add('cursor-hovering');
            }
        });

        document.body.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactables)) {
                cursorGlow.classList.remove('cursor-hovering');
                cursorDot.classList.remove('cursor-hovering');
            }
        });
    }

    /* --------------------------------------------------------------------------
       3. INTERACTIVE PARTICLE CANVAS STARFIELD (REPULSION FIELD)
       -------------------------------------------------------------------------- */
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const repulsionRadius = 150;
        const repulsionStrength = 0.8;
        const connectionDistance = 120;
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        function initParticles() {
            particles = [];
            // Limit count on smaller screens to maximize CPU cycles
            const count = Math.min(80, Math.floor(window.innerWidth / 15));
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    baseX: Math.random() * canvas.width,
                    baseY: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    radius: Math.random() * 2 + 1,
                    alpha: Math.random() * 0.5 + 0.1
                });
            }
        }
        initParticles();
        window.addEventListener('resize', () => {
            initParticles();
        });

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                
                // Base floating physics
                p.x += p.vx;
                p.y += p.vy;
                
                // Screen boundary wrapping
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                
                // Calculate physical mouse repulsion
                if (!isTouchDevice) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < repulsionRadius) {
                        const force = (repulsionRadius - dist) / repulsionRadius;
                        const directionX = dx / dist;
                        const directionY = dy / dist;
                        
                        // Push away relative to force
                        p.x += directionX * force * repulsionStrength * 4;
                        p.y += directionY * force * repulsionStrength * 4;
                    }
                }
                
                // Draw particle node
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 242, 254, ${p.alpha})`;
                ctx.fill();
                
                // Calculate and draw connective neural lines
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const lDx = p.x - p2.x;
                    const lDy = p.y - p2.y;
                    const lDist = Math.sqrt(lDx * lDx + lDy * lDy);
                    
                    if (lDist < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        
                        // Fades connections with distance
                        const opacity = 0.15 * (1 - lDist / connectionDistance);
                        ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    /* --------------------------------------------------------------------------
       4. HOLOGRAPHIC MOUSE-GLOW CARDS
       -------------------------------------------------------------------------- */
    if (!isTouchDevice) {
        const glowCards = document.querySelectorAll('.mouse-glow-card');
        glowCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    /* --------------------------------------------------------------------------
       5. SKILL METER LOAD ANIMATION (INTERSECTION OBSERVER)
       -------------------------------------------------------------------------- */
    const skillsSection = document.getElementById('skills');
    const skillFills = document.querySelectorAll('.progress-bar-fill');
    
    if (skillsSection && skillFills.length > 0) {
        const observerOptions = {
            root: null,
            threshold: 0.15
        };
        
        const skillObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillFills.forEach(fill => {
                        const targetWidth = fill.getAttribute('data-width');
                        fill.style.width = targetWidth;
                    });
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        skillObserver.observe(skillsSection);
    }

    /* --------------------------------------------------------------------------
       6. COMPACT SCROLLED NAVBAR & SMOOTH SCROLL SECTIONS ACTIVE
       -------------------------------------------------------------------------- */
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navHeader.classList.add('nav-scrolled');
        } else {
            navHeader.classList.remove('nav-scrolled');
        }
        
        // Navigation active highlight logic
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* --------------------------------------------------------------------------
       7. MOBILE NAV DRAWER OPEN/CLOSE & PAGE LOCK
       -------------------------------------------------------------------------- */
    if (menuBtn && mobileDrawer) {
        let isMenuOpen = false;
        
        const toggleMenu = () => {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen) {
                menuBtn.classList.add('open');
                mobileDrawer.classList.add('open');
                document.body.style.overflow = 'hidden'; // Lock screen scroll
            } else {
                menuBtn.classList.remove('open');
                mobileDrawer.classList.remove('open');
                document.body.style.overflow = 'auto'; // Unlock scroll
            }
        };
        
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
        
        // Close menu if user clicks a drawer link
        const drawerLinks = document.querySelectorAll('.drawer-link');
        drawerLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) toggleMenu();
            });
        });
        
        // Close if click outside drawer
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !mobileDrawer.contains(e.target) && !menuBtn.contains(e.target)) {
                toggleMenu();
            }
        });
    }

    /* --------------------------------------------------------------------------
       8. COUNTER ANIMATION ENGINE
       -------------------------------------------------------------------------- */
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseFloat(counter.dataset.target);
            let current = 0;
            const increment = target / 40;
            const isFloat = target % 1 !== 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = isFloat ? target.toFixed(1) : target;
                    clearInterval(timer);
                } else {
                    counter.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
                }
            }, 30);
        });
    }

    // Trigger counters early on load
    setTimeout(animateCounters, 600);

    /* --------------------------------------------------------------------------
       9. CYBER CONSOLE SHELL COMMAND ENGINE
       -------------------------------------------------------------------------- */
    // Terminal DB replies
    const TERMINAL_COMMANDS = {
        '/help': `
<span class="term-highlight">AVAILABLE PROTOCOLS:</span>
  <span class="term-prompt">/about</span>      - Print software engineer core biography payload
  <span class="term-prompt">/skills</span>     - Renders engineer's primary technological nodes
  <span class="term-prompt">/projects</span>   - Deploys repository links of completed builds
  <span class="term-prompt">/contact</span>    - Print transmission links & activate packet routes
  <span class="term-prompt">/clear</span>     - Purge terminal records database
  <span class="term-prompt">/help</span>      - Display protocol list
`,
        '/about': `
<span class="term-highlight">SUBJECT BIOGRAPHY: BHUSHAN PATIL</span>
  * ROLE: <span class="term-success">Junior MERN Stack Engineer</span>
  * DEPLOYMENT BASE: Surat, Gujarat, India
  * BIOLOGY: 1.5+ Years full-lifecycle software development
  * FOCUS:
    - High-throughput asynchronous Node.js servers
    - Encrypted JWT session cookies + RBAC gatekeeping
    - Programmatic SEO indexation pipelines
    - High-fidelity reactive single-page user layers
`,
        '/skills': `
<span class="term-highlight">CORE MATRIX CAPABILITIES:</span>
  [FRONTEND] React.js, Next.js, ES6+, WebSockets
  [BACKEND] Node.js, Express.js, REST API Architecture
  [DATABASE] MongoDB, Mongoose, Data-aggregation modeling
  [DEVOPS] VPS deployments, Nginx routing, Git versioning, JWT security
`,
        '/projects': `
<span class="term-highlight">COMPLETED BUILDS ARCHIVE:</span>
  1. <span class="term-success">[Social Media Downloader Hub]</span> - Programmatic SEO downloader
     * Codebase: <a href="https://github.com/Bhushanpatil001" target="_blank" style="color:var(--neon-cyan)">github.com/Bhushanpatil001</a>
  2. <span class="term-success">[Smart AdPilot CMS]</span> - Automated AI publishing engine
     * Codebase: <a href="https://github.com/Bhushanpatil001" target="_blank" style="color:var(--neon-cyan)">github.com/Bhushanpatil001</a>
  3. <span class="term-success">[BookMyService]</span> - Real-time scheduling with Stripe webhooks
     * Codebase: <a href="https://github.com/Bhushanpatil001" target="_blank" style="color:var(--neon-cyan)">github.com/Bhushanpatil001</a>
`,
        '/contact': `
<span class="term-highlight">COMMS BRIDGE INITIATED:</span>
  * SECURE EMAIL: 1bushanpatil0117@gmail.com
  * DIGITAL VOICE: +91-8329143496
  * GITHUB: github.com/Bhushanpatil001
  * LINKEDIN: linkedin.com/in/bhushanpatil017
  
  <span class="term-system">[SYSTEM] Focus active: Secure Form input initialized.</span>
`
    };

    function appendTerminalLine(text, type = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.innerHTML = text;
        terminalBody.appendChild(line);
        // Scroll terminal to base
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    if (terminalForm && terminalInput && terminalBody) {
        terminalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rawVal = terminalInput.value.trim();
            terminalInput.value = '';
            
            if (!rawVal) return;
            
            // Print user prompt entered
            appendTerminalLine(`guest@bhushan-node:~$ <span class="term-command-mock">${rawVal}</span>`);
            
            const lowerCmd = rawVal.toLowerCase();
            
            if (lowerCmd === '/clear') {
                terminalBody.innerHTML = '';
                appendTerminalLine('<span class="term-system">[SYSTEM]</span> Database buffer purged.', 'term-system');
                return;
            }
            
            if (TERMINAL_COMMANDS[lowerCmd]) {
                // Return pre-built system response
                appendTerminalLine(TERMINAL_COMMANDS[lowerCmd]);
                
                // Focus inputs on contact trigger
                if (lowerCmd === '/contact') {
                    const formName = document.getElementById('name');
                    if (formName) formName.focus();
                }
            } else {
                appendTerminalLine(`<span class="term-system">[ERROR]</span> Command not recognized: <span style="color:var(--neon-red)">${rawVal}</span>. Type <span class="term-highlight">/help</span> for system protocols.`);
            }
        });

        // Connect quick action preset buttons click logic
        const quickCmdBtns = document.querySelectorAll('.quick-cmd-btn');
        quickCmdBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const cmd = btn.getAttribute('data-cmd');
                if (cmd) {
                    terminalInput.value = cmd;
                    // Trigger submit manually
                    const submitEvent = new Event('submit', { cancelable: true });
                    terminalForm.dispatchEvent(submitEvent);
                }
            });
        });
    }

    /* --------------------------------------------------------------------------
       10. ACTIVE PING HUD DYNAMIC LATENCY
       -------------------------------------------------------------------------- */
    if (footerPing) {
        setInterval(() => {
            // Generate random network ping fluctuation (12ms - 28ms)
            const randomPing = Math.floor(Math.random() * 16) + 12;
            footerPing.textContent = `${randomPing}ms`;
        }, 3000);
    }

    /* --------------------------------------------------------------------------
       11. ENCRYPTED WEB TRANSMISSION DISPATCH (CONTACT FORM)
       -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Select name values
            const nameVal = document.getElementById('name')?.value || 'User';
            
            // Simulate packet encryption pipeline
            const submitBtn = contactForm.querySelector('.btn-cyber-submit');
            const submitText = submitBtn?.querySelector('.submit-text');
            
            if (submitBtn && submitText) {
                submitBtn.disabled = true;
                const oldContent = submitText.innerHTML;
                
                // Cyber status loader loop
                let step = 0;
                const steps = [
                    'ESTABLISHING HANDSHAKE...',
                    'ENCRYPTING DATA PACKET (RSA-4096)...',
                    'DISPATCHING UPLINK SATELLITE NODE...',
                    'TRANSMISSION COMPLETED SUCCESSFULLY!'
                ];
                
                const processTimer = setInterval(() => {
                    if (step < steps.length) {
                        submitText.innerHTML = `${steps[step]} <i class="fas fa-microchip fa-spin"></i>`;
                        step++;
                    } else {
                        clearInterval(processTimer);
                        
                        // Display secure success toast notification
                        showGlowNotification(`✨ SECURE DISPATCH RECEIVED: Message successfully encrypted and routed to Bhushan's network!`);
                        
                        // Reset form
                        contactForm.reset();
                        submitBtn.disabled = false;
                        submitText.innerHTML = oldContent;
                    }
                }, 900);
            }
        });
    }

    // Glowing Toast notification system
    function showGlowNotification(message) {
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.bottom = '30px';
        toast.style.right = '30px';
        toast.style.background = 'rgba(8, 16, 32, 0.95)';
        toast.style.border = '1px solid var(--neon-cyan)';
        toast.style.borderRadius = '8px';
        toast.style.color = '#fff';
        toast.style.padding = '1.2rem 2rem';
        toast.style.fontFamily = 'var(--font-mono)';
        toast.style.fontSize = '0.85rem';
        toast.style.zIndex = '99999';
        toast.style.boxShadow = '0 0 25px var(--neon-cyan-glow)';
        toast.style.transition = 'var(--transition-smooth)';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.innerHTML = message;
        
        document.body.appendChild(toast);
        
        // Fade in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove toast
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 4000);
    }
});