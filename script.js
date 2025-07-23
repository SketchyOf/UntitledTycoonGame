// General Fade Animation (existing)
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    } else {
      // Optional: remove 'visible' class if you want elements to re-fade on scroll back up
      // entry.target.classList.remove("visible");
    }
  });
}, {
  threshold: 0.1 // Trigger when 10% of the element is visible
});

document.querySelectorAll(".fade").forEach((el) => observer.observe(el));


// --- Generic Coverflow Slider Logic ---

class CoverflowSlider {
  constructor(containerSelector, slidesData) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) {
      console.error(`Slider container not found for selector: ${containerSelector}`);
      return;
    }
    this.sliderTrack = this.container.querySelector('.slider-track');
    this.slides = Array.from(this.sliderTrack.children); // Get actual slide elements from HTML
    this.prevButton = this.container.querySelector('.prev-btn');
    this.nextButton = this.container.querySelector('.next-btn');
    this.dotsContainer = this.container.querySelector('.slider-dots');
    this.currentSlideIndex = 0;
    this.slidesData = slidesData; // Store the data for populating content if needed (for info slider)

    this.init();
  }

  init() {
    if (!this.container) return; // Exit if container wasn't found

    this.createDots();
    this.updateDotActiveState();
    this.setupEventListeners();
    this.updateSliderTransforms(); // Initial positioning
    
    // Set initial content for info slider if it has data
    if (this.slidesData && this.slidesData.length > 0 && this.container.id === 'info') {
        this.updateInfoContent(this.currentSlideIndex);
    }
    
    // Add click listener to slide items for direct selection
    this.slides.forEach(slide => {
        slide.addEventListener('click', (e) => {
            const clickedIndex = parseInt(slide.dataset.slideIndex);
            if (clickedIndex !== this.currentSlideIndex) {
                this.showSlide(clickedIndex);
            }
        });
    });
  }

  createDots() {
    this.dotsContainer.innerHTML = '';
    this.slides.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.dataset.slide = index;
      dot.addEventListener('click', () => this.showSlide(index));
      this.dotsContainer.appendChild(dot);
    });
    this.allDots = this.container.querySelectorAll('.slider-dots .dot');
  }

  updateDotActiveState() {
    this.allDots.forEach((dot, index) => {
      if (index === this.currentSlideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  updateSliderTransforms() {
    const slideWidth = this.slides[0].offsetWidth; // Get computed width of a slide item
    const containerWidth = this.container.offsetWidth;

    this.slides.forEach((slide, index) => {
      const offset = index - this.currentSlideIndex;
      let transformValue = '';
      let opacity = 1;
      let brightness = 1;
      let zIndex = 1;

      // Base transform to center the track
      // This centers the track, then individual slides are translated relative to this
      const trackTranslateX = -this.currentSlideIndex * (slideWidth + 30); // 30px is example gap/offset
      this.sliderTrack.style.transform = `translateX(-50%) translateX(${trackTranslateX}px)`;


      if (offset === 0) { // Active slide
        transformValue = 'scale(1)';
        opacity = 1;
        brightness = 1;
        zIndex = 10;
        slide.classList.add('active');
        slide.classList.remove('side-left', 'side-right');
        slide.style.pointerEvents = 'auto'; // Ensure active is clickable
      } else if (offset === -1 || (offset === this.slides.length -1 && this.currentSlideIndex === 0)) { // Left side (previous) or wrap-around from last to first
        transformValue = `translateX(-${slideWidth * 0.5}px) scale(0.8) rotateY(15deg) translateZ(-50px)`; // Adjust these values
        opacity = 0.5;
        brightness = 0.6;
        zIndex = 9;
        slide.classList.remove('active', 'side-right');
        slide.classList.add('side-left');
        slide.style.pointerEvents = 'auto'; // Still clickable to navigate
      } else if (offset === 1 || (offset === -(this.slides.length -1) && this.currentSlideIndex === this.slides.length -1)) { // Right side (next) or wrap-around from first to last
        transformValue = `translateX(${slideWidth * 0.5}px) scale(0.8) rotateY(-15deg) translateZ(-50px)`; // Adjust these values
        opacity = 0.5;
        brightness = 0.6;
        zIndex = 9;
        slide.classList.remove('active', 'side-left');
        slide.classList.add('side-right');
        slide.style.pointerEvents = 'auto'; // Still clickable to navigate
      } else { // Far away slides (hidden)
        transformValue = `scale(0.6) translateX(${offset * (slideWidth * 0.6)}px) rotateY(${offset > 0 ? -25 : 25}deg) translateZ(-100px)`; // Push far away
        opacity = 0;
        brightness = 0.3;
        zIndex = 0;
        slide.classList.remove('active', 'side-left', 'side-right');
        slide.style.pointerEvents = 'none'; // Not clickable when far away
      }

      // Individual slide positioning relative to its initial flex position
      // The translateX values here need to be re-evaluated based on the exact overlap desired.
      // For a true coverflow, they are often percentage based or carefully calculated.
      // For now, let's keep it simple relative to the offset.
      slide.style.transform = `translateX(${offset * (slideWidth * 0.6)}px) ${transformValue}`; // Example offset based on slide width

      slide.style.opacity = opacity;
      slide.style.filter = `brightness(${brightness})`;
      slide.style.zIndex = zIndex;

      // Adjusting position for coverflow visualization on different screen sizes
      // This part might need further fine-tuning in CSS media queries
      if (window.innerWidth < 768) { // Mobile adjustments
         // Simplified coverflow for smaller screens
         if (offset === 0) {
             slide.style.transform = `translateX(0) scale(1)`;
         } else if (offset === -1 || (offset === this.slides.length -1 && this.currentSlideIndex === 0)) {
             slide.style.transform = `translateX(-${slideWidth * 0.7}px) scale(0.85)`; // More overlap
         } else if (offset === 1 || (offset === -(this.slides.length -1) && this.currentSlideIndex === this.slides.length -1)) {
             slide.style.transform = `translateX(${slideWidth * 0.7}px) scale(0.85)`; // More overlap
         } else {
             slide.style.transform = `scale(0.6) translateX(${offset * (slideWidth * 0.5)}px)`;
         }
      }
    });

    // To ensure correct centering after transforms, reposition the track
    // This part is crucial and tricky: the track's translate needs to counteract the active item's position
    // and the item's own width to keep the active item visually centered.
    // Given the complexity of precise coverflow math with multiple transforms,
    // a simpler flex-based centering with controlled absolute positioning might be more robust.
    // For now, the `translateX(-50%)` on the track and `position: absolute` on items
    // combined with the offset logic will provide a "look-alike" coverflow.
  }

  updateInfoContent(index) {
    if (this.container.id === 'info') {
      const activeSlideData = this.slidesData[index];
      const activeSlideElement = this.slides[index];
      
      activeSlideElement.querySelector('h3').textContent = activeSlideData.title;
      activeSlideElement.querySelector('p').textContent = activeSlideData.description;
      activeSlideElement.querySelector('img').src = activeSlideData.image; // Update image src
    }
  }


  showSlide(index) {
    if (index < 0) {
      index = this.slides.length - 1;
    } else if (index >= this.slides.length) {
      index = 0;
    }
    this.currentSlideIndex = index;

    this.updateDotActiveState();
    this.updateSliderTransforms();

    // Update content for info slider
    if (this.slidesData && this.slidesData.length > 0 && this.container.id === 'info') {
        this.updateInfoContent(this.currentSlideIndex);
    }
  }

  nextSlide() {
    this.showSlide(this.currentSlideIndex + 1);
  }

  prevSlide() {
    this.showSlide(this.currentSlideIndex - 1);
  }

  setupEventListeners() {
    this.prevButton.addEventListener('click', () => this.prevSlide());
    this.nextButton.addEventListener('click', () => this.nextSlide());
  }
}

// --- Initialize Sliders ---

// Info Slider Data (same as before)
const infoSlidesData = [
    {
        image: 'assets/screenshots/img1.jpg',
        title: 'Build Your Empire',
        description: 'Start from humble beginnings and grow your base into a massive, automated production powerhouse. Collect resources, upgrade your machinery, and expand your territory.'
    },
    {
        image: 'assets/screenshots/img2.jpg',
        title: 'Mine for Riches',
        description: 'Delve deep into the earth to discover rare ores and precious gems. Unlock advanced mining drills and forge powerful tools to maximize your yield.'
    },
    {
        image: 'assets/screenshots/img3.jpg',
        title: 'Harvest & Prosper',
        description: 'Cultivate vast fields, grow unique crops, and manage your farms. Turn your harvests into valuable goods that can be sold for profit or used in crafting.'
    },
    {
        image: 'assets:screenshots/img4.jpg',
        title: 'Endless Customization',
        description: 'Personalize your tycoon base with a wide array of decorations, buildings, and unique structures. Design a layout that\'s both efficient and visually stunning.'
    }
];

// Initialize the Info slider
const infoSlider = new CoverflowSlider('.info-slider', infoSlidesData);

// Trailer Slider Data (not explicitly needed by JS, but for structure clarity)
// The HTML already contains the iframe embeds, so JS just manages their display.
const trailerSlidesData = [
    // This array is not strictly used by JS for content, but for total slide count
    // to match HTML slide-item count.
    {}, {}, {} // Placeholders for 3 trailer videos in HTML
];

// Initialize the Trailer slider
const trailerSlider = new CoverflowSlider('.trailer-slider', trailerSlidesData);


// Initial update for info slider content (ensure first slide content is set)
// No longer needed due to updateInfoContent being called in init
// infoSlider.updateInfoContent(0);
