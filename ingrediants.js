document.addEventListener("DOMContentLoaded", function () {
  const swiper = new Swiper(".ingredients-swiper", {
    centeredSlides: true,
    slidesPerView: 1.2,
    spaceBetween: 12,
    // Slow transition speed for smooth, slow movement
    speed: 5000,
    // Smooth easing function for elegant transitions
    freeMode: false,
    allowTouchMove: true,
    simulateTouch: true,
    grabCursor: true,
    touchRatio: 1,
    touchAngle: 45,
    threshold: 5,
    // Responsive breakpoints for all screen sizes
    breakpoints: {
      // Extra small devices (phones, 320px and up)
      320: {
        slidesPerView: 1.2,
        spaceBetween: 12,
      },
      // Small devices (landscape phones, 480px and up)
      480: {
        slidesPerView: 1.5,
        spaceBetween: 14,
      },
      // Medium devices (tablets, 768px and up) - Mobile-like behavior
      768: {
        slidesPerView: 1.5,
        spaceBetween: 16,
      },
      // Large devices (desktops, 1024px and up)
      1024: {
        slidesPerView: 3.2,
        spaceBetween: 22,
      },
      // Extra large devices (large desktops, 1280px and up)
      1280: {
        slidesPerView: 3.5,
        spaceBetween: 26,
      },
      // XXL devices (1440px and up)
      1440: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
      // Ultra wide screens (1920px and up)
      1920: {
        slidesPerView: 2.5,
        spaceBetween: 35,
      },
    },
    navigation: false,
    pagination: false,
    scrollbar: false,
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    mousewheel: {
      enabled: false,
    },
    effect: "slide",
    slideToClickedSlide: false,
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    // Add smooth CSS transitions
    cssMode: false,
    // Resistance for smooth edge behavior
    resistance: true,
    resistanceRatio: 0.85,
  });

  const ctaButton = document.querySelector(".cta-button");
  const swiperEl = document.querySelector(".ingredients-swiper");
  const swiperWrapper = document.querySelector(".swiper-wrapper");

  if (ctaButton && swiperEl) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    // Check if a point is within the button area
    function isPointOnButton(x, y) {
      const buttonRect = ctaButton.getBoundingClientRect();
      return (
        x >= buttonRect.left &&
        x <= buttonRect.right &&
        y >= buttonRect.top &&
        y <= buttonRect.bottom
      );
    }

    // Handle mouse events
    swiperEl.addEventListener("mousedown", function (e) {
      if (isPointOnButton(e.clientX, e.clientY)) {
        // Click is on button - prevent swiper from handling it
        e.stopPropagation();
        // Let the button handle the click naturally
        return;
      }
      // Start drag tracking
      isDragging = false;
      startX = e.clientX;
      startY = e.clientY;
      startTime = Date.now();
    });

    swiperEl.addEventListener("mousemove", function (e) {
      if (startX !== 0 && startY !== 0) {
        const deltaX = Math.abs(e.clientX - startX);
        const deltaY = Math.abs(e.clientY - startY);
        if (deltaX > 5 || deltaY > 5) {
          isDragging = true;
        }
      }
    });

    swiperEl.addEventListener("click", function (e) {
      // If click is on button and we didn't drag, let button handle it
      if (isPointOnButton(e.clientX, e.clientY) && !isDragging) {
        e.stopPropagation();
        e.preventDefault();
        // Trigger button click
        ctaButton.click();
      }
      // Reset
      isDragging = false;
      startX = 0;
      startY = 0;
    });

    // Handle touch events
    swiperEl.addEventListener("touchstart", function (e) {
      const touch = e.touches[0];
      if (isPointOnButton(touch.clientX, touch.clientY)) {
        // Touch is on button - prevent swiper from handling it
        e.stopPropagation();
        return;
      }
      // Start drag tracking
      isDragging = false;
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
    });

    swiperEl.addEventListener("touchmove", function (e) {
      if (startX !== 0 && startY !== 0) {
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - startX);
        const deltaY = Math.abs(touch.clientY - startY);
        if (deltaX > 5 || deltaY > 5) {
          isDragging = true;
        }
      }
    });

    swiperEl.addEventListener("touchend", function (e) {
      if (startX !== 0 && startY !== 0 && !isDragging) {
        const touch = e.changedTouches[0];
        if (isPointOnButton(touch.clientX, touch.clientY)) {
          e.stopPropagation();
          e.preventDefault();
          // Trigger button click
          ctaButton.click();
        }
      }
      // Reset
      isDragging = false;
      startX = 0;
      startY = 0;
    });

    // Ensure button click works
    ctaButton.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  // Handle shade keyword styling (if needed)
  const shadeElements = document.querySelectorAll(".shade");
  shadeElements.forEach((el) => {
    el.style.fontStyle = "italic";
    el.style.color = "#8BB8D9";
  });

  // Custom scroll direction detection for ingredients section
  const ingredientsSection = document.querySelector(".ingredients-section");
  const swiperContainer = document.querySelector(".ingredients-swiper");

  if (ingredientsSection && swiperContainer) {
    let wheelHistory = [];
    let lastWheelTime = 0;
    let wheelScrollDelta = 0;
    let scrollResetTimeout = null;
    const WHEEL_HISTORY_SIZE = 3;
    const HORIZONTAL_THRESHOLD = 1.5; // Horizontal must be 1.5x greater than vertical
    const SCROLL_THRESHOLD = 50; // Threshold for triggering slide change

    ingredientsSection.addEventListener(
      "wheel",
      function (e) {
        const now = Date.now();
        const timeSinceLastWheel = now - lastWheelTime;
        lastWheelTime = now;

        // Reset accumulated scroll if too much time has passed
        if (timeSinceLastWheel > 200) {
          wheelScrollDelta = 0;
        }

        // Clear existing reset timeout
        if (scrollResetTimeout) {
          clearTimeout(scrollResetTimeout);
        }

        // Track recent wheel events to detect direction (for touchpad diagonal gestures)
        wheelHistory.push({
          deltaX: e.deltaX,
          deltaY: e.deltaY,
          time: now,
        });

        // Keep only last N events
        if (wheelHistory.length > WHEEL_HISTORY_SIZE) {
          wheelHistory.shift();
        }

        // Calculate current and average deltas
        const currentDeltaX = Math.abs(e.deltaX);
        const currentDeltaY = Math.abs(e.deltaY);

        // For immediate detection (mouse wheel)
        const isImmediateHorizontal = currentDeltaX > currentDeltaY;

        // For averaged detection (touchpad gestures)
        let isAveragedHorizontal = false;
        if (wheelHistory.length >= 2) {
          const avgDeltaX =
            wheelHistory.reduce((sum, w) => sum + Math.abs(w.deltaX), 0) /
            wheelHistory.length;
          const avgDeltaY =
            wheelHistory.reduce((sum, w) => sum + Math.abs(w.deltaY), 0) /
            wheelHistory.length;
          isAveragedHorizontal = avgDeltaX > avgDeltaY * HORIZONTAL_THRESHOLD;
        }

        // Determine if this is primarily a horizontal scroll
        const isHorizontal = isImmediateHorizontal || isAveragedHorizontal;

        if (isHorizontal && currentDeltaX > 0) {
          // Horizontal scroll - snap to next/previous slide
          e.preventDefault();
          e.stopPropagation();

          // Determine scroll direction based on deltaX sign
          const scrollDirection = e.deltaX > 0 ? 1 : -1;

          // Accumulate scroll delta
          wheelScrollDelta += Math.abs(e.deltaX);

          // If threshold reached, trigger slide change
          if (wheelScrollDelta >= SCROLL_THRESHOLD) {
            // Reset accumulated delta
            wheelScrollDelta = 0;

            // Navigate to next or previous slide
            if (scrollDirection > 0) {
              swiper.slideNext();
            } else {
              swiper.slidePrev();
            }
          }

          // Reset accumulated scroll after a delay
          scrollResetTimeout = setTimeout(() => {
            wheelScrollDelta = 0;
          }, 300);
        } else if (currentDeltaY > 0) {
          // Vertical scroll - allow normal page scrolling
          // Reset horizontal scroll accumulation
          wheelScrollDelta = 0;
          // Don't prevent default, let the browser handle it
          return;
        }
      },
      { passive: false }
    );
  }
});
