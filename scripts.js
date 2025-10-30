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

    // --- "Now Playing" Feature ---
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
            "Version Control with Git"
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

    // --- Project Modal Logic ---
    document.querySelectorAll('[data-modal-target]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modal = document.getElementById(trigger.getAttribute('data-modal-target'));
            if (modal) {
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    document.querySelectorAll('[data-modal-close]').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal-container');
            if (modal) {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    });

    document.querySelectorAll('.modal-container').forEach(overlay => {
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                overlay.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    });

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

    // --- Dynamic Equalizer Animation Logic ---
    const equalizerIds = ['live-equalizer-project', 'live-equalizer-exp', 'live-equalizer-umr'];
    const getRandomHeight = () => `${5 + Math.random() * 25}px`;

    function animateBar(bar) {
        const duration = 500 + Math.random() * 500;
        bar.style.transition = `height ${duration}ms ease-in-out`;
        bar.style.height = getRandomHeight();
        setTimeout(() => animateBar(bar), duration * 0.8);
    }

    equalizerIds.forEach(id => {
        const equalizer = document.getElementById(id);
        if (equalizer) {
            equalizer.querySelectorAll('.bar').forEach(bar => {
                bar.style.animation = 'none';
                animateBar(bar);
            });
        }
    });

    // --- Project Filtering and Sorting Logic ---
    const filterButtonsContainer = document.getElementById('filter-buttons');
    const portfolioGrid = document.getElementById('portfolio-grid');

    if (filterButtonsContainer && portfolioGrid) {
        const projects = Array.from(portfolioGrid.querySelectorAll('.project-card'));

        const sortByDate = () => {
            const sortedProjects = [...projects].sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date));
            sortedProjects.forEach(project => portfolioGrid.appendChild(project));
        };

        const filterProjects = (category) => {
            projects.forEach(project => {
                const projectCategories = project.dataset.category ? project.dataset.category.split(' ') : [];
                const isVisible = category === 'all' || projectCategories.includes(category);
                project.classList.toggle('hidden', !isVisible);
            });
        };

        filterButtonsContainer.addEventListener('click', (e) => {
            const button = e.target.closest('button[data-filter]');
            if (!button) return;

            const filter = button.dataset.filter;
            filterButtonsContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            if (filter === 'most-recent') {
                sortByDate();
                projects.forEach(project => project.classList.remove('hidden'));
            } else {
                filterProjects(filter);
            }
        });
        
        // Initial setup on page load
        const mostRecentBtn = filterButtonsContainer.querySelector('[data-filter="most-recent"]');
        if (mostRecentBtn) {
            mostRecentBtn.classList.add('active');
        }
        sortByDate();
    }
});