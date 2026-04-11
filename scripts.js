// scripts.js
document.addEventListener('DOMContentLoaded', function () {

    // --- Mobile Menu Logic ---
    const toggleButton = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (toggleButton && mobileMenu) {
        toggleButton.addEventListener('click', () => {
            const isOpen = !mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden');
            toggleButton.setAttribute('aria-expanded', String(!isOpen));
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                toggleButton.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- "Building..." Ticker ---
    const nowPlayingElement = document.getElementById('now-playing');
    if (nowPlayingElement) {
        const playlist = [
            "Automation and AI/ML",
            "SIEM Pipelines with Splunk + Wazuh",
            "Python & FastAPI",
            "React.js + Node.js Development",
            "Cloud Engineering on AWS",
            "Linux System Administration",
            "Docker & Containerization",
            "Security Hardening",
            "MySQL, MongoDB & Other Databases",
            "Networking Fundamentals",
            "Monitoring & Logging",
            "Data Analysis with Pandas",
            "API Development & Integration",
            "Version Control with Git",
            "Systems Engineering & Infrastructure"
        ];
        let currentTrack = 0;
        const ticker = setInterval(() => {
            currentTrack = (currentTrack + 1) % playlist.length;
            nowPlayingElement.style.opacity = 0;
            setTimeout(() => {
                nowPlayingElement.textContent = playlist[currentTrack];
                nowPlayingElement.style.opacity = 1;
            }, 500);
        }, 3000);
        // Clean up if element is removed
        nowPlayingElement._stopTicker = () => clearInterval(ticker);
    }

    // --- Scroll Animate for header ---
    document.querySelectorAll('.scroll-animate').forEach(el => {
        if (el.id === 'global-header') el.classList.add('animate-visible');
    });

    // --- Reveal on Scroll (sections) ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObserver.observe(el));

    // --- Progress bar animation on scroll ---
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('[data-width]').forEach(bar => {
                    bar.style.width = bar.getAttribute('data-width');
                });
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.progress-section').forEach(el => progressObserver.observe(el));

    // --- Active nav highlighting on scroll ---
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const sectionIds = Array.from(navLinks)
        .map(a => a.getAttribute('href').slice(1))
        .filter(id => document.getElementById(id));

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(a => a.classList.remove('nav-active'));
                const active = document.querySelector(`nav a[href="#${entry.target.id}"]`);
                if (active) active.classList.add('nav-active');
            }
        });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

    sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) sectionObserver.observe(el);
    });

    // --- Particle Network ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        // Respect prefers-reduced-motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            canvas.style.display = 'none';
        } else {
            const ctx = canvas.getContext('2d');
            let particles = [];
            let mouse = { x: null, y: null, clicking: false };
            let rafId = null;
            let isVisible = true;
            const isMobile = window.innerWidth < 768;
            const PARTICLE_COUNT = isMobile ? 40 : 110;
            const CONNECT_DISTANCE = isMobile ? 110 : 160;
            const MOUSE_RADIUS = 200;
            const MOUSE_CONNECT_RADIUS = 250;

            function resize() {
                canvas.width = canvas.parentElement.offsetWidth;
                canvas.height = canvas.parentElement.offsetHeight;
            }

            function createParticles() {
                particles = [];
                for (let i = 0; i < PARTICLE_COUNT; i++) {
                    particles.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        vx: (Math.random() - 0.5) * 0.5,
                        vy: (Math.random() - 0.5) * 0.5,
                        r: 1.5 + Math.random() * 2,
                        baseR: 1.5 + Math.random() * 2
                    });
                }
            }

            function draw() {
                if (!isVisible) { rafId = null; return; }
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];

                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < 0) p.x = canvas.width;
                    if (p.x > canvas.width) p.x = 0;
                    if (p.y < 0) p.y = canvas.height;
                    if (p.y > canvas.height) p.y = 0;

                    let mouseDist = Infinity;
                    if (mouse.x !== null) {
                        const dx = p.x - mouse.x;
                        const dy = p.y - mouse.y;
                        mouseDist = Math.sqrt(dx * dx + dy * dy);

                        if (mouseDist < MOUSE_RADIUS && mouseDist > 0) {
                            const force = (MOUSE_RADIUS - mouseDist) / MOUSE_RADIUS * (mouse.clicking ? 0.08 : 0.04);
                            const dir = mouse.clicking ? -1 : 1;
                            p.vx += dir * dx / mouseDist * force;
                            p.vy += dir * dy / mouseDist * force;
                        }

                        if (mouseDist < MOUSE_RADIUS) {
                            p.r = p.baseR + (1 - mouseDist / MOUSE_RADIUS) * 3;
                        } else {
                            p.r += (p.baseR - p.r) * 0.1;
                        }

                        if (mouseDist < MOUSE_CONNECT_RADIUS) {
                            const opacity = (1 - mouseDist / MOUSE_CONNECT_RADIUS) * 0.22;
                            ctx.beginPath();
                            ctx.moveTo(mouse.x, mouse.y);
                            ctx.lineTo(p.x, p.y);
                            ctx.strokeStyle = `rgba(233, 193, 118, ${opacity})`;
                            ctx.lineWidth = 0.6;
                            ctx.stroke();
                        }
                    } else {
                        p.r += (p.baseR - p.r) * 0.1;
                    }

                    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                    if (speed > 2) { p.vx *= 2 / speed; p.vy *= 2 / speed; }
                    p.vx *= 0.998;
                    p.vy *= 0.998;

                    const glow = mouseDist < MOUSE_RADIUS ? 0.45 + (1 - mouseDist / MOUSE_RADIUS) * 0.4 : 0.35;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(197, 160, 89, ${glow})`;
                    ctx.fill();

                    for (let j = i + 1; j < particles.length; j++) {
                        const p2 = particles[j];
                        const dx = p.x - p2.x;
                        const dy = p.y - p2.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < CONNECT_DISTANCE) {
                            const opacity = (1 - dist / CONNECT_DISTANCE) * 0.14;
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.strokeStyle = `rgba(197, 160, 89, ${opacity})`;
                            ctx.lineWidth = 0.8;
                            ctx.stroke();
                        }
                    }
                }

                rafId = requestAnimationFrame(draw);
            }

            // Pause when tab is hidden
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    isVisible = false;
                    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
                } else {
                    isVisible = true;
                    if (!rafId) rafId = requestAnimationFrame(draw);
                }
            });

            // Pause when hero scrolls off screen
            const heroObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    isVisible = entry.isIntersecting;
                    if (isVisible && !rafId) rafId = requestAnimationFrame(draw);
                    if (!isVisible && rafId) { cancelAnimationFrame(rafId); rafId = null; }
                });
            }, { threshold: 0 });
            heroObserver.observe(canvas.parentElement);

            const heroEl = canvas.parentElement;
            heroEl.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            });
            heroEl.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; mouse.clicking = false; });
            heroEl.addEventListener('mousedown', () => { mouse.clicking = true; });
            heroEl.addEventListener('mouseup', () => { mouse.clicking = false; });
            window.addEventListener('resize', resize);

            resize();
            createParticles();
            rafId = requestAnimationFrame(draw);
        }
    }
});
