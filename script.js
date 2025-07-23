document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Adjust scroll position for fixed navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const scrollToPosition = targetId ? targetElement.offsetTop - navbarHeight : 0;

                window.scrollTo({
                    top: scrollToPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const faders = document.querySelectorAll('.fade');

    const appearOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    function initializeSlider(sliderElement) {
        const slides = sliderElement.querySelectorAll('.slide-item');
        const prevBtn = sliderElement.querySelector('.prev-btn');
        const nextBtn = sliderElement.querySelector('.next-btn');
        const dotsContainer = sliderElement.querySelector('.slider-dots');

        if (slides.length === 0) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (dotsContainer) dotsContainer.style.display = 'none';
            return;
        }
        if (slides.length === 1) {
            slides[0].classList.add('active');
            slides[0].style.opacity = '1';
            slides[0].style.visibility = 'visible';
            slides[0].style.pointerEvents = 'auto';
            slides[0].style.transform = 'translateX(0)'; // Ensure single slide is not transformed
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (dotsContainer) dotsContainer.style.display = 'none';
            return;
        }

        let currentIndex = 0;
        let isAnimating = false;

        dotsContainer.innerHTML = '';
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
            if (isAnimating) return;
            isAnimating = true;

            const oldIndex = currentIndex;
            currentIndex = (newIndex + slides.length) % slides.length;

            const oldSlide = slides[oldIndex];
            const newSlide = slides[currentIndex];

            // Determine if the screen is mobile or desktop
            const isMobile = window.matchMedia("(max-width: 768px)").matches;

            // Only apply complex transformations on desktop
            let oldSlideOutClass = '';
            let newSlideInClass = '';

            if (!isMobile) {
                if (direction === 'next') {
                    oldSlideOutClass = 'slide-out-left';
                    newSlideInClass = 'slide-in-right';
                } else {
                    oldSlideOutClass = 'slide-out-right';
                    newSlideInClass = 'slide-in-left';
                }
            }

            if (oldSlide && oldSlide !== newSlide) {
                oldSlide.classList.remove('active');
                if (oldSlideOutClass) oldSlide.classList.add(oldSlideOutClass);
                oldSlide.style.pointerEvents = 'none';
            }

            newSlide.classList.remove('active');
            if (newSlideInClass) newSlide.classList.add(newSlideInClass);
            newSlide.style.visibility = 'visible';
            newSlide.style.pointerEvents = 'auto';

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    newSlide.classList.add('active');
                    if (newSlideInClass) newSlide.classList.remove(newSlideInClass);
                    newSlide.style.opacity = '1';
                    // Ensure the new slide is correctly positioned based on desktop/mobile
                    if (!isMobile) {
                        newSlide.style.transform = 'translateX(0)';
                    } else {
                        newSlide.style.transform = 'translateX(-50%)'; // For centered mobile slides
                    }
                });
            });

            // Adjust the timeout for desktop vs mobile transitions if desired,
            // but generally, CSS transition handles the timing.
            setTimeout(() => {
                if (oldSlide && oldSlide !== newSlide) {
                    if (oldSlideOutClass) oldSlide.classList.remove(oldSlideOutClass);
                    oldSlide.style.opacity = '0';
                    oldSlide.style.visibility = 'hidden';
                    oldSlide.style.transform = ''; // Reset transform on hidden slide
                }
                isAnimating = false;
            }, transitionDuration);

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

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

        // Initial slide display
        showSlide(currentIndex);

        // Optional: Re-initialize slider on window resize to apply correct mobile/desktop styles
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Remove all slide animation classes and reset for re-calculation
                slides.forEach(slide => {
                    slide.classList.remove('active', 'slide-in-right', 'slide-in-left', 'slide-out-left', 'slide-out-right');
                    slide.style.opacity = '0';
                    slide.style.visibility = 'hidden';
                    slide.style.pointerEvents = 'none';
                    slide.style.transform = '';
                });
                // Re-show the current slide to apply correct styling based on new screen size
                showSlide(currentIndex);
            }, 200); // Debounce to prevent excessive calls
        });
    }

    document.querySelectorAll('.coverflow-slider').forEach(slider => {
        initializeSlider(slider);
    });
});
