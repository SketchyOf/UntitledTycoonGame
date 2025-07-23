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
    // This part is crucial for the info slider as its content is managed by JS data
    if (this.slidesData && this.slidesData.length > 0 && this.container.classList.contains('info-slider')) {
        this.updateSlideContent(0); // Update the very first slide's content
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

  // Updates content for the Info slider ONLY (as trailer content is in HTML)
  updateSlideContent(index) {
    if (this.container.classList.contains('info-slider') && this.slidesData[index]) {
      const currentSlideElement = this.slides[index];
      const data = this.slidesData[index];

      const imgElement = currentSlideElement.querySelector('img');
      const h3Element = currentSlideElement.querySelector('h3');
      const pElement = currentSlideElement.querySelector('p');

      if (imgElement) imgElement.src = data.image;
      if (h3Element) h3Element.textContent = data.title;
      if (pElement) pElement.textContent = data.description;
    }
  }


  updateSliderTransforms() {
    this.slides.forEach((slide, index) => {
      // Calculate effective offset, considering wrap-around for visual effect
      let offset = index - this.currentSlideIndex;

      // Adjust offset for seamless wrap-around visually (e.g., last item looks like it's before first)
      if (offset > this.slides.length / 2) {
        offset -= this.slides.length;
      } else if (offset < -this.slides.length / 2) {
        offset += this.slides.length;
      }

      // Base classes for styling
      slide.classList.remove('active', 'side-left', 'side-right');
      slide.style.pointerEvents = 'none'; // Default to non-clickable

      if (offset === 0) {
        slide.classList.add('active');
        slide.style.pointerEvents = 'auto'; // Active slide is clickable
      } else if (offset === -1) {
        slide.classList.add('side-left');
        slide.style.pointerEvents = 'auto'; // Side slides are clickable for navigation
      } else if (offset === 1) {
        slide.classList.add('side-right');
        slide.style.pointerEvents = 'auto'; // Side slides are clickable for navigation
      }
      // CSS handles the actual transform properties via these classes
    });
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
    if (this.container.classList.contains('info-slider')) {
        this.updateSlideContent(this.currentSlideIndex);
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

// Info Slider Data
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
        image: 'assets/screenshots/img4.jpg',
        title: 'Endless Customization',
        description: 'Personalize your tycoon base with a wide array of decorations, buildings, and unique structures. Design a layout that\'s both efficient and visually stunning.'
    }
];

// Initialize the Info slider
const infoSlider = new CoverflowSlider('.info-slider', infoSlidesData);

// Trailer Slider Data (not explicitly needed by JS for content, but for total slide count)
// Make sure this array has the same number of items as your .slide-item divs in HTML for the trailer slider.
// If you add or remove trailers in HTML, update this array's length.
const trailerSlidesData = [
    {}, {}, {}, {} // Placeholders for 4 trailer videos in HTML
];

// Initialize the Trailer slider
const trailerSlider = new CoverflowSlider('.trailer-slider', trailerSlidesData);
