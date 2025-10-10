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
                // New text format without "Listening..."
                nowPlayingElement.textContent = `${playlist[currentTrack]}`;
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
// --- Scroll Animation Logic (Intersection Observer) ---
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        root: null, // use the viewport as the container
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If element is visible, add the class to start the animation
                entry.target.classList.add('animate-visible');
                // Stop observing once it has animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Target all elements with the 'scroll-animate' class
    const elementsToAnimate = document.querySelectorAll('.scroll-animate');
    
    elementsToAnimate.forEach(element => {
        // Skip the header and hero sections as they are visible on load
        if (element.id === 'global-header' || element.id === 'hero') {
             // For elements visible on load, just add the class immediately
             element.classList.add('animate-visible');
             return; // Move to the next element
        }

        // For all other sections, observe them for scroll visibility
        observer.observe(element);
    });
});
// --- END SCROLL ANIMATION LOGIC ---

// --- Dynamic Equalizer Animation Logic ---
document.addEventListener('DOMContentLoaded', function () {
    // Array of all equalizer container IDs
    const equalizerIds = [
        'live-equalizer-project',
        'live-equalizer-exp',
        'live-equalizer-umr',
        'live-equalizer-player'
    ];

    // Function to generate a new, random height (5px to 30px, max container height is 30px)
    const getRandomHeight = () => (5 + Math.random() * 25).toFixed(0) + 'px';

    // Function to animate a single bar's height over a random duration
    function animateBar(bar) {
        // Random duration between 500ms and 1000ms (Faster as requested)
        const duration = 500 + Math.random() * 500; 
        // Target a new random height
        const newHeight = getRandomHeight();
        
        // Use CSS Transition property to smoothly change height
        bar.style.transition = `height ${duration}ms ease-in-out`;
        bar.style.height = newHeight;

        // Set a timer to animate it again slightly before the current transition finishes (60% duration).
        // This continuous, asynchronous randomization makes the loop seamless and unpredictable.
        setTimeout(() => {
            animateBar(bar);
        }, duration * 0.6); 
    }

    // Initialize animation for all Equalizer instances
    equalizerIds.forEach(id => {
        const equalizer = document.getElementById(id);
        if (equalizer) {
            const bars = equalizer.querySelectorAll('.bar');
            bars.forEach(bar => {
                // Remove initial CSS-based animation if any
                bar.style.animation = 'none'; 
                // Set an immediate random height to start the animation gracefully
                bar.style.height = getRandomHeight();
                // Start the JavaScript-controlled, perpetual animation loop
                animateBar(bar);
            });
        }
    });
});
// --- END DYNAMIC EQUALIZER LOGIC ---

// --- Scroll Progress Bar (Media Player) Logic ---
document.addEventListener('DOMContentLoaded', function () {
    const scrollProgress = document.getElementById('scroll-progress');

    // Function to calculate and update the scroll progress
    function updateScrollProgress() {
        if (scrollProgress) {
            // Calculate the total scrollable height of the document
            const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            // Get the current scroll position using the more reliable window.scrollY
            const scrolled = window.scrollY;

            // Calculate percentage (handle division by zero if totalHeight is 0)
            const percentage = totalHeight > 0 ? (scrolled / totalHeight) * 100 : 0;
            
            // Apply the percentage to the progress bar width
            scrollProgress.style.width = `${percentage}%`;
        }
    }

    // Attach the scroll listener to the window
    window.addEventListener('scroll', updateScrollProgress);
    
    // Run once on load to initialize the bar position
    updateScrollProgress();
});
// --- END SCROLL PROGRESS BAR LOGIC ---

// --- Media Player Section Navigation ---
document.addEventListener('DOMContentLoaded', function () {
    const nextButton = document.getElementById('next-section-btn');
    const prevButton = document.getElementById('prev-section-btn');

    // Get all sections you want to navigate between
    const sections = document.querySelectorAll('section.code-section');

    const getVisibleSectionIndex = () => {
        let smallestVisibleTop = Infinity;
        let currentSectionIndex = -1;

        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            // Check if the section is at all visible in the viewport
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                // Find the section closest to the top of the viewport
                if (rect.top >= 0 && rect.top < smallestVisibleTop) {
                    smallestVisibleTop = rect.top;
                    currentSectionIndex = index;
                }
            }
        });
        // If no section top is in view (e.g., scrolled halfway), find the one currently in the middle
        if (currentSectionIndex === -1) {
             sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                 if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                    currentSectionIndex = index;
                }
             });
        }
        return currentSectionIndex;
    };

    if(nextButton) {
        nextButton.addEventListener('click', () => {
            let currentIndex = getVisibleSectionIndex();
            let nextIndex = currentIndex + 1;
            if (nextIndex < sections.length) {
                sections[nextIndex].scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    if(prevButton) {
        prevButton.addEventListener('click', () => {
            let currentIndex = getVisibleSectionIndex();
            let prevIndex = currentIndex - 1;
            if (prevIndex >= 0) {
                sections[prevIndex].scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});