window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');

    if (!dropdown || !button) return;
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');

        if (dropdown && button) {
            dropdown.classList.remove('show');
            button.classList.remove('active');
        }
    }
});

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Autoplay muted experiment videos only while they are visible.
function setupVideoCarouselAutoplay() {
    const experimentVideos = document.querySelectorAll('.video-card:not(.isaac-slide) video, .isaac-slide.is-active video');
    
    if (experimentVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    experimentVideos.forEach(video => {
        observer.observe(video);
    });
}

function setupIsaacCarousel() {
    const carousel = document.querySelector('[data-carousel="isaaclab"]');
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll('.isaac-slide'));
    const previousButton = carousel.querySelector('[data-carousel-prev]');
    const nextButton = carousel.querySelector('[data-carousel-next]');
    const visibleCount = 3;
    let currentIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));

    const setActiveSlide = (nextIndex) => {
        if (slides.length === 0) return;

        currentIndex = (nextIndex + slides.length) % slides.length;
        const activeIndices = new Set(
            Array.from({ length: Math.min(visibleCount, slides.length) }, (_, offset) => {
                return (currentIndex + offset) % slides.length;
            })
        );

        slides.forEach((slide, index) => {
            const video = slide.querySelector('video');
            const isActive = activeIndices.has(index);

            slide.classList.toggle('is-active', isActive);

            if (!video) return;

            if (isActive) {
                video.play().catch(() => {});
            } else {
                video.pause();
                video.currentTime = 0;
            }
        });
    };

    previousButton && previousButton.addEventListener('click', () => setActiveSlide(currentIndex - 1));
    nextButton && nextButton.addEventListener('click', () => setActiveSlide(currentIndex + 1));
    setActiveSlide(currentIndex);
}

document.addEventListener('DOMContentLoaded', function() {
    setupIsaacCarousel();
    setupVideoCarouselAutoplay();
});
