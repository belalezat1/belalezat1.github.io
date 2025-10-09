// scripts.js
document.addEventListener('DOMContentLoaded', function () {
    // --- Mobile Menu Logic ---
    const toggleButton = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (toggleButton && mobileMenu) {
        toggleButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });

        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
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
            nowPlayingElement.style.opacity = 0; // Fade out
            setTimeout(() => {
                nowPlayingElement.textContent = playlist[currentTrack];
                nowPlayingElement.style.opacity = 1; // Fade in
            }, 500); // Wait for fade out to complete
        }, 3000); // Change track every 3 seconds
    }

    // --- Project Modal Logic ---
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });

    const closeModalButtons = document.querySelectorAll('[data-modal-close]');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal-container');
            if (modal) {
                modal.classList.add('hidden');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    });

    // Close modal when clicking on the overlay
    const modalOverlays = document.querySelectorAll('.modal-container');
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                overlay.classList.add('hidden');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    });
});