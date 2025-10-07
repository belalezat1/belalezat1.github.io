// script.js
document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const toggleButton = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (toggleButton && mobileMenu) {
        toggleButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }

    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // "Now Playing" feature
    const nowPlayingElement = document.getElementById('now-playing');
    const playlist = [
        "Python & FastAPI",
        "React.js Development",
        "Cloud Engineering on AWS",
        "Linux System Administration",
        "Docker & Containerization"
    ];
    let currentTrack = 0;

    if (nowPlayingElement) {
        setInterval(() => {
            currentTrack = (currentTrack + 1) % playlist.length;
            nowPlayingElement.style.opacity = 0; // Fade out
            setTimeout(() => {
                nowPlayingElement.textContent = playlist[currentTrack];
                nowPlayingElement.style.opacity = 1; // Fade in
            }, 500); // Wait for fade out to complete
        }, 3000); // Change track every 3 seconds
    }
});