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
        'live-equalizer-umr'
    ];

    // Function to generate a new, random height (5px to 30px, max container height is 30px)
    const getRandomHeight = () => (5 + Math.random() * 25).toFixed(0) + 'px';

    // Function to animate a single bar's height over a random duration
    function animateBar(bar) {
        // Random duration between 500ms and 1000ms
        const duration = 500 + Math.random() * 500; 
        // Target a new random height
        const newHeight = getRandomHeight();
        
        // Use CSS Transition property to smoothly change height
        bar.style.transition = `height ${duration}ms ease-in-out`;
        bar.style.height = newHeight;

        // Set a timer to animate it again slightly before the current transition finishes
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

// --- NEW: Project Filtering and Sorting Logic ---
document.addEventListener('DOMContentLoaded', function () {
    const filterButtonsContainer = document.getElementById('filter-buttons');
    const portfolioGrid = document.getElementById('portfolio-grid');

    // Stop if the necessary elements don't exist
    if (!filterButtonsContainer || !portfolioGrid) {
        return;
    }

    const projects = Array.from(portfolioGrid.querySelectorAll('.project-card'));

    /**
     * Sorts the project cards in the DOM based on their data-date attribute.
     * Sorts in descending order (newest first).
     */
    const sortByDate = () => {
        // Create a sorted copy of the projects array
        const sortedProjects = [...projects].sort((a, b) => {
            return new Date(b.dataset.date) - new Date(a.dataset.date);
        });
        
        // Re-append the sorted projects to the grid container
        sortedProjects.forEach(project => portfolioGrid.appendChild(project));
    };

    /**
     * Filters projects by showing/hiding them based on a category.
     * @param {string} category - The category to filter by (e.g., 'full-stack').
     */
    const filterProjects = (category) => {
        projects.forEach(project => {
            const projectCategories = project.dataset.category ? project.dataset.category.split(' ') : [];
            const matchesCategory = projectCategories.includes(category);

            // If the category is 'all' or the project matches the category, show it. Otherwise, hide it.
            if (category === 'all' || matchesCategory) {
                project.classList.remove('hidden');
            } else {
                project.classList.add('hidden');
            }
        });
    };

    // Add a single event listener to the button container for efficiency
    filterButtonsContainer.addEventListener('click', (e) => {
        // Target only button clicks
        const button = e.target.closest('button[data-filter]');
        if (!button) return;

        const filter = button.dataset.filter;

        // Update active class on buttons
        const allButtons = filterButtonsContainer.querySelectorAll('.filter-btn');
        allButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Execute sorting or filtering based on the button clicked
        if (filter === 'most-recent') {
            sortByDate();
            // Ensure all projects are visible after sorting
            projects.forEach(project => project.classList.remove('hidden'));
        } else {
            filterProjects(filter);
        }
    });

    // --- Initial Page Load Setup ---
    // Set the 'Most Recent' button as active by default
    const mostRecentBtn = filterButtonsContainer.querySelector('[data-filter="most-recent"]');
    if (mostRecentBtn) {
        mostRecentBtn.classList.add('active');
    }
    // Initially sort by date and show all projects
    sortByDate();
    projects.forEach(project => project.classList.remove('hidden'));
});
// --- END PROJECT FILTERING LOGIC ---