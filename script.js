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


    // --- Generic Slider Logic (with Slide-in/Slide-out animation) ---
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
        if (slides.length === 1) {
            // If only one slide, show it and hide buttons/dots
            slides[0].classList.add('active');
            slides[0].style.opacity = '1';
            slides[0].style.visibility = 'visible';
            slides[0].style.pointerEvents = 'auto';
            slides[0].style.transform = 'translateX(0)';
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (dotsContainer) dotsContainer.style.display = 'none';
            return;
        }


        let currentIndex = 0;
        let isAnimating = false; // Prevent multiple clicks during animation

        // Create dots
        dotsContainer.innerHTML = ''; // Clear existing dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                if (!isAnimating && index !== currentIndex) {
                    const direction = (index > currentIndex) ? 'next' : 'prev';
                    showSlide(index, direction);
                }
            });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');
        const transitionDuration = 600; // Match CSS transition duration

        function showSlide(newIndex, direction = 'next') {
            if (isAnimating) return; // Don't animate if already animating
            isAnimating = true;

            const oldIndex = currentIndex;
            currentIndex = (newIndex + slides.length) % slides.length;

            const oldSlide = slides[oldIndex];
            const newSlide = slides[currentIndex];

            // Determine slide-out direction for the old slide
            let oldSlideOutClass = '';
            let newSlideInClass = '';

            if (direction === 'next') { // New slide comes from right, old slides out left
                oldSlideOutClass = 'slide-out-left';
                newSlideInClass = 'slide-in-right';
            } else { // New slide comes from left, old slides out right
                oldSlideOutClass = 'slide-out-right';
                newSlideInClass = 'slide-in-left';
            }

            // Apply exit animation to old slide
            if (oldSlide && oldSlide !== newSlide) {
                oldSlide.classList.remove('active');
                oldSlide.classList.add(oldSlideOutClass);
                oldSlide.style.pointerEvents = 'none'; // Disable interaction while sliding out
            }

            // Prepare new slide for entry animation (remove active, apply entry class, make visible)
            newSlide.classList.remove('active'); // Ensure no lingering active class
            newSlide.classList.add(newSlideInClass);
            newSlide.style.visibility = 'visible';
            newSlide.style.pointerEvents = 'auto';

            // Force reflow to ensure the initial transform is applied before transition
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    newSlide.classList.add('active'); // Add active class to trigger the transition to transform: translateX(0)
                    newSlide.classList.remove(newSlideInClass); // Remove initial positioning class
                    newSlide.style.opacity = '1'; // Ensure it fades in
                });
            });

            // Clean up old slide after animation
            setTimeout(() => {
                if (oldSlide && oldSlide !== newSlide) {
                    oldSlide.classList.remove(oldSlideOutClass);
                    oldSlide.style.opacity = '0';
                    oldSlide.style.visibility = 'hidden';
                    oldSlide.style.transform = ''; // Reset transform for next use
                }
                isAnimating = false;
            }, transitionDuration);


            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (!isAnimating) {
                    showSlide(currentIndex - 1, 'prev');
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (!isAnimating) {
                    showSlide(currentIndex + 1, 'next');
                }
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
