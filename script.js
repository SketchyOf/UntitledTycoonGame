document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const scrollToPosition = targetId ? targetElement.offsetTop - 70 : 0;
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
            slides[0].style.transform = 'translateX(0)';
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
        const transitionDuration = 600;

        function showSlide(newIndex, direction = 'next') {
            if (isAnimating) return;
            isAnimating = true;

            const oldIndex = currentIndex;
            currentIndex = (newIndex + slides.length) % slides.length;

            const oldSlide = slides[oldIndex];
            const newSlide = slides[currentIndex];

            let oldSlideOutClass = '';
            let newSlideInClass = '';

            if (direction === 'next') {
                oldSlideOutClass = 'slide-out-left';
                newSlideInClass = 'slide-in-right';
            } else {
                oldSlideOutClass = 'slide-out-right';
                newSlideInClass = 'slide-in-left';
            }

            if (oldSlide && oldSlide !== newSlide) {
                oldSlide.classList.remove('active');
                oldSlide.classList.add(oldSlideOutClass);
                oldSlide.style.pointerEvents = 'none';
            }

            newSlide.classList.remove('active');
            newSlide.classList.add(newSlideInClass);
            newSlide.style.visibility = 'visible';
            newSlide.style.pointerEvents = 'auto';

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    newSlide.classList.add('active');
                    newSlide.classList.remove(newSlideInClass);
                    newSlide.style.opacity = '1';
                });
            });

            setTimeout(() => {
                if (oldSlide && oldSlide !== newSlide) {
                    oldSlide.classList.remove(oldSlideOutClass);
                    oldSlide.style.opacity = '0';
                    oldSlide.style.visibility = 'hidden';
                    oldSlide.style.transform = '';
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

        showSlide(currentIndex);
    }

    document.querySelectorAll('.coverflow-slider').forEach(slider => {
        initializeSlider(slider);
    });
});
