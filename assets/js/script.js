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
// Top Shelf Picks Slider - Continuous Auto Scroll + Drag
// ====================

const topShelfGrid = document.querySelector(".top-shelf-picks__grid");

if (topShelfGrid) {
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  let hasMoved = false;
  const DRAG_THRESHOLD = 3; // Minimum pixels to move before considering it a drag

  // --- Auto-scroll setup ---
  const CARD_SCROLL_SPEED_PX_PER_SEC = 30; // design spec
  let isHovered = false;
  let lastTimestamp = null;
  let contentWidth = 0;

  // Duplicate cards once so we can loop seamlessly
  const cards = Array.from(topShelfGrid.children);
  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    topShelfGrid.appendChild(clone);
  });

  // After cloning, half of the scrollable width represents one full set
  const updateContentWidth = () => {
    contentWidth = topShelfGrid.scrollWidth / 2;
  };
  updateContentWidth();
  window.addEventListener("resize", updateContentWidth);

  const autoScrollStep = (timestamp) => {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaMs = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    if (!isHovered && !isDragging && contentWidth > 0) {
      const deltaPx = (CARD_SCROLL_SPEED_PX_PER_SEC * deltaMs) / 1000;
      topShelfGrid.scrollLeft += deltaPx;

      // Loop when we've scrolled past one full set of cards
      if (topShelfGrid.scrollLeft >= contentWidth) {
        topShelfGrid.scrollLeft -= contentWidth;
      }
    }

    requestAnimationFrame(autoScrollStep);
  };

  requestAnimationFrame(autoScrollStep);

  topShelfGrid.addEventListener("mouseenter", () => {
    isHovered = true;
  });

  topShelfGrid.addEventListener("mouseleave", () => {
    isHovered = false;
  });

  // --- Wheel scroll sync ---
  topShelfGrid.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      topShelfGrid.scrollLeft += e.deltaY;
    },
    { passive: false }
  );

  const startDrag = (clientX) => {
    isDragging = true;
    hasMoved = false;
    topShelfGrid.classList.add("is-dragging");
    startX = clientX;
    scrollLeft = topShelfGrid.scrollLeft;
  };

  const drag = (clientX) => {
    if (!isDragging) return;

    const deltaX = clientX - startX;
    const scrollDelta = deltaX * 1.2;

    if (Math.abs(scrollDelta) > DRAG_THRESHOLD) {
      hasMoved = true;
    }

    topShelfGrid.scrollLeft = scrollLeft + scrollDelta;

    // keep drag scroll in sync with looping
    if (contentWidth > 0) {
      if (topShelfGrid.scrollLeft < 0) {
        topShelfGrid.scrollLeft += contentWidth;
      } else if (topShelfGrid.scrollLeft >= contentWidth) {
        topShelfGrid.scrollLeft -= contentWidth;
      }
    }
  };

  const endDrag = (e) => {
    if (isDragging && hasMoved && e && e.target) {
      const button = e.target.closest(".top-shelf-picks__button--overlay");
      if (button) {
        e.preventDefault();
        e.stopPropagation();
        const originalOnClick = button.onclick;
        button.onclick = (clickE) => {
          clickE.preventDefault();
          clickE.stopPropagation();
        };
        setTimeout(() => {
          button.onclick = originalOnClick;
        }, 100);
      }
    }
    isDragging = false;
    hasMoved = false;
    topShelfGrid.classList.remove("is-dragging");
  };

  // Mouse events
  topShelfGrid.addEventListener("mousedown", (e) => {
    if (e.target.closest(".top-shelf-picks__button--overlay")) {
      return;
    }
    e.preventDefault();
    startDrag(e.clientX);
  });

  topShelfGrid.addEventListener("mouseleave", (e) => {
    endDrag(e);
  });

  window.addEventListener("mouseup", (e) => {
    if (isDragging) {
      endDrag(e);
    }
  });

  topShelfGrid.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    drag(e.clientX);
  });

  // Touch events for mobile
  topShelfGrid.addEventListener(
    "touchstart",
    (e) => {
      if (e.target.closest(".top-shelf-picks__button--overlay")) {
        return;
      }
      startDrag(e.touches[0].clientX);
    },
    { passive: true }
  );

  topShelfGrid.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      e.preventDefault();
      drag(e.touches[0].clientX);
    },
    { passive: false }
  );

  topShelfGrid.addEventListener("touchend", endDrag);
  topShelfGrid.addEventListener("touchcancel", endDrag);
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

// ====================
// Before / After Results Comparison
// ====================

const resultsComparison = document.querySelector(".results-comparison");

if (resultsComparison) {
  const afterWrapper = resultsComparison.querySelector(
    ".results-comparison__after"
  );
  const divider = resultsComparison.querySelector(
    ".results-comparison__divider"
  );

  let isDragging = false;

  const updatePosition = (clientX) => {
    const rect = resultsComparison.getBoundingClientRect();
    let x = clientX - rect.left;
    let ratio = x / rect.width;

    // clamp between 10% and 90% for better UX
    ratio = Math.max(0.1, Math.min(0.9, ratio));

    const percentage = `${ratio * 100}%`;
    afterWrapper.style.setProperty("--position", percentage);
    divider.style.setProperty("--position", percentage);
  };

  const handlePointerDown = (event) => {
    event.preventDefault();
    isDragging = true;
    const clientX =
      event.touches && event.touches.length
        ? event.touches[0].clientX
        : event.clientX;
    updatePosition(clientX);
  };

  const handlePointerMove = (event) => {
    if (!isDragging) return;
    const clientX =
      event.touches && event.touches.length
        ? event.touches[0].clientX
        : event.clientX;
    updatePosition(clientX);
  };

  const handlePointerUp = () => {
    isDragging = false;
  };

  // Mouse events
  divider.addEventListener("mousedown", handlePointerDown);
  window.addEventListener("mousemove", handlePointerMove);
  window.addEventListener("mouseup", handlePointerUp);

  // Touch events
  divider.addEventListener(
    "touchstart",
    (event) => {
      handlePointerDown(event);
    },
    { passive: false }
  );

  window.addEventListener(
    "touchmove",
    (event) => {
      if (!isDragging) return;
      handlePointerMove(event);
    },
    { passive: false }
  );
  window.addEventListener("touchend", handlePointerUp);

  // Set initial position to 50%
  afterWrapper.style.setProperty("--position", "50%");
  divider.style.setProperty("--position", "50%");
}

// ====================
// Hustle Benefits Accordion
// ====================

(function () {
  var section = document.querySelector("#hustle-benefits");
  if (!section) return;

  var container = section.querySelector("[data-hustle-benefits-accordion]");
  if (!container) return;

  var triggers = Array.prototype.slice.call(
    container.querySelectorAll("[data-hustle-benefits-trigger]")
  );

  if (!triggers.length) return;

  function closeAll(except) {
    triggers.forEach(function (button) {
      if (button === except) return;

      var panelId = button.getAttribute("aria-controls");
      var panel = document.getElementById(panelId);
      if (!panel) return;

      button.setAttribute("aria-expanded", "false");
      panel.setAttribute("hidden", "hidden");
      panel.classList.remove("is-open");
    });
  }

  triggers.forEach(function (button) {
    button.addEventListener("click", function () {
      var isExpanded = button.getAttribute("aria-expanded") === "true";
      var panelId = button.getAttribute("aria-controls");
      var panel = document.getElementById(panelId);
      if (!panel) return;

      if (isExpanded) {
        button.setAttribute("aria-expanded", "false");
        panel.setAttribute("hidden", "hidden");
        panel.classList.remove("is-open");
      } else {
        closeAll(button);
        button.setAttribute("aria-expanded", "true");
        panel.removeAttribute("hidden");
        panel.classList.add("is-open");
      }
    });

    button.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        button.click();
      }
    });
  });
})();