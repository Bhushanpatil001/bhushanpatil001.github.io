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
  <span class="term-prompt">/hack</span>       - Initiates level 4 firewall decryption mini-game
  <span class="term-prompt">/clear</span>      - Purge terminal records database
  <span class="term-prompt">/help</span>       - Display protocol list
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
`,
        '/hack': `
<span class="term-system">[SYSTEM] Initializing firewall bypass sequence...</span>
  * Status: Handshake completed.
  * Launching **Cognitive Decryption interface** overlay.
`,
        '/decrypt': `
<span class="term-system">[SYSTEM] Initializing firewall bypass sequence...</span>
  * Status: Handshake completed.
  * Launching **Cognitive Decryption interface** overlay.
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
                
                // Trigger Hacking game
                if (lowerCmd === '/hack' || lowerCmd === '/decrypt') {
                    setTimeout(() => {
                        startHackingGame();
                    }, 800);
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

    /* --------------------------------------------------------------------------
       12. TACTILE WEB AUDIO SYNTHESIZER ENGINE
       -------------------------------------------------------------------------- */
    let audioCtx = null;
    let sfxEnabled = true;

    // Lazy initialization of AudioContext on user interaction
    function initAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // Play procedural synthesised sounds
    function playSynthSound(type) {
        if (!sfxEnabled) return;
        try {
            initAudioContext();
            if (!audioCtx) return;

            const now = audioCtx.currentTime;
            
            switch (type) {
                case 'click': {
                    // Quick mechanical sweep chirp
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(1200, now);
                    osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
                    
                    gain.gain.setValueAtTime(0.08, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                    
                    osc.start(now);
                    osc.stop(now + 0.08);
                    break;
                }
                case 'hover': {
                    // Ultra quick sine pip
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(800, now);
                    osc.frequency.setValueAtTime(1600, now + 0.015);
                    
                    gain.gain.setValueAtTime(0.03, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
                    
                    osc.start(now);
                    osc.stop(now + 0.03);
                    break;
                }
                case 'beep': {
                    // Flat synth pip (typing sound)
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(950, now);
                    
                    gain.gain.setValueAtTime(0.04, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                    
                    osc.start(now);
                    osc.stop(now + 0.05);
                    break;
                }
                case 'error': {
                    // Dual low saw buzzy dischord
                    const osc1 = audioCtx.createOscillator();
                    const osc2 = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    
                    osc1.connect(gain);
                    osc2.connect(gain);
                    gain.connect(audioCtx.destination);
                    
                    osc1.type = 'sawtooth';
                    osc1.frequency.setValueAtTime(110, now);
                    osc1.frequency.linearRampToValueAtTime(80, now + 0.25);
                    
                    osc2.type = 'sawtooth';
                    osc2.frequency.setValueAtTime(115, now);
                    osc2.frequency.linearRampToValueAtTime(83, now + 0.25);
                    
                    gain.gain.setValueAtTime(0.07, now);
                    gain.gain.linearRampToValueAtTime(0.001, now + 0.25);
                    
                    osc1.start(now);
                    osc2.start(now);
                    osc1.stop(now + 0.25);
                    osc2.stop(now + 0.25);
                    break;
                }
                case 'success': {
                    // Arpeggio rising laser sweeps
                    const timeWindow = 0.4;
                    const notes = [440, 554, 659, 880];
                    notes.forEach((freq, idx) => {
                        const playTime = now + (idx * 0.07);
                        const osc = audioCtx.createOscillator();
                        const gain = audioCtx.createGain();
                        
                        osc.connect(gain);
                        gain.connect(audioCtx.destination);
                        
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(freq, playTime);
                        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, playTime + 0.12);
                        
                        gain.gain.setValueAtTime(0.06, playTime);
                        gain.gain.exponentialRampToValueAtTime(0.001, playTime + 0.12);
                        
                        osc.start(playTime);
                        osc.stop(playTime + 0.12);
                    });
                    break;
                }
                case 'sweep': {
                    // Soft synth low filter pass sweep (opening deck)
                    const osc = audioCtx.createOscillator();
                    const filter = audioCtx.createBiquadFilter();
                    const gain = audioCtx.createGain();
                    
                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(audioCtx.destination);
                    
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(80, now);
                    osc.frequency.exponentialRampToValueAtTime(320, now + 0.35);
                    
                    filter.type = 'lowpass';
                    filter.Q.setValueAtTime(8, now);
                    filter.frequency.setValueAtTime(150, now);
                    filter.frequency.exponentialRampToValueAtTime(1200, now + 0.35);
                    
                    gain.gain.setValueAtTime(0.08, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                    
                    osc.start(now);
                    osc.stop(now + 0.35);
                    break;
                }
            }
        } catch (e) {
            console.warn("Web Audio API not fully compatible/blocked: ", e);
        }
    }

    // Attach mechanical sound triggers on generic hovering & clicking
    const triggerAudioHovers = () => {
        const audioNodes = 'a, button, input, textarea, .quick-cmd-btn, .menu-btn, .contact-node, .cyber-switch, .theme-btn';
        document.body.addEventListener('mouseover', (e) => {
            if (e.target.closest(audioNodes)) {
                playSynthSound('hover');
            }
        });
        document.body.addEventListener('click', (e) => {
            if (e.target.closest(audioNodes)) {
                playSynthSound('click');
            }
        });
    };
    triggerAudioHovers();

    /* --------------------------------------------------------------------------
       13. COGNITIVE HUD & SETTINGS INTERFACE MANAGEMENT
       -------------------------------------------------------------------------- */
    const hudToggle = document.getElementById('hud-toggle');
    const hudPanel = document.getElementById('hud-panel');
    const hudClose = document.getElementById('hud-close');
    const sfxToggleInput = document.getElementById('sfx-toggle');
    const waveVisualizer = document.getElementById('wave-visualizer');
    
    // Toggle Control deck panel open/close
    if (hudToggle && hudPanel && hudClose) {
        hudToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            hudPanel.classList.toggle('open');
            playSynthSound('sweep');
        });
        hudClose.addEventListener('click', () => {
            hudPanel.classList.remove('open');
            playSynthSound('click');
        });
        document.addEventListener('click', (e) => {
            if (hudPanel.classList.contains('open') && !hudPanel.contains(e.target) && !hudToggle.contains(e.target)) {
                hudPanel.classList.remove('open');
            }
        });
    }

    // Sound FX Switch handler
    if (sfxToggleInput && waveVisualizer) {
        sfxToggleInput.addEventListener('change', () => {
            sfxEnabled = sfxToggleInput.checked;
            if (sfxEnabled) {
                waveVisualizer.classList.add('playing');
                playSynthSound('success');
            } else {
                waveVisualizer.classList.remove('playing');
            }
            localStorage.setItem('cyber_sfx_enabled', sfxEnabled);
        });
        
        // Cache read
        const savedSfx = localStorage.getItem('cyber_sfx_enabled');
        if (savedSfx !== null) {
            sfxEnabled = savedSfx === 'true';
            sfxToggleInput.checked = sfxEnabled;
            if (sfxEnabled) waveVisualizer.classList.add('playing');
            else waveVisualizer.classList.remove('playing');
        } else {
            waveVisualizer.classList.add('playing');
        }
    }

    // Visual matrix overlays toggling (CRT Scanlines, noise filters)
    const scanlinesToggle = document.getElementById('scanlines-toggle');
    const noiseToggle = document.getElementById('noise-toggle');
    const particlesToggle = document.getElementById('particles-toggle');
    
    const scanlinesOverlay = document.querySelector('.cyber-scanlines');
    const noiseOverlay = document.querySelector('.cyber-noise');
    const particleCanvas = document.getElementById('bg-canvas');

    if (scanlinesToggle && scanlinesOverlay) {
        scanlinesToggle.addEventListener('change', () => {
            scanlinesOverlay.style.display = scanlinesToggle.checked ? 'block' : 'none';
            localStorage.setItem('cyber_scanlines_show', scanlinesToggle.checked);
        });
        // Cache read
        const savedScan = localStorage.getItem('cyber_scanlines_show');
        if (savedScan !== null) {
            scanlinesToggle.checked = savedScan === 'true';
            scanlinesOverlay.style.display = scanlinesToggle.checked ? 'block' : 'none';
        }
    }

    if (noiseToggle && noiseOverlay) {
        noiseToggle.addEventListener('change', () => {
            noiseOverlay.style.display = noiseToggle.checked ? 'block' : 'none';
            localStorage.setItem('cyber_noise_show', noiseToggle.checked);
        });
        // Cache read
        const savedNoise = localStorage.getItem('cyber_noise_show');
        if (savedNoise !== null) {
            noiseToggle.checked = savedNoise === 'true';
            noiseOverlay.style.display = noiseToggle.checked ? 'block' : 'none';
        }
    }

    if (particlesToggle && particleCanvas) {
        particlesToggle.addEventListener('change', () => {
            particleCanvas.style.opacity = particlesToggle.checked ? '1' : '0';
            localStorage.setItem('cyber_particles_show', particlesToggle.checked);
        });
        // Cache read
        const savedPart = localStorage.getItem('cyber_particles_show');
        if (savedPart !== null) {
            particlesToggle.checked = savedPart === 'true';
            particleCanvas.style.opacity = particlesToggle.checked ? '1' : '0';
        }
    }

    // Theme Switch Engine
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const theme = btn.getAttribute('data-theme');
            applyMatrixTheme(theme);
        });
    });

    function applyMatrixTheme(theme) {
        document.body.classList.remove('theme-matrix-green', 'theme-cyberpunk-yellow');
        
        if (theme === 'matrix') {
            document.body.classList.add('theme-matrix-green');
        } else if (theme === 'cyberpunk') {
            document.body.classList.add('theme-cyberpunk-yellow');
        }
        
        localStorage.setItem('cyber_active_theme', theme);
        playSynthSound('success');
        showGlowNotification(`🔄 THEME INITIALIZED: Code Matrix modified to **${theme.toUpperCase()}** state.`);
    }

    // Cache Theme Load
    const savedTheme = localStorage.getItem('cyber_active_theme');
    if (savedTheme) {
        applyMatrixTheme(savedTheme);
        themeBtns.forEach(btn => {
            if (btn.getAttribute('data-theme') === savedTheme) {
                themeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    }

    /* --------------------------------------------------------------------------
       14. COGNITIVE DECRYPTION MINI-GAME ENGINE
       -------------------------------------------------------------------------- */
    const hackingModal = document.getElementById('hacking-modal');
    const closeHackingBtn = document.getElementById('close-hacking-btn');
    const hudDecryptBtn = document.getElementById('hud-decrypt-btn');
    let hackingWordGrid = document.getElementById('hacking-word-grid');
    let hackingHexLog = document.getElementById('hacking-hex-log');
    let hackingConsoleFeed = document.getElementById('hacking-console-feed');
    let selectedWordPreview = document.getElementById('selected-word-preview');
    let attemptsLeftContainer = document.getElementById('attempts-left');
    const hackTimerDisplay = document.getElementById('hack-timer');

    const GAME_WORDS = [
        'GATEWAY', 'SECURITY', 'FIREWALL', 'DATABASE', 'PROTOCOL',
        'TERMINAL', 'MALWARE', 'DECRYPT', 'KEYWORD', 'NETWORK',
        'UPLINKED', 'MAINCORE', 'PHISHING', 'CYBERNET', 'SPYWARE'
    ];

    let secretKey = '';
    let attemptsLeft = 4;
    let gameTimer = null;
    let timeRemaining = 45.00;
    let gameActive = false;

    // Start Decryption Hacking Modal
    function startHackingGame() {
        initAudioContext();
        hackingModal.classList.add('open');
        gameActive = true;
        attemptsLeft = 4;
        timeRemaining = 45.00;
        
        // Restore/Ensure layout is fresh
        restoreHackingBodyHTML();
        
        // Reset logs and inputs
        selectedWordPreview.textContent = 'HOVER OVER MATRIX NODE...';
        hackingConsoleFeed.innerHTML = `
            <div class="feed-line">> Security handshake complete.</div>
            <div class="feed-line">> Bypassing main gate filter...</div>
            <div class="feed-line">> Encryption complexity: level 4 detected.</div>
        `;
        
        // Build Hacking HUD nodes
        generateHackingNodes();
        updateAttemptsUI();
        
        // Sound and timer
        playSynthSound('sweep');
        
        // Set up Timer
        if (gameTimer) clearInterval(gameTimer);
        gameTimer = setInterval(() => {
            if (!gameActive) return;
            timeRemaining -= 0.05;
            if (timeRemaining <= 0) {
                timeRemaining = 0;
                triggerHackingLockout();
            }
            hackTimerDisplay.textContent = `TIME_REMAINING: ${timeRemaining.toFixed(2)}s`;
        }, 50);
    }

    // Close/Abort Hacking
    function closeHackingGame() {
        hackingModal.classList.remove('open');
        gameActive = false;
        if (gameTimer) clearInterval(gameTimer);
        playSynthSound('click');
    }

    if (closeHackingBtn) closeHackingBtn.addEventListener('click', closeHackingGame);
    if (hudDecryptBtn) hudDecryptBtn.addEventListener('click', startHackingGame);

    // Lock game clicks if modal is clicked outside workspace
    hackingModal.addEventListener('click', (e) => {
        if (e.target === hackingModal) closeHackingGame();
    });

    // Generate hexadecimal scrolling stream on left
    function generateHackingNodes() {
        // Hex array
        let hexHTML = '';
        for (let i = 0; i < 18; i++) {
            const randomHex = Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0');
            hexHTML += `<div>0x${randomHex}</div>`;
        }
        hackingHexLog.innerHTML = hexHTML;
        
        // Select 8-10 words
        const shuffledWords = [...GAME_WORDS].sort(() => 0.5 - Math.random());
        const selectedWords = shuffledWords.slice(0, 8);
        secretKey = selectedWords[Math.floor(Math.random() * selectedWords.length)];
        
        // Build character matrix grid (Fallout Style)
        const symbols = '!@#$%^&*()_+[]{}|;:,.<>?/~';
        let gridHTML = '';
        
        let wordIndex = 0;
        let charCounter = 0;
        
        // Generate ~250 characters scattered with our words
        while (charCounter < 260) {
            // Decide if we inject a word
            if (Math.random() < 0.08 && wordIndex < selectedWords.length) {
                const word = selectedWords[wordIndex];
                gridHTML += `<span class="hex-word" data-word="${word}">${word}</span>`;
                wordIndex++;
                charCounter += word.length;
            } else {
                const symbol = symbols[Math.floor(Math.random() * symbols.length)];
                gridHTML += `<span>${symbol}</span>`;
                charCounter++;
            }
        }
        
        hackingWordGrid.innerHTML = gridHTML;
        
        // Bind hover and click events to generated spans
        const spans = hackingWordGrid.querySelectorAll('span');
        spans.forEach(span => {
            span.addEventListener('mouseover', (e) => {
                if (!gameActive) return;
                const word = span.getAttribute('data-word');
                if (word) {
                    selectedWordPreview.textContent = word;
                    playSynthSound('hover');
                } else {
                    selectedWordPreview.textContent = span.textContent;
                }
            });
            
            span.addEventListener('click', () => {
                if (!gameActive) return;
                const word = span.getAttribute('data-word');
                if (word) {
                    handleGuess(word);
                } else {
                    playSynthSound('click');
                    appendConsoleFeed(`> Error: Direct symbol node bypass inactive.`);
                }
            });
        });
    }

    function appendConsoleFeed(text, type = '') {
        const line = document.createElement('div');
        line.className = `feed-line ${type}`;
        line.textContent = text;
        hackingConsoleFeed.appendChild(line);
        hackingConsoleFeed.scrollTop = hackingConsoleFeed.scrollHeight;
    }

    function updateAttemptsUI() {
        attemptsLeftContainer.innerHTML = 'ATTEMPTS: ';
        for (let i = 0; i < 4; i++) {
            const dot = document.createElement('span');
            dot.className = `dot-attempt ${i >= attemptsLeft ? 'spent' : ''}`;
            attemptsLeftContainer.appendChild(dot);
        }
    }

    function handleGuess(word) {
        if (word === secretKey) {
            triggerHackingSuccess();
        } else {
            attemptsLeft--;
            updateAttemptsUI();
            
            // Screen shake
            const modalContent = document.querySelector('.hacking-modal-content');
            if (modalContent) {
                modalContent.classList.add('screenshake');
                setTimeout(() => modalContent.classList.remove('screenshake'), 300);
            }
            
            playSynthSound('error');
            
            // Compute Likeness
            let likeness = 0;
            const minLen = Math.min(word.length, secretKey.length);
            for (let i = 0; i < minLen; i++) {
                if (word[i] === secretKey[i]) likeness++;
            }
            
            appendConsoleFeed(`> Guessed: ${word}`, 'feed-error');
            appendConsoleFeed(`> ACCESS DENIED. (Likeness: ${likeness}/8)`, 'feed-error');
            
            if (attemptsLeft <= 0) {
                triggerHackingLockout();
            }
        }
    }

    function triggerHackingSuccess() {
        gameActive = false;
        clearInterval(gameTimer);
        playSynthSound('success');
        
        hackingModal.querySelector('.hacking-body').innerHTML = `
            <div class="decrypt-success-panel">
                <i class="fas fa-check-circle success-icon"></i>
                <h3 class="success-title">COGNITIVE CORE DECRYPTED</h3>
                <p class="success-desc">Congratulations! Firewall layers successfully bypassed. Memory allocation state holds green. You have successfully established a trusted operational link.</p>
                
                <div class="classified-briefing-box">
                    <div class="briefing-header">// ACCESSING CORE CLASS-A ASSETS</div>
                    <p style="color:var(--color-text-main); font-size:0.85rem;">Engineer Profile Dossier: **Bhushan_Patil_CV.pdf** has been decrypted and made available for high-priority download.</p>
                    <a href="https://raw.githubusercontent.com/Bhushanpatil001/portfolio/main/resume.pdf" download="Bhushan_Patil_CV.pdf" target="_blank" class="btn-cyber-primary briefing-btn" style="border: 1px solid var(--neon-green); color: #000;">
                        <span class="btn-bg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(90deg, var(--neon-green), #16a34a); z-index: 1;"></span>
                        <span class="btn-text" style="position: relative; z-index: 2; display: flex; align-items: center; justify-content: center; gap: 0.6rem;">DOWNLOAD CLASSIFIED BRIEFING <i class="fas fa-download"></i></span>
                    </a>
                </div>
            </div>
        `;
        hackTimerDisplay.textContent = 'DECRYPTION: COMPLETE';
        hackTimerDisplay.style.color = 'var(--neon-green)';
        hackTimerDisplay.style.textShadow = '0 0 10px var(--neon-green)';
    }

    function triggerHackingLockout() {
        gameActive = false;
        clearInterval(gameTimer);
        playSynthSound('error');
        
        hackingModal.querySelector('.hacking-body').innerHTML = `
            <div class="lockout-message">
                <i class="fas fa-exclamation-triangle lockout-icon"></i>
                <h3 class="lockout-title">COGNITIVE LOCKOUT PROTOCOL</h3>
                <p class="lockout-desc">Firewall security threshold exceeded. Core systems frozen to prevent intrusion. Please abort network connection and initialize secondary node handshake.</p>
                <button class="btn-cyber-primary" id="retry-hacking-btn" style="border: 1px solid var(--neon-red); background:rgba(239, 68, 68, 0.05);">
                    <span class="btn-text" style="color:var(--neon-red); text-shadow:0 0 8px var(--neon-red);"><i class="fas fa-redo"></i> RE-ESTABLISH SAFE HANDSHAKE</span>
                </button>
            </div>
        `;
        
        const retryBtn = document.getElementById('retry-hacking-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                restoreHackingBodyHTML();
                startHackingGame();
            });
        }
    }

    function restoreHackingBodyHTML() {
        hackingModal.querySelector('.hacking-body').innerHTML = `
            <!-- Instruction Panel -->
            <div class="hacking-instructions">
                <span class="term-system">// ACCESS CODE LEVEL 4 ENCRYPTION DETECTED</span>
                <p>Select the correct **CORE MATRIX KEY** from the memory array below. You have **4 attempts** to bypass the firewall, or a screen security lockout will occur.</p>
            </div>
            
            <div class="hacking-workspace">
                <!-- Left: Scrolling Memory Hex Array (Fallout Style) -->
                <div class="hacking-hex-column" id="hacking-hex-log">
                    <!-- Filled via JS -->
                </div>
                
                <!-- Middle: Visual Code grid selection -->
                <div class="hacking-choices-column">
                    <div class="hacking-grid-wrapper" id="hacking-word-grid">
                        <!-- Words and memory blocks filled via JS -->
                    </div>
                </div>
                
                <!-- Right: Firewall console log feed -->
                <div class="hacking-console-column">
                    <div class="console-title">// DIAGNOSTIC_UPLINK</div>
                    <div class="console-feed" id="hacking-console-feed">
                        <div class="feed-line">> Initializing cognitive scan...</div>
                        <div class="feed-line">> Buffer loaded. Security protocols active.</div>
                    </div>
                </div>
            </div>
            
            <!-- Input / Selection Row -->
            <div class="hacking-input-row">
                <span class="prompt-arrow">></span>
                <span class="selected-word-preview" id="selected-word-preview">HOVER OVER NODE...</span>
                <div class="attempts-indicator" id="attempts-left">
                    ATTEMPTS: <span class="dot-attempt"></span><span class="dot-attempt"></span><span class="dot-attempt"></span><span class="dot-attempt"></span>
                </div>
            </div>
        `;
        
        // Re-locate elements
        attemptsLeftContainer = document.getElementById('attempts-left');
        hackingWordGrid = document.getElementById('hacking-word-grid');
        hackingHexLog = document.getElementById('hacking-hex-log');
        hackingConsoleFeed = document.getElementById('hacking-console-feed');
        selectedWordPreview = document.getElementById('selected-word-preview');
    }
});