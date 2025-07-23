document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for fixed navbar height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const faders = document.querySelectorAll('.fade');
    const appearOptions = {
        threshold: 0.2, // Trigger when 20% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Shrink the viewport slightly from the bottom
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                appearOnScroll.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });


    // --- Generic Slider Logic (Now simpler, single-item view) ---
    function initializeSlider(sliderElement) {
        const slides = sliderElement.querySelectorAll('.slide-item');
        const prevBtn = sliderElement.querySelector('.prev-btn');
        const nextBtn = sliderElement.querySelector('.next-btn');
        const dotsContainer = sliderElement.querySelector('.slider-dots');

        if (slides.length === 0) {
            // Hide buttons and dots if no slides
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (dotsContainer) dotsContainer.style.display = 'none';
            return;
        }

        let currentIndex = 0;

        // Create dots
        dotsContainer.innerHTML = ''; // Clear existing dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => showSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        function showSlide(index, direction = 'next') {
            // Ensure index wraps around
            currentIndex = (index + slides.length) % slides.length;

            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                // Immediately hide non-active slides (opacity 0, transform 100% or -100%)
                // This ensures they are ready to slide in from the correct direction if they become active
                if (i !== currentIndex) {
                    slide.style.opacity = '0';
                    slide.style.visibility = 'hidden';
                    slide.style.pointerEvents = 'none';
                    // Set transform to prepare for entry or to hide (off-screen)
                    slide.style.transform = (direction === 'next') ? 'translateX(100%)' : 'translateX(-100%)';
                }
            });

            // Activate the current slide
            const activeSlide = slides[currentIndex];
            activeSlide.classList.add('active');
            activeSlide.style.visibility = 'visible';
            activeSlide.style.pointerEvents = 'auto';
            // Trigger the transition from off-screen to 0
            activeSlide.style.transform = 'translateX(0)';
            activeSlide.style.opacity = '1';

            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showSlide(currentIndex - 1, 'prev');
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showSlide(currentIndex + 1, 'next');
            });
        }

        // Initial display
        showSlide(currentIndex);
    }

    // Initialize all sliders on the page
    document.querySelectorAll('.coverflow-slider').forEach(slider => {
        initializeSlider(slider);
    });
});
