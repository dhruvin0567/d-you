const slides = document.querySelectorAll(
  ".testimonial-carousel__slide-wrapper"
);
const dots = document.querySelectorAll(".testimonial-carousel__progress-dot");
const quotes = document.querySelectorAll(".testimonial-carousel__quote");
const names = document.querySelectorAll(".testimonial-carousel__attribution");
let currentIndex = 0;
const autoplay = false;
const autoplaySpeed = 4000;

// ====================
// Testimonial Slider
// ====================

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
  currentIndex = index;
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
  });
});

// Change slide when clicking on the text (quote or name)
function showNextSlide() {
  const nextIndex = (currentIndex + 1) % slides.length;
  showSlide(nextIndex);
}

quotes.forEach((quote) => {
  quote.addEventListener("click", showNextSlide);
});

names.forEach((nameEl) => {
  nameEl.addEventListener("click", showNextSlide);
});

if (autoplay) {
  setInterval(() => {
    const nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex);
  }, autoplaySpeed);
}

// Reviews Section - Show More functionality
function handleShowMore(e) {
  e.preventDefault();
  const link = e.target;
  const reviewText = link.parentElement;
  const fullText =
    "I absolutely love this serum! It's one of the very few products I've actually repurchased, and that alone says a lot. From the first use, my skin just drank it in. Over time, it has genuinely transformed my acne-prone skin. My breakouts are less frequent, my texture looks smoother, and my overall complexion has improved significantly. The serum absorbs quickly without leaving any sticky residue, and it works beautifully under makeup. Highly recommend!";
  const shortText =
    "I absolutely love this serum! It's one of the very few products I've actually repurchased, and that alone says a lot. From the first use, my skin just drank it in. Over time, it has genuinely transformed my acne-prone skin. My breakouts are less frequent, my texture looks sm...";

  if (link.textContent === "Show More") {
    reviewText.innerHTML =
      fullText +
      ' <button class="show-more-link">Show Less</button>';
    const newLink = reviewText.querySelector(".show-more-link");
    newLink.addEventListener("click", handleShowMore);
  } else {
    reviewText.innerHTML =
      shortText +
      ' <button class="show-more-link">Show More</button>';
    const newLink = reviewText.querySelector(".show-more-link");
    newLink.addEventListener("click", handleShowMore);
  }
}

// Attach event listeners to all show more links
const showMoreLinks = document.querySelectorAll(".show-more-link");
showMoreLinks.forEach((link) => {
  link.addEventListener("click", handleShowMore);
});

// ====================
// Top Shelf Picks Slider (mouse scroll + drag, no buttons)
// ====================

const topShelfGrid = document.querySelector(".top-shelf-picks__grid");

if (topShelfGrid) {
  // Scroll horizontally with mouse wheel while hovering over the slider
  topShelfGrid.addEventListener(
    "wheel",
    (e) => {
      // Prevent the page from scrolling vertically when over the slider
      e.preventDefault();
      topShelfGrid.scrollLeft += e.deltaY;
    },
    { passive: false }
  );

  // Click + drag to scroll
  let isDown = false;
  let startX;
  let scrollLeftStart;

  topShelfGrid.addEventListener("mousedown", (e) => {
    isDown = true;
    topShelfGrid.classList.add("is-dragging");
    startX = e.pageX - topShelfGrid.offsetLeft;
    scrollLeftStart = topShelfGrid.scrollLeft;
  });

  topShelfGrid.addEventListener("mouseleave", () => {
    isDown = false;
    topShelfGrid.classList.remove("is-dragging");
  });

  window.addEventListener("mouseup", () => {
    isDown = false;
    topShelfGrid.classList.remove("is-dragging");
  });

  topShelfGrid.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - topShelfGrid.offsetLeft;
    const walk = (x - startX) * 1.2;
    topShelfGrid.scrollLeft = scrollLeftStart - walk;
  });
}

// ====================
// Lineup AM / PM Toggle
// ====================

const lineupToggleButtons = document.querySelectorAll(".lineup__toggle-btn");
const lineupContents = document.querySelectorAll(".lineup__content");

if (lineupToggleButtons.length && lineupContents.length) {
  lineupToggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const period = btn.dataset.period;

      // button active state
      lineupToggleButtons.forEach((button) => {
        button.classList.toggle(
          "lineup__toggle-btn--active",
          button === btn
        );
      });

      // content switching with animation
      lineupContents.forEach((content) => {
        const isActive = content.dataset.period === period;
        content.classList.toggle("lineup__content--active", isActive);
      });
    });
  });
}