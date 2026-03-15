// scripts.js
document.addEventListener('DOMContentLoaded', function () {
    // --- Mobile Menu Logic ---
    const toggleButton = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (toggleButton && mobileMenu) {
        toggleButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
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
        setInterval(() => {
            currentTrack = (currentTrack + 1) % playlist.length;
            nowPlayingElement.style.opacity = 0;
            setTimeout(() => {
                nowPlayingElement.textContent = playlist[currentTrack];
                nowPlayingElement.style.opacity = 1;
            }, 500);
        }, 3000);
    }

    // --- Scroll Animation Logic (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach(element => {
        if (element.id === 'global-header' || element.id === 'hero') {
            element.classList.add('animate-visible');
        } else {
            observer.observe(element);
        }
    });

    // --- Particle Network ---
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, clicking: false };
        const isMobile = window.innerWidth < 768;
        const PARTICLE_COUNT = isMobile ? 40 : 90;
        const CONNECT_DISTANCE = isMobile ? 110 : 160;
        const MOUSE_RADIUS = 200;
        const MOUSE_CONNECT_RADIUS = 250;

        function resize() {
            const hero = canvas.parentElement;
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }

        function createParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    r: 2 + Math.random() * 2,
                    baseR: 2 + Math.random() * 2
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges
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
                        if (mouse.clicking) {
                            // Click: pull particles toward cursor
                            const force = (MOUSE_RADIUS - mouseDist) / MOUSE_RADIUS * 0.08;
                            p.vx -= dx / mouseDist * force;
                            p.vy -= dy / mouseDist * force;
                        } else {
                            // Hover: push particles away
                            const force = (MOUSE_RADIUS - mouseDist) / MOUSE_RADIUS * 0.04;
                            p.vx += dx / mouseDist * force;
                            p.vy += dy / mouseDist * force;
                        }
                    }

                    // Grow particles near cursor
                    if (mouseDist < MOUSE_RADIUS) {
                        p.r = p.baseR + (1 - mouseDist / MOUSE_RADIUS) * 3;
                    } else {
                        p.r += (p.baseR - p.r) * 0.1;
                    }

                    // Draw lines from cursor to nearby particles
                    if (mouseDist < MOUSE_CONNECT_RADIUS) {
                        const opacity = (1 - mouseDist / MOUSE_CONNECT_RADIUS) * 0.25;
                        ctx.beginPath();
                        ctx.moveTo(mouse.x, mouse.y);
                        ctx.lineTo(p.x, p.y);
                        ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                } else {
                    p.r += (p.baseR - p.r) * 0.1;
                }

                // Dampen velocity
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (speed > 2) {
                    p.vx *= 2 / speed;
                    p.vy *= 2 / speed;
                }
                p.vx *= 0.998;
                p.vy *= 0.998;

                // Draw dot (brighter near cursor)
                const glow = mouseDist < MOUSE_RADIUS ? 0.4 + (1 - mouseDist / MOUSE_RADIUS) * 0.4 : 0.4;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(59, 130, 246, ${glow})`;
                ctx.fill();

                // Draw connections between particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECT_DISTANCE) {
                        const opacity = (1 - dist / CONNECT_DISTANCE) * 0.18;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(draw);
        }

        const heroEl = canvas.parentElement;

        heroEl.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        heroEl.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
            mouse.clicking = false;
        });

        heroEl.addEventListener('mousedown', () => { mouse.clicking = true; });
        heroEl.addEventListener('mouseup', () => { mouse.clicking = false; });

        window.addEventListener('resize', resize);

        resize();
        createParticles();
        draw();
    }
});
