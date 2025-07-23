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


// --- Interactive Screenshot Slider Logic ---
const slides = [
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

let currentSlideIndex = 0;

const sliderImage = document.getElementById('slider-image');
const sliderTitle = document.getElementById('slider-title');
const sliderDescription = document.getElementById('slider-description');
const prevButton = document.getElementById('prev-slide');
const nextButton = document.getElementById('next-slide');
const dotsContainer = document.querySelector('.slider-dots');

// Create dots dynamically
slides.forEach((_, index) => {
  const dot = document.createElement('span');
  dot.classList.add('dot');
  if (index === 0) dot.classList.add('active');
  dot.dataset.slide = index;
  dot.addEventListener('click', () => showSlide(index));
  dotsContainer.appendChild(dot);
});

const allDots = document.querySelectorAll('.slider-dots .dot');

function updateDotActiveState() {
  allDots.forEach((dot, index) => {
    if (index === currentSlideIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

function showSlide(index) {
  if (index < 0) {
    index = slides.length - 1;
  } else if (index >= slides.length) {
    index = 0;
  }
  currentSlideIndex = index;

  // Add fade-out class to current elements
  sliderImage.classList.remove('visible'); // For re-triggering animation if needed
  sliderTitle.classList.remove('visible');
  sliderDescription.classList.remove('visible');

  // Use a small delay to allow fade-out effect before new content appears
  setTimeout(() => {
    sliderImage.src = slides[currentSlideIndex].image;
    sliderTitle.textContent = slides[currentSlideIndex].title;
    sliderDescription.textContent = slides[currentSlideIndex].description;

    // Trigger fade-in for new content
    sliderImage.classList.add('visible');
    sliderTitle.classList.add('visible');
    sliderDescription.classList.add('visible');

    updateDotActiveState();
  }, 300); // Match or be slightly less than CSS transition time
}

function nextSlide() {
  showSlide(currentSlideIndex + 1);
}

function prevSlide() {
  showSlide(currentSlideIndex - 1);
}

// Event Listeners for navigation
prevButton.addEventListener('click', prevSlide);
nextButton.addEventListener('click', nextSlide);

// Initialize slider
showSlide(currentSlideIndex);

// Optional: Auto-play slider
// setInterval(nextSlide, 7000); // Change slide every 7 seconds
