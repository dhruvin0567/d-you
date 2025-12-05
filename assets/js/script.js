// ====================
// Offcanvas Menu - Body Scroll Lock
// ====================
(function () {
  const offcanvasElement = document.getElementById("mobileNav");
  if (offcanvasElement) {
    const bsOffcanvas = new bootstrap.Offcanvas(offcanvasElement, {
      backdrop: true,
      scroll: false,
    });

    offcanvasElement.addEventListener("show.bs.offcanvas", function () {
      document.body.classList.add("offcanvas-open");
      document.body.style.overflow = "hidden";
    });

    offcanvasElement.addEventListener("hide.bs.offcanvas", function () {
      document.body.classList.remove("offcanvas-open");
      document.body.style.overflow = "";
    });

    // Close offcanvas when clicking on overlay
    const backdrop = document.querySelector(".offcanvas-backdrop");
    if (backdrop) {
      backdrop.addEventListener("click", function () {
        bsOffcanvas.hide();
      });
    }
  }
})();

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
      fullText + ' <button class="show-more-link">Show Less</button>';
    const newLink = reviewText.querySelector(".show-more-link");
    newLink.addEventListener("click", handleShowMore);
  } else {
    reviewText.innerHTML =
      shortText + ' <button class="show-more-link">Show More</button>';
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

  // toggle for automatic continuous scrolling (set to false to disable auto slider)
  const ENABLE_TOP_SHELF_AUTO_SCROLL = false;

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

  if (ENABLE_TOP_SHELF_AUTO_SCROLL) {
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
  }

  topShelfGrid.addEventListener("mouseenter", () => {
    isHovered = true;
  });

  topShelfGrid.addEventListener("mouseleave", () => {
    isHovered = false;
  });

  // Wheel scroll: when cursor is over the product cards, use vertical scroll
  // to move the slider horizontally. Left half of the section scrolls left,
  // right half scrolls right. Outside this area, page scroll behaves normally.
  topShelfGrid.addEventListener(
    "wheel",
    (e) => {
      const rect = topShelfGrid.getBoundingClientRect();

      // Only intercept scroll if pointer is actually over the slider vertically
      if (e.clientY < rect.top || e.clientY > rect.bottom) {
        return;
      }

      // Only activate when hovering over a card / image area
      const card = e.target.closest(".top-shelf-picks__card");
      if (!card) {
        return;
      }

      // Prevent normal page scroll and convert to horizontal motion
      e.preventDefault();

      const centerX = rect.left + rect.width / 2;
      const magnitude = Math.abs(e.deltaY || e.deltaX || 0);
      if (!magnitude) return;

      const direction = e.clientX < centerX ? -1 : 1; // left area => scroll left
      const SCROLL_MULTIPLIER = 1.2;

      topShelfGrid.scrollLeft += direction * magnitude * SCROLL_MULTIPLIER;

      // keep wheel scroll in sync with looping logic
      if (contentWidth > 0) {
        if (topShelfGrid.scrollLeft < 0) {
          topShelfGrid.scrollLeft += contentWidth;
        } else if (topShelfGrid.scrollLeft >= contentWidth) {
          topShelfGrid.scrollLeft -= contentWidth;
        }
      }
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
        button.classList.toggle("lineup__toggle-btn--active", button === btn);
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

/* ------------------ JAVASCRIPT (Converted from Liquid) ------------------ */
(function () {
  const sections = document.querySelectorAll("[data-before-after-section]");
  sections.forEach((section) => {
    const sliderRoot = section.querySelector("[data-before-after-slider]");
    const pairs = Array.from(
      sliderRoot.querySelectorAll("[data-before-after-pair]")
    );
    let currentIndex = 0;
    let activeViewport = null;
    let pendingPosition = 50;
    let isDragging = false;
    let rafId = null;
    const prevButton = section.querySelector("[data-before-after-prev]");
    const nextButton = section.querySelector("[data-before-after-next]");

    function setActivePair(index) {
      currentIndex = (index + pairs.length) % pairs.length;
      pairs.forEach((pair, i) => {
        pair.classList.toggle("is-active", i === currentIndex);
        pair.setAttribute("aria-hidden", i === currentIndex ? "false" : "true");
      });
      activeViewport = pairs[currentIndex].querySelector(
        "[data-before-after-viewport]"
      );
      activeViewport.style.setProperty("--slider-position", "50%");
    }

    function updateSlider() {
      activeViewport.style.setProperty(
        "--slider-position",
        pendingPosition + "%"
      );
      rafId = null;
    }

    function scheduleUpdate() {
      if (rafId) return;
      rafId = requestAnimationFrame(updateSlider);
    }

    function positionFromEvent(e) {
      const rect = activeViewport.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      return (x / rect.width) * 100;
    }

    function startDrag(e) {
      isDragging = true;
      pendingPosition = positionFromEvent(e);
      scheduleUpdate();
      window.addEventListener("mousemove", move);
      window.addEventListener("touchmove", move);
      window.addEventListener("mouseup", end);
      window.addEventListener("touchend", end);
    }

    function move(e) {
      if (!isDragging) return;
      pendingPosition = positionFromEvent(e);
      scheduleUpdate();
    }

    function end() {
      isDragging = false;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", end);
      window.removeEventListener("touchend", end);
    }

    pairs.forEach((pair) => {
      const viewport = pair.querySelector("[data-before-after-viewport]");
      const handle = pair.querySelector("[data-before-after-handle]");
      handle.addEventListener("mousedown", (e) => {
        activeViewport = viewport;
        startDrag(e);
      });
      handle.addEventListener("touchstart", (e) => {
        activeViewport = viewport;
        startDrag(e);
      });
      viewport.addEventListener("mousedown", (e) => {
        activeViewport = viewport;
        startDrag(e);
      });
      viewport.addEventListener("touchstart", (e) => {
        activeViewport = viewport;
        startDrag(e);
      });
    });

    prevButton.addEventListener("click", () => setActivePair(currentIndex - 1));
    nextButton.addEventListener("click", () => setActivePair(currentIndex + 1));
    setActivePair(0);
  });
})();

// ====================
// Product Page - Media Gallery with Videos and Vertical Slider
// ====================
(function () {
  const thumbnails = document.querySelectorAll(".media-gallery__thumbnail");
  const mainImage = document.getElementById("main-product-image");
  const mainVideo = document.getElementById("main-product-video");
  const mainDisplay = document.querySelector(".media-gallery__main-content");
  const thumbnailSlider = document.getElementById("thumbnail-slider");
  
  if (!thumbnails.length) return;

  const mediaItems = [
    { type: "image", src: "./assets/img/image1.webp" },
    { type: "image", src: "./assets/img/image2.webp" },
    { type: "image", src: "./assets/img/image3.webp" },
    { type: "image", src: "./assets/img/image4.webp" },
    { type: "video", src: "./assets/img/video1.mp4", thumbnail: "./assets/img/image1.webp" },
    { type: "video", src: "./assets/img/video2.mp4", thumbnail: "./assets/img/image2.webp" },
    { type: "video", src: "./assets/img/video3.mp4", thumbnail: "./assets/img/image3.webp" },
    { type: "image", src: "./assets/img/image6.webp" }
  ];

  // Function to scroll thumbnail into view when active
  function scrollThumbnailIntoView(activeThumbnail) {
    if (activeThumbnail && thumbnailSlider) {
      const containerRect = thumbnailSlider.getBoundingClientRect();
      const thumbnailRect = activeThumbnail.getBoundingClientRect();
      
      // Check if thumbnail is outside visible area
      if (thumbnailRect.top < containerRect.top) {
        activeThumbnail.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else if (thumbnailRect.bottom > containerRect.bottom) {
        activeThumbnail.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      const mediaIndex = parseInt(thumbnail.getAttribute("data-media"));
      const mediaType = thumbnail.getAttribute("data-type");
      const mediaItem = mediaItems[mediaIndex];

      if (!mediaItem) return;

      // Update active thumbnail
      thumbnails.forEach((thumb) => thumb.classList.remove("active"));
      thumbnail.classList.add("active");

      // Scroll active thumbnail into view
      scrollThumbnailIntoView(thumbnail);

      // Handle image or video display
      if (mediaType === "video") {
        const videoSrc = thumbnail.getAttribute("data-video");
        
        // Hide image, show video
        if (mainImage) {
          mainImage.style.display = "none";
        }
        if (mainVideo) {
          mainVideo.src = videoSrc;
          mainVideo.style.display = "block";
          mainVideo.style.position = "absolute";
          mainVideo.style.top = "0";
          mainVideo.style.left = "0";
          mainVideo.style.width = "100%";
          mainVideo.style.height = "100%";
          mainVideo.load();
          mainVideo.play().catch((e) => {
            console.log("Video autoplay prevented:", e);
          });
        }
      } else {
        // Hide video, show image
        if (mainVideo) {
          mainVideo.pause();
          mainVideo.style.display = "none";
          mainVideo.src = "";
        }
        if (mainImage) {
          mainImage.style.display = "block";
          mainImage.style.position = "relative";
          mainImage.style.opacity = "0";
          setTimeout(() => {
            mainImage.src = mediaItem.src;
            mainImage.style.opacity = "1";
          }, 150);
        }
      }
    });
  });

  // Initialize video thumbnails to play continuously
  const videoThumbnails = document.querySelectorAll(".media-gallery__thumbnail-video");
  videoThumbnails.forEach((video) => {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("muted", "");
    video.setAttribute("loop", "");
    video.setAttribute("autoplay", "");
    
    // Try to play the video
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // Autoplay was prevented, try again when user interacts
        console.log("Video thumbnail autoplay prevented, will play on interaction");
      });
    }
  });

  // Ensure videos play when they come into view
  const observerOptions = {
    root: thumbnailSlider,
    rootMargin: "0px",
    threshold: 0.1
  };

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch((e) => {
          // Autoplay prevented, will play on user interaction
        });
      } else {
        video.pause();
      }
    });
  }, observerOptions);

  videoThumbnails.forEach((video) => {
    videoObserver.observe(video);
  });

  // Fast direct scrolling for thumbnail slider - same as right column native scrolling
  if (thumbnailSlider) {
    // Fast, direct scrolling like right column section - no smooth animations
    thumbnailSlider.addEventListener("wheel", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Direct fast scroll - immediate like native browser scrolling
      const scrollAmount = e.deltaY;
      thumbnailSlider.scrollTop += scrollAmount;
    }, { passive: false });
    
    // Cursor feedback on hover
    thumbnailSlider.addEventListener("mouseenter", () => {
      thumbnailSlider.style.cursor = 'grab';
    });
    
    thumbnailSlider.addEventListener("mouseleave", () => {
      thumbnailSlider.style.cursor = 'default';
    });

    // Shadow fade effects for scrollable slider
    const thumbnailsWrapper = thumbnailSlider.closest(".media-gallery__thumbnails-wrapper");
    if (thumbnailsWrapper) {
      function updateShadowFade() {
        const scrollTop = thumbnailSlider.scrollTop;
        const scrollHeight = thumbnailSlider.scrollHeight;
        const clientHeight = thumbnailSlider.clientHeight;
        const isScrollable = scrollHeight > clientHeight;
        
        if (isScrollable) {
          // Show top shadow if scrolled down
          if (scrollTop > 10) {
            thumbnailsWrapper.classList.add("has-scroll-top");
          } else {
            thumbnailsWrapper.classList.remove("has-scroll-top");
          }
          
          // Hide bottom shadow if scrolled to bottom
          if (scrollTop + clientHeight >= scrollHeight - 10) {
            thumbnailsWrapper.classList.add("has-scroll-bottom");
          } else {
            thumbnailsWrapper.classList.remove("has-scroll-bottom");
          }
        } else {
          // No scrolling needed, hide both shadows
          thumbnailsWrapper.classList.remove("has-scroll-top", "has-scroll-bottom");
        }
      }

      // Update on scroll
      thumbnailSlider.addEventListener("scroll", updateShadowFade);
      
      // Update on load and resize
      updateShadowFade();
      window.addEventListener("resize", updateShadowFade);
    }
  }
})();

// ====================
// Product Page - Accordion
// ====================
(function () {
  const accordionHeaders = document.querySelectorAll(".product-accordion__header");
  
  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const isExpanded = header.getAttribute("aria-expanded") === "true";
      const content = document.getElementById(header.getAttribute("aria-controls"));
      
      if (!content) return;

      // Close all other accordions
      accordionHeaders.forEach((otherHeader) => {
        if (otherHeader !== header) {
          otherHeader.setAttribute("aria-expanded", "false");
          const otherContent = document.getElementById(otherHeader.getAttribute("aria-controls"));
          if (otherContent) {
            otherContent.setAttribute("hidden", "hidden");
          }
        }
      });

      // Toggle current accordion
      if (isExpanded) {
        header.setAttribute("aria-expanded", "false");
        content.setAttribute("hidden", "hidden");
      } else {
        header.setAttribute("aria-expanded", "true");
        content.removeAttribute("hidden");
      }
    });

    // Keyboard support
    header.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        header.click();
      }
    });
  });
})();

// ====================
// Scrolling Media Gallery - GSAP Smooth Horizontal Scroll & Video Play/Pause
// ====================
(function () {
  const scrollingMediaTrack = document.getElementById("scrolling-media-track");
  const scrollingMediaWrapper = document.querySelector(".scrolling-media-gallery__wrapper");
  const scrollingMediaSection = document.querySelector(".scrolling-media-gallery");
  const scrollingMediaItems = document.querySelectorAll(".scrolling-media-item--video");
  
  if (!scrollingMediaTrack || !scrollingMediaWrapper) return;

  // Register GSAP ScrollTrigger plugin if available
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  // GSAP Smooth Horizontal Scrolling with Mouse Wheel
  let isHovering = false;
  let scrollTween = null;
  let scrollVelocity = 0;
  let lastScrollTime = 0;

  // Detect mouse enter/leave on the entire section
  if (scrollingMediaSection) {
    scrollingMediaSection.addEventListener("mouseenter", () => {
      isHovering = true;
    });

    scrollingMediaSection.addEventListener("mouseleave", () => {
      isHovering = false;
      // Kill any ongoing scroll animation when mouse leaves
      if (scrollTween) {
        scrollTween.kill();
        scrollTween = null;
      }
      scrollVelocity = 0;
    });
  }

  // Smooth horizontal scrolling with mouse wheel using GSAP
  scrollingMediaTrack.addEventListener("wheel", (e) => {
    // Check if mouse is over the section
    if (!isHovering && scrollingMediaSection) {
      const rect = scrollingMediaSection.getBoundingClientRect();
      const isOverSection = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );
      
      if (!isOverSection) return;
      isHovering = true;
    }

    e.preventDefault();
    e.stopPropagation();
    
    const delta = e.deltaY;
    const currentScroll = scrollingMediaTrack.scrollLeft;
    const maxScroll = scrollingMediaTrack.scrollWidth - scrollingMediaTrack.clientWidth;
    
    // Calculate scroll velocity for smoother feel
    const now = Date.now();
    const timeDelta = now - lastScrollTime;
    lastScrollTime = now;
    
    // Accumulate velocity for smoother scrolling
    scrollVelocity = scrollVelocity * 0.7 + delta * 0.3;
    
    // Calculate target scroll position with velocity
    let targetScroll = currentScroll + scrollVelocity;
    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

    // Kill any existing scroll animation
    if (scrollTween) {
      scrollTween.kill();
    }

    // Create smooth GSAP animation for scrolling
    if (typeof gsap !== 'undefined') {
      scrollTween = gsap.to(scrollingMediaTrack, {
        scrollLeft: targetScroll,
        duration: 0.8,
        ease: "power1.out",
        onUpdate: () => {
          // Decay velocity during scroll
          scrollVelocity *= 0.95;
        },
        onComplete: () => {
          scrollTween = null;
          scrollVelocity = 0;
        }
      });
    } else {
      // Fallback smooth scrolling without GSAP
      scrollingMediaTrack.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
      scrollVelocity = 0;
    }
  }, { passive: false });

  // Also handle wheel on wrapper for better detection
  if (scrollingMediaWrapper) {
    scrollingMediaWrapper.addEventListener("wheel", (e) => {
      if (!isHovering) {
        const rect = scrollingMediaWrapper.getBoundingClientRect();
        const isOverWrapper = (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        );
        
        if (isOverWrapper) {
          isHovering = true;
          // Trigger the track's wheel event
          scrollingMediaTrack.dispatchEvent(new WheelEvent('wheel', {
            deltaY: e.deltaY,
            clientX: e.clientX,
            clientY: e.clientY,
            bubbles: true,
            cancelable: true
          }));
        }
      }
    }, { passive: false });
  }

  // Alternative: Use GSAP Draggable for drag scrolling (optional enhancement)
  // You can uncomment this if you want drag functionality
  /*
  if (typeof gsap !== 'undefined' && typeof Draggable !== 'undefined') {
    gsap.registerPlugin(Draggable);
    
    Draggable.create(scrollingMediaTrack, {
      type: "x",
      bounds: {
        minX: -(scrollingMediaTrack.scrollWidth - scrollingMediaTrack.clientWidth),
        maxX: 0
      },
      inertia: true,
      ease: "power2.out"
    });
  }
  */
  
  // Video play/pause functionality
  scrollingMediaItems.forEach((item) => {
    const video = item.querySelector("video");
    const playOverlay = item.querySelector(".scrolling-media-item__play-overlay");
    
    if (!video) return;

    // Play video on hover, pause on mouse leave
    item.addEventListener("mouseenter", () => {
      if (video.paused) {
        video.play().catch((e) => {
          console.log("Video autoplay prevented:", e);
        });
      }
    });

    item.addEventListener("mouseleave", () => {
      if (!video.paused) {
        video.pause();
      }
    });

    // Click to play/pause
    item.addEventListener("click", () => {
      if (video.paused) {
        video.play().catch((e) => {
          console.log("Video play prevented:", e);
        });
      } else {
        video.pause();
      }
    });

    // Show play overlay when video is paused
    video.addEventListener("play", () => {
      if (playOverlay) {
        playOverlay.style.opacity = "0";
      }
    });

    video.addEventListener("pause", () => {
      if (playOverlay) {
        playOverlay.style.opacity = "1";
      }
    });
  });
})();
