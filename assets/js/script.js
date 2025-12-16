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

const showMoreLinks = document.querySelectorAll(".show-more-link");
showMoreLinks.forEach((link) => {
  link.addEventListener("click", handleShowMore);
});

// ====================
// Top Shelf Picks Slider
// ====================

const topShelfGrid = document.querySelector(".top-shelf-picks__grid");

if (topShelfGrid) {
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  let hasMoved = false;
  const DRAG_THRESHOLD = 3;

  const ENABLE_TOP_SHELF_AUTO_SCROLL = false;

  const CARD_SCROLL_SPEED_PX_PER_SEC = 30;
  let isHovered = false;
  let lastTimestamp = null;
  let contentWidth = 0;

  const cards = Array.from(topShelfGrid.children);
  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    topShelfGrid.appendChild(clone);
  });

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

  topShelfGrid.addEventListener(
    "wheel",
    (e) => {
      const rect = topShelfGrid.getBoundingClientRect();

      if (e.clientY < rect.top || e.clientY > rect.bottom) {
        return;
      }

      const card = e.target.closest(".top-shelf-picks__card");
      if (!card) {
        return;
      }

      e.preventDefault();

      const centerX = rect.left + rect.width / 2;
      const magnitude = Math.abs(e.deltaY || e.deltaX || 0);
      if (!magnitude) return;

      const direction = e.clientX < centerX ? -1 : 1;
      const SCROLL_MULTIPLIER = 1.2;

      topShelfGrid.scrollLeft += direction * magnitude * SCROLL_MULTIPLIER;

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

      lineupToggleButtons.forEach((button) => {
        button.classList.toggle("lineup__toggle-btn--active", button === btn);
      });

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

  divider.addEventListener("mousedown", handlePointerDown);
  window.addEventListener("mousemove", handlePointerMove);
  window.addEventListener("mouseup", handlePointerUp);

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
// Product Page
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
    {
      type: "video",
      src: "./assets/img/video1.mp4",
      thumbnail: "./assets/img/image1.webp",
    },
    {
      type: "video",
      src: "./assets/img/video2.mp4",
      thumbnail: "./assets/img/image2.webp",
    },
    {
      type: "video",
      src: "./assets/img/video3.mp4",
      thumbnail: "./assets/img/image3.webp",
    },
    { type: "image", src: "./assets/img/image6.webp" },
  ];

  function scrollThumbnailIntoView(activeThumbnail) {
    if (activeThumbnail && thumbnailSlider) {
      const isHorizontal = window.innerWidth <= 991.98;

      if (isHorizontal) {
        const containerRect = thumbnailSlider.getBoundingClientRect();
        const thumbnailRect = activeThumbnail.getBoundingClientRect();

        if (thumbnailRect.left < containerRect.left) {
          activeThumbnail.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
          });
        } else if (thumbnailRect.right > containerRect.right) {
          activeThumbnail.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
          });
        }
      } else {
        const containerRect = thumbnailSlider.getBoundingClientRect();
        const thumbnailRect = activeThumbnail.getBoundingClientRect();

        if (thumbnailRect.top < containerRect.top) {
          activeThumbnail.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        } else if (thumbnailRect.bottom > containerRect.bottom) {
          activeThumbnail.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }
    }
  }

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      const mediaIndex = parseInt(thumbnail.getAttribute("data-media"));
      const mediaType = thumbnail.getAttribute("data-type");
      const mediaItem = mediaItems[mediaIndex];

      if (!mediaItem) return;

      thumbnails.forEach((thumb) => thumb.classList.remove("active"));
      thumbnail.classList.add("active");

      scrollThumbnailIntoView(thumbnail);

      if (mediaType === "video") {
        const videoSrc = thumbnail.getAttribute("data-video");

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

  const videoThumbnails = document.querySelectorAll(
    ".media-gallery__thumbnail-video"
  );

  videoThumbnails.forEach((video) => {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("muted", "");
    video.setAttribute("loop", "");
    video.setAttribute("autoplay", "");

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log(
          "Video thumbnail autoplay prevented, will play on interaction"
        );
      });
    }
  });

  const observerOptions = {
    root: thumbnailSlider,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch((e) => {});
      } else {
        video.pause();
      }
    });
  }, observerOptions);

  videoThumbnails.forEach((video) => {
    videoObserver.observe(video);
  });

  if (thumbnailSlider) {
    function isHorizontalLayout() {
      const width = window.innerWidth;
      return width <= 1148;
    }

    thumbnailSlider.addEventListener(
      "wheel",
      (e) => {
        if (isHorizontalLayout()) {
          e.preventDefault();
          e.stopPropagation();
          const scrollAmount = e.deltaX !== 0 ? e.deltaX : e.deltaY;
          thumbnailSlider.scrollLeft += scrollAmount;
        } else {
          e.preventDefault();
          e.stopPropagation();
          const scrollAmount = e.deltaY;
          thumbnailSlider.scrollTop += scrollAmount;
        }
      },
      { passive: false }
    );

    thumbnailSlider.addEventListener("mouseenter", () => {
      thumbnailSlider.style.cursor = "grab";
    });

    thumbnailSlider.addEventListener("mouseleave", () => {
      thumbnailSlider.style.cursor = "default";
    });

    const thumbnailsWrapper = thumbnailSlider.closest(
      ".media-gallery__thumbnails-wrapper"
    );

    if (thumbnailsWrapper) {
      function updateShadowFade() {
        const isHorizontal = isHorizontalLayout();

        if (isHorizontal) {
          const scrollLeft = thumbnailSlider.scrollLeft;
          const scrollWidth = thumbnailSlider.scrollWidth;
          const clientWidth = thumbnailSlider.clientWidth;
          const isScrollable = scrollWidth > clientWidth;

          if (isScrollable) {
            if (scrollLeft > 10) {
              thumbnailsWrapper.classList.add("has-scroll-top");
            } else {
              thumbnailsWrapper.classList.remove("has-scroll-top");
            }

            if (scrollLeft + clientWidth >= scrollWidth - 10) {
              thumbnailsWrapper.classList.add("has-scroll-bottom");
            } else {
              thumbnailsWrapper.classList.remove("has-scroll-bottom");
            }
          } else {
            thumbnailsWrapper.classList.remove(
              "has-scroll-top",
              "has-scroll-bottom"
            );
          }
        } else {
          const scrollTop = thumbnailSlider.scrollTop;
          const scrollHeight = thumbnailSlider.scrollHeight;
          const clientHeight = thumbnailSlider.clientHeight;
          const isScrollable = scrollHeight > clientHeight;

          if (isScrollable) {
            if (scrollTop > 10) {
              thumbnailsWrapper.classList.add("has-scroll-top");
            } else {
              thumbnailsWrapper.classList.remove("has-scroll-top");
            }

            if (scrollTop + clientHeight >= scrollHeight - 10) {
              thumbnailsWrapper.classList.add("has-scroll-bottom");
            } else {
              thumbnailsWrapper.classList.remove("has-scroll-bottom");
            }
          } else {
            thumbnailsWrapper.classList.remove(
              "has-scroll-top",
              "has-scroll-bottom"
            );
          }
        }
      }

      thumbnailSlider.addEventListener("scroll", updateShadowFade);

      updateShadowFade();
      window.addEventListener("resize", updateShadowFade);
    }
  }
})();

// ====================
// Product Page - Accordion
// ====================
(function () {
  const ANIMATION_DURATION = 400;

  const ANIMATION_EASING = "cubic-bezier(0.4, 0, 0.2, 1)"; // Material Design easing

  const accordionHeaders = document.querySelectorAll(
    ".product-accordion__header"
  );

  function closeAccordion(header, content) {
    header.setAttribute("aria-expanded", "false");
    content.classList.remove("is-open");

    setTimeout(() => {
      if (header.getAttribute("aria-expanded") === "false") {
        content.setAttribute("hidden", "hidden");
      }
    }, ANIMATION_DURATION);
  }

  function openAccordion(header, content) {
    header.setAttribute("aria-expanded", "true");
    content.removeAttribute("hidden");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        content.classList.add("is-open");
      });
    });
  }

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const isExpanded = header.getAttribute("aria-expanded") === "true";
      const content = document.getElementById(
        header.getAttribute("aria-controls")
      );

      if (!content) return;

      accordionHeaders.forEach((otherHeader) => {
        if (otherHeader !== header) {
          const otherIsExpanded =
            otherHeader.getAttribute("aria-expanded") === "true";
          if (otherIsExpanded) {
            const otherContent = document.getElementById(
              otherHeader.getAttribute("aria-controls")
            );
            if (otherContent) {
              closeAccordion(otherHeader, otherContent);
            }
          }
        }
      });

      if (isExpanded) {
        closeAccordion(header, content);
      } else {
        openAccordion(header, content);
      }
    });

    header.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        header.click();
      }
    });
  });
})();

// ====================
// Scrolling Media Gallery
// ====================

(function () {
  const scrollingMediaTrack = document.getElementById("scrolling-media-track");
  const scrollingMediaWrapper = document.querySelector(
    ".scrolling-media-gallery__wrapper"
  );

  const scrollingMediaSection = document.querySelector(
    ".scrolling-media-gallery"
  );

  const scrollingMediaItems = document.querySelectorAll(
    ".scrolling-media-item--video"
  );

  if (!scrollingMediaTrack || !scrollingMediaWrapper) return;

  if (typeof gsap !== "undefined") {
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  let isHovering = false;
  let scrollTween = null;
  let scrollVelocity = 0;
  let lastScrollTime = 0;

  if (scrollingMediaSection) {
    scrollingMediaSection.addEventListener("mouseenter", () => {
      isHovering = true;
    });

    scrollingMediaSection.addEventListener("mouseleave", () => {
      isHovering = false;
      if (scrollTween) {
        scrollTween.kill();
        scrollTween = null;
      }
      scrollVelocity = 0;
    });
  }

  scrollingMediaTrack.addEventListener(
    "wheel",
    (e) => {
      if (!isHovering && scrollingMediaSection) {
        const rect = scrollingMediaSection.getBoundingClientRect();
        const isOverSection =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        if (!isOverSection) return;
        isHovering = true;
      }

      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaY;
      const currentScroll = scrollingMediaTrack.scrollLeft;
      const maxScroll =
        scrollingMediaTrack.scrollWidth - scrollingMediaTrack.clientWidth;

      const now = Date.now();
      const timeDelta = now - lastScrollTime;
      lastScrollTime = now;

      scrollVelocity = scrollVelocity * 0.7 + delta * 0.3;

      let targetScroll = currentScroll + scrollVelocity;
      targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

      if (scrollTween) {
        scrollTween.kill();
      }

      if (typeof gsap !== "undefined") {
        scrollTween = gsap.to(scrollingMediaTrack, {
          scrollLeft: targetScroll,
          duration: 0.8,
          ease: "power1.out",
          onUpdate: () => {
            scrollVelocity *= 0.95;
          },

          onComplete: () => {
            scrollTween = null;
            scrollVelocity = 0;
          },
        });
      } else {
        scrollingMediaTrack.scrollTo({
          left: targetScroll,
          behavior: "smooth",
        });
        scrollVelocity = 0;
      }
    },
    { passive: false }
  );

  if (scrollingMediaWrapper) {
    scrollingMediaWrapper.addEventListener(
      "wheel",
      (e) => {
        if (!isHovering) {
          const rect = scrollingMediaWrapper.getBoundingClientRect();
          const isOverWrapper =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;

          if (isOverWrapper) {
            isHovering = true;
            scrollingMediaTrack.dispatchEvent(
              new WheelEvent("wheel", {
                deltaY: e.deltaY,
                clientX: e.clientX,
                clientY: e.clientY,
                bubbles: true,
                cancelable: true,
              })
            );
          }
        }
      },
      { passive: false }
    );
  }

  scrollingMediaItems.forEach((item) => {
    const video = item.querySelector("video");
    const playOverlay = item.querySelector(
      ".scrolling-media-item__play-overlay"
    );

    if (!video) return;

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

    item.addEventListener("click", () => {
      if (video.paused) {
        video.play().catch((e) => {
          console.log("Video play prevented:", e);
        });
      } else {
        video.pause();
      }
    });

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

// ====================
// How to Use Section
// ====================

(function () {
  const howToUseCards = document.querySelectorAll(".how-to-use__card");

  howToUseCards.forEach((card) => {
    const video = card.querySelector(".how-to-use__media video");
    const playButton = card.querySelector(".how-to-use__play");

    if (!video || !playButton) return;

    const updatePlayButton = () => {
      if (video.paused) {
        playButton.style.opacity = "1";
        playButton.style.pointerEvents = "auto";
        playButton.classList.remove("hidden");
      } else {
        playButton.style.opacity = "0";
        playButton.style.pointerEvents = "none";
        playButton.classList.add("hidden");
      }
    };

    updatePlayButton();

    playButton.addEventListener("click", (e) => {
      e.stopPropagation();
      video.play().catch((error) => {
        console.log("Video play prevented:", error);
      });
    });

    video.addEventListener("play", updatePlayButton);
    video.addEventListener("pause", updatePlayButton);

    video.addEventListener("click", () => {
      if (video.paused) {
        video.play().catch((error) => {
          console.log("Video play prevented:", error);
        });
      } else {
        video.pause();
      }
    });
  });
})();

// ====================
// Complete The Routine
// ====================

(function () {
  const relatedProductsSlider = document.querySelector(
    ".related-products__slider"
  );

  if (!relatedProductsSlider) return;

  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;
  let hasMoved = false;
  const DRAG_THRESHOLD = 3;

  const startDrag = (clientX) => {
    isDragging = true;
    hasMoved = false;
    relatedProductsSlider.classList.add("is-dragging");
    startX = clientX;
    scrollLeft = relatedProductsSlider.scrollLeft;
  };

  const drag = (clientX) => {
    if (!isDragging) return;

    const deltaX = clientX - startX;
    const scrollDelta = deltaX * 1.2;

    if (Math.abs(scrollDelta) > DRAG_THRESHOLD) {
      hasMoved = true;
    }

    relatedProductsSlider.scrollLeft = scrollLeft - scrollDelta;
  };

  const endDrag = (e) => {
    if (isDragging && hasMoved && e && e.target) {
      const button = e.target.closest(".product-card__add");

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
    relatedProductsSlider.classList.remove("is-dragging");
  };

  relatedProductsSlider.addEventListener("mousedown", (e) => {
    if (e.target.closest(".product-card__add")) {
      return;
    }

    e.preventDefault();

    startDrag(e.clientX);
  });

  relatedProductsSlider.addEventListener("mouseleave", (e) => {
    endDrag(e);
  });

  window.addEventListener("mouseup", (e) => {
    if (isDragging) {
      endDrag(e);
    }
  });

  relatedProductsSlider.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    drag(e.clientX);
  });

  relatedProductsSlider.addEventListener(
    "touchstart",

    (e) => {
      if (e.target.closest(".product-card__add")) {
        return;
      }
      startDrag(e.touches[0].clientX);
    },

    { passive: true }
  );

  relatedProductsSlider.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      e.preventDefault();
      drag(e.touches[0].clientX);
    },
    { passive: false }
  );

  relatedProductsSlider.addEventListener("touchend", endDrag);
  relatedProductsSlider.addEventListener("touchcancel", endDrag);
})();

// ====================
// RESPONSIVE FIXES AND ENHANCEMENTS
// ====================

(function () {
  function debounce(func, wait) {
    let timeout;

    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);

        func(...args);
      };

      clearTimeout(timeout);

      timeout = setTimeout(later, wait);
    };
  }

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
  }

  // ====================
  // Media Gallery Responsive Fixes
  // ====================

  const mediaGallery = document.querySelector(".media-gallery");

  const thumbnailSlider = document.getElementById("thumbnail-slider");

  const thumbnailsWrapper = document.querySelector(
    ".media-gallery__thumbnails-wrapper"
  );

  if (mediaGallery && thumbnailSlider) {
    function handleThumbnailScroll() {
      if (isMobile()) {
        thumbnailSlider.style.overflowX = "auto";

        thumbnailSlider.style.overflowY = "hidden";

        thumbnailSlider.style.flexDirection = "row";

        if (thumbnailsWrapper) {
          thumbnailsWrapper.classList.remove(
            "has-scroll-top",
            "has-scroll-bottom"
          );
        }
      } else {
        thumbnailSlider.style.overflowX = "hidden";

        thumbnailSlider.style.overflowY = "auto";

        thumbnailSlider.style.flexDirection = "column";
      }
    }

    handleThumbnailScroll();
    window.addEventListener("resize", debounce(handleThumbnailScroll, 150));
  }

  // ====================
  // Product Card Slider Touch Improvements
  // ====================

  const productSliders = document.querySelectorAll(
    ".related-products__slider, .top-shelf-picks__grid"
  );

  productSliders.forEach((slider) => {
    if (!slider) return;

    let startX = 0;

    let scrollLeft = 0;

    let isDown = false;

    slider.addEventListener("touchstart", (e) => {
      isDown = true;

      startX = e.touches[0].pageX - slider.offsetLeft;

      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("touchmove", (e) => {
      if (!isDown) return;

      e.preventDefault();

      const x = e.touches[0].pageX - slider.offsetLeft;

      const walk = (x - startX) * 2;

      slider.scrollLeft = scrollLeft - walk;
    });

    slider.addEventListener("touchend", () => {
      isDown = false;
    });
  });

  // ====================
  // Video Preview Responsive Layout
  // ====================

  // ====================
  // Video Preview Slider
  // ====================

  const videoPreviewsGrid = document.querySelector(".video-previews__grid");

  if (videoPreviewsGrid) {
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    videoPreviewsGrid.addEventListener("mousedown", (e) => {
      isDragging = true;
      videoPreviewsGrid.classList.add("is-dragging");
      startX = e.pageX - videoPreviewsGrid.offsetLeft;
      scrollLeft = videoPreviewsGrid.scrollLeft;
    });

    videoPreviewsGrid.addEventListener("mouseleave", () => {
      isDragging = false;
      videoPreviewsGrid.classList.remove("is-dragging");
    });

    videoPreviewsGrid.addEventListener("mouseup", () => {
      isDragging = false;
      videoPreviewsGrid.classList.remove("is-dragging");
    });

    videoPreviewsGrid.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - videoPreviewsGrid.offsetLeft;
      const walk = (x - startX) * 2;
      videoPreviewsGrid.scrollLeft = scrollLeft - walk;
    });

    let touchStartX = 0;
    let touchScrollLeft = 0;

    videoPreviewsGrid.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].pageX;
        touchScrollLeft = videoPreviewsGrid.scrollLeft;
      },
      { passive: true }
    );

    videoPreviewsGrid.addEventListener(
      "touchmove",
      (e) => {
        if (!touchStartX) return;
        const touchX = e.touches[0].pageX;
        const walk = (touchStartX - touchX) * 2;
        videoPreviewsGrid.scrollLeft = touchScrollLeft + walk;
      },
      { passive: true }
    );

    videoPreviewsGrid.addEventListener(
      "touchend",
      () => {
        touchStartX = 0;
      },
      { passive: true }
    );
  }

  // ====================
  // Improve Touch Scrolling for All Sliders
  // ====================

  const allSliders = document.querySelectorAll(
    '[class*="__slider"], [class*="__grid"]'
  );

  allSliders.forEach((slider) => {
    if (!slider) return;

    slider.style.webkitOverflowScrolling = "touch";

    slider.addEventListener(
      "touchmove",
      (e) => {
        e.stopPropagation();
      },
      { passive: true }
    );
  });

  // ====================
  // Accordion Touch Improvements
  // ====================

  const accordionHeaders = document.querySelectorAll(
    ".product-accordion__header"
  );

  accordionHeaders.forEach((header) => {
    header.addEventListener("touchstart", () => {
      header.style.opacity = "0.7";
    });

    header.addEventListener("touchend", () => {
      header.style.opacity = "1";
    });

    header.addEventListener("touchcancel", () => {
      header.style.opacity = "1";
    });
  });

  // ====================
  // Button Touch Feedback
  // ====================

  const buttons = document.querySelectorAll(
    ".product-primary, .product-light, .product-card__add"
  );

  buttons.forEach((button) => {
    button.addEventListener("touchstart", () => {
      button.style.transform = "scale(0.98)";
    });

    button.addEventListener("touchend", () => {
      button.style.transform = "scale(1)";
    });

    button.addEventListener("touchcancel", () => {
      button.style.transform = "scale(1)";
    });
  });

  // ====================
  // Fix Image Loading on Mobile
  // ====================

  const images = document.querySelectorAll('img[loading="lazy"]');

  if (isMobile()) {
    images.forEach((img) => {
      img.removeAttribute("loading");
    });
  }

  // ====================
  // Viewport Height Fix for Mobile Browsers
  // ====================

  function setVH() {
    const vh = window.innerHeight * 0.01;

    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  setVH();

  window.addEventListener("resize", debounce(setVH, 150));

  window.addEventListener("orientationchange", setVH);

  // ====================
  // Prevent Zoom on Double Tap (iOS)
  // ====================

  let lastTouchEnd = 0;

  document.addEventListener(
    "touchend",
    (event) => {
      const now = Date.now();

      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }

      lastTouchEnd = now;
    },
    { passive: false }
  );

  // ====================
  // Smooth Scroll for Anchors on Mobile
  // ====================

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href === "#") return;

      e.preventDefault();

      const target = document.querySelector(href);

      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for header

        window.scrollTo({
          top: offsetTop,

          behavior: "smooth",
        });
      }
    });
  });

  // ====================
  // Fix Related Products Slider on Mobile
  // ====================

  const relatedProductsSlider = document.querySelector(
    ".related-products__slider"
  );

  if (relatedProductsSlider && isMobile()) {
    // Ensure cards are properly sized on mobile

    const productCards =
      relatedProductsSlider.querySelectorAll(".product-card");

    productCards.forEach((card) => {
      card.style.minWidth = "280px";

      card.style.flex = "0 0 280px";
    });
  }

  // ====================
  // Optimize Video Playback on Mobile
  // ====================

  const videos = document.querySelectorAll("video");

  videos.forEach((video) => {
    // Ensure videos are properly configured for mobile

    video.setAttribute("playsinline", "");

    video.setAttribute("webkit-playsinline", "");

    video.muted = true;

    // Pause videos when they're off-screen on mobile

    if (isMobile()) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              entry.target.pause();
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(video);
    }
  });

  // ====================
  // Feature Slider Mobile Optimization
  // ====================

  const featureSlider = document.querySelector(".feature-slider__content");

  if (featureSlider && isMobile()) {
    // Optimize animation speed for mobile

    featureSlider.style.animationDuration = "35s";
  }

  // ====================
  // Handle Orientation Change
  // ====================

  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      // Refresh all sliders after orientation change

      const allScrollableElements = document.querySelectorAll(
        '[style*="overflow"]'
      );

      allScrollableElements.forEach((el) => {
        el.scrollLeft = 0;
      });

      // Trigger resize event

      window.dispatchEvent(new Event("resize"));
    }, 300);
  });

  // ====================
  // Log Responsive Breakpoint (for debugging)
  // ====================

  function logBreakpoint() {
    const width = window.innerWidth;

    let breakpoint = "desktop";

    if (width <= 576) {
      breakpoint = "mobile-small";
    } else if (width <= 768) {
      breakpoint = "mobile";
    } else if (width <= 1024) {
      breakpoint = "tablet";
    }

    console.log(`Current breakpoint: ${breakpoint} (${width}px)`);
  }
})();

// ====================
// INGREDIENTS SLIDER SECTION
// ====================
(function () {
  const ingredientsSlider = document.getElementById("ingredientsSlider");
  const ingredientsTrack = ingredientsSlider?.querySelector(
    ".ingredients-slider-section__track"
  );
  const slideTexts = document.querySelectorAll(
    ".ingredients-slider-section__slide-text"
  );

  if (!ingredientsSlider || !ingredientsTrack) return;

  let isScrolling = false;
  let scrollTimeout = null;
  let lastScrollLeft = 0;
  let currentActiveIndex = 0;

  function getActiveSlideIndex() {
    const slides = document.querySelectorAll(
      ".ingredients-slider-section__slide"
    );
    const trackRect = ingredientsTrack.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    slides.forEach((slide, index) => {
      const slideRect = slide.getBoundingClientRect();
      const slideCenter = slideRect.left + slideRect.width / 2;
      const distance = Math.abs(slideCenter - trackCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  function animateTextUp(index) {
    slideTexts.forEach((text, i) => {
      if (i === index) {
        text.classList.add("animate-up");
        setTimeout(() => {
          text.classList.remove("animate-up");
        }, 500);
      }
    });
  }

  ingredientsSlider.addEventListener(
    "wheel",
    (e) => {
      const rect = ingredientsSlider.getBoundingClientRect();

      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const scrollAmount = e.deltaY;
      ingredientsTrack.scrollLeft += scrollAmount * 1.2;

      const newActiveIndex = getActiveSlideIndex();
      if (newActiveIndex !== currentActiveIndex) {
        currentActiveIndex = newActiveIndex;
        animateTextUp(currentActiveIndex);
      }

      isScrolling = true;
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        const finalActiveIndex = getActiveSlideIndex();
        if (finalActiveIndex !== currentActiveIndex) {
          currentActiveIndex = finalActiveIndex;
          animateTextUp(currentActiveIndex);
        }
      }, 150);
    },
    { passive: false }
  );

  ingredientsTrack.addEventListener("scroll", () => {
    if (!isScrolling) {
      const newActiveIndex = getActiveSlideIndex();
      if (newActiveIndex !== currentActiveIndex) {
        currentActiveIndex = newActiveIndex;
        animateTextUp(currentActiveIndex);
      }
    }
  });

  setTimeout(() => {
    currentActiveIndex = getActiveSlideIndex();
    animateTextUp(currentActiveIndex);
  }, 100);

  let isDragging = false;
  let startX = 0;
  let scrollLeftStart = 0;

  ingredientsSlider.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX - ingredientsSlider.offsetLeft;
    scrollLeftStart = ingredientsTrack.scrollLeft;
    ingredientsSlider.style.cursor = "grabbing";
  });

  ingredientsSlider.addEventListener("mouseleave", () => {
    isDragging = false;
    ingredientsSlider.style.cursor = "grab";
  });

  ingredientsSlider.addEventListener("mouseup", () => {
    isDragging = false;
    ingredientsSlider.style.cursor = "grab";
  });

  ingredientsSlider.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - ingredientsSlider.offsetLeft;
    const walk = (x - startX) * 2;
    ingredientsTrack.scrollLeft = scrollLeftStart - walk;

    const newActiveIndex = getActiveSlideIndex();
    if (newActiveIndex !== currentActiveIndex) {
      currentActiveIndex = newActiveIndex;
      animateTextUp(currentActiveIndex);
    }
  });

  let touchStartX = 0;
  let touchScrollLeft = 0;

  ingredientsSlider.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].pageX;
      touchScrollLeft = ingredientsTrack.scrollLeft;
    },
    { passive: true }
  );

  ingredientsSlider.addEventListener(
    "touchmove",
    (e) => {
      if (!touchStartX) return;
      const touchX = e.touches[0].pageX;
      const walk = (touchStartX - touchX) * 2;
      ingredientsTrack.scrollLeft = touchScrollLeft + walk;

      const newActiveIndex = getActiveSlideIndex();
      if (newActiveIndex !== currentActiveIndex) {
        currentActiveIndex = newActiveIndex;
        animateTextUp(currentActiveIndex);
      }
    },
    { passive: true }
  );

  ingredientsSlider.addEventListener(
    "touchend",
    () => {
      touchStartX = 0;
    },
    { passive: true }
  );
})();

// ====================
// Hustle Benefits Accordion - Smooth Animation
// ====================

(function () {
  const ANIMATION_DURATION = 400;
  const ANIMATION_EASING = "cubic-bezier(0.4, 0, 0.2, 1)"; // Material Design easing

  var section = document.querySelector("#hustle-benefits-1");
  if (!section) return;

  var container = section.querySelector("[data-hustle-benefits-accordion]");
  if (!container) return;

  var triggers = Array.prototype.slice.call(
    container.querySelectorAll("[data-hustle-benefits-trigger]")
  );

  if (!triggers.length) return;

  function closeAccordion(button, panel) {
    button.setAttribute("aria-expanded", "false");
    panel.classList.remove("is-open");

    setTimeout(function () {
      if (button.getAttribute("aria-expanded") === "false") {
        panel.setAttribute("hidden", "hidden");
      }
    }, ANIMATION_DURATION);
  }

  function openAccordion(button, panel) {
    button.setAttribute("aria-expanded", "true");
    panel.removeAttribute("hidden");

    // Use requestAnimationFrame for smooth opening animation
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        panel.classList.add("is-open");
      });
    });
  }

  function closeAll(except) {
    triggers.forEach(function (button) {
      if (button === except) return;
      var isExpanded = button.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        var panelId = button.getAttribute("aria-controls");
        var panel = document.getElementById(panelId);
        if (panel) {
          closeAccordion(button, panel);
        }
      }
    });
  }

  triggers.forEach(function (button) {
    button.addEventListener("click", function () {
      var isExpanded = button.getAttribute("aria-expanded") === "true";
      var panelId = button.getAttribute("aria-controls");
      var panel = document.getElementById(panelId);
      if (!panel) return;

      // Close all other accordions first
      closeAll(button);

      if (isExpanded) {
        closeAccordion(button, panel);
      } else {
        openAccordion(button, panel);
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

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("[data-faq-section]");
  if (!section) return;

  const ANIMATION_DURATION = 400;
  const tabs = section.querySelectorAll("[data-faq-tab]");
  const panels = section.querySelectorAll("[data-faq-panel]");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.faqTab;

      tabs.forEach(t => {
        const isActive = t === tab;
        t.classList.toggle("is-active", isActive);
        t.setAttribute("aria-selected", String(isActive));
      });

      panels.forEach(panel => {
        const active = panel.dataset.faqPanel === target;
        panel.hidden = !active;
        panel.classList.toggle("is-active", active);
      });
    });
  });

  section.querySelectorAll("[data-faq-item]").forEach(item => {
    const trigger = item.querySelector("[data-faq-trigger]");
    const answer = item.querySelector("[data-faq-answer]");
    if (!trigger || !answer) return;

    const tabKey = item.dataset.faqTabItem;

    function closeItem(targetItem) {
      const t = targetItem.querySelector("[data-faq-trigger]");
      const a = targetItem.querySelector("[data-faq-answer]");
      if (!t || !a) return;

      t.setAttribute("aria-expanded", "false");
      a.classList.remove("is-open");

      setTimeout(() => {
        if (t.getAttribute("aria-expanded") === "false") {
          a.setAttribute("hidden", "hidden");
        }
      }, ANIMATION_DURATION);
    }

    function openItem(targetItem) {
      const t = targetItem.querySelector("[data-faq-trigger]");
      const a = targetItem.querySelector("[data-faq-answer]");
      if (!t || !a) return;

      t.setAttribute("aria-expanded", "true");
      a.removeAttribute("hidden");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          a.classList.add("is-open");
        });
      });
    }

    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";

      // Close other items within the same tab group
      section.querySelectorAll("[data-faq-item]").forEach(other => {
        if (other === item) return;
        if (other.dataset.faqTabItem !== tabKey) return;
        closeItem(other);
      });

      if (isExpanded) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        trigger.click();
      }
    });

    // Initial state: sync CSS classes with aria/hidden
    const initiallyExpanded = trigger.getAttribute("aria-expanded") === "true";
    const isHidden = answer.hasAttribute("hidden");

    if (initiallyExpanded && !isHidden) {
      answer.classList.add("is-open");
    } else {
      trigger.setAttribute("aria-expanded", "false");
      answer.classList.remove("is-open");
      answer.setAttribute("hidden", "hidden");
    }
  });

  // Ensure only the active panel is visible on load
  const activeTab = Array.from(tabs).find(t => t.classList.contains("is-active")) || tabs[0];
  if (activeTab) {
    const target = activeTab.dataset.faqTab;

    tabs.forEach(t => {
      const isActive = t === activeTab;
      t.classList.toggle("is-active", isActive);
      t.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach(panel => {
      const active = panel.dataset.faqPanel === target;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
  }
});

// ====================
// Product Sticky Bottom Bar - Optimized Scroll Behavior
// ====================
// Manages sticky bar visibility with the following behavior:
// 1. Initially hidden at page load
// 2. Becomes visible once .product-mini-card__add-btn is scrolled into view or passed
// 3. Hides when footer (footerId) comes into view to avoid overlapping
// 4. Reappears when user scrolls back up to the trigger section
// 
// Performance optimizations:
// - Uses IntersectionObserver for efficient visibility detection
// - Uses requestAnimationFrame for smooth, jank-free updates
// - Prevents layout shifts and flicker with proper state management
// - Handles edge cases: small viewports, resize, dynamic content

(function () {
  const stickyBar = document.getElementById("productStickyBar");
  const footer = document.getElementById("footerId");
  const triggerElement = document.querySelector(".product-mini-card__add-btn");

  if (!stickyBar) {
    return;
  }

  // State management
  let isFooterVisible = false;
  let hasTriggerBeenPassed = false; // Tracks if trigger has been scrolled past
  let isTriggerCurrentlyVisible = false; // Tracks current trigger visibility
  let rafScheduled = false; // Prevents multiple RAF calls

  // Initialize sticky bar as hidden (as per requirements)
  stickyBar.classList.remove("visible");
  stickyBar.classList.add("hide");

  // Check initial scroll position to determine if trigger has already been passed
  const checkInitialTriggerState = () => {
    if (!triggerElement) {
      return;
    }

    const triggerRect = triggerElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // If trigger's top is above viewport, it has been passed
    if (triggerRect.top < 0) {
      hasTriggerBeenPassed = true;
      isTriggerCurrentlyVisible = false;
    } else if (triggerRect.top < viewportHeight && triggerRect.bottom > 0) {
      // Trigger is currently visible
      hasTriggerBeenPassed = true;
      isTriggerCurrentlyVisible = true;
    } else {
      // Trigger is below viewport, not yet reached
      hasTriggerBeenPassed = false;
      isTriggerCurrentlyVisible = false;
    }
  };

  // Check initial state
  checkInitialTriggerState();

  // Optimized visibility toggle function
  // Uses requestAnimationFrame to batch DOM updates and prevent layout shifts
  const updateStickyBarVisibility = () => {
    // Prevent multiple simultaneous RAF calls
    if (rafScheduled) {
      return;
    }

    rafScheduled = true;
    window.requestAnimationFrame(() => {
      rafScheduled = false;

      // Priority 1: Hide if footer is visible (highest priority)
      if (isFooterVisible) {
        stickyBar.classList.remove("visible");
        stickyBar.classList.add("hide");
        return;
      }

      // Priority 2: Show if trigger has been passed (scrolled into view or past)
      // This handles both scrolling down past trigger and scrolling back up to trigger
      if (hasTriggerBeenPassed) {
        stickyBar.classList.add("visible");
        stickyBar.classList.remove("hide");
        return;
      }

      // Priority 3: Keep hidden if trigger hasn't been reached yet
      stickyBar.classList.remove("visible");
      stickyBar.classList.add("hide");
    });
  };

  // IntersectionObserver configuration for trigger element
  // Using multiple thresholds for better detection of entry/exit
  const triggerObserverOptions = {
    root: null, // viewport
    rootMargin: "0px",
    threshold: [0, 0.1, 1] // Multiple thresholds for better detection
  };

  // Observer callback for trigger element
  // Tracks both visibility and whether trigger has been passed
  const triggerObserverCallback = (entries) => {
    entries.forEach((entry) => {
      isTriggerCurrentlyVisible = entry.isIntersecting;
      
      // Once trigger enters viewport, mark it as passed
      // This ensures bar stays visible even after scrolling past trigger
      if (entry.isIntersecting) {
        hasTriggerBeenPassed = true;
      } else {
        // When trigger leaves viewport, check if it was scrolled past (upward)
        // If trigger's top is above viewport, it was scrolled past downward
        const triggerRect = triggerElement.getBoundingClientRect();
        if (triggerRect.top < 0) {
          hasTriggerBeenPassed = true; // Scrolled past downward
        } else {
          // Trigger is below viewport - only mark as not passed if we're at the top
          // This handles edge case where page loads with trigger below viewport
          if (window.scrollY === 0) {
            hasTriggerBeenPassed = false;
          }
        }
      }
      
      updateStickyBarVisibility();
    });
  };

  // IntersectionObserver configuration for footer
  // Using small threshold to detect footer as soon as it enters viewport
  const footerObserverOptions = {
    root: null, // viewport
    rootMargin: "0px",
    threshold: 0.01 // Trigger when 1% of footer is visible
  };

  // Observer callback for footer
  const footerObserverCallback = (entries) => {
    entries.forEach((entry) => {
      isFooterVisible = entry.isIntersecting;
      updateStickyBarVisibility();
    });
  };

  // Create observers
  const triggerObserver = new IntersectionObserver(triggerObserverCallback, triggerObserverOptions);
  const footerObserver = new IntersectionObserver(footerObserverCallback, footerObserverOptions);

  // Start observing elements if they exist
  if (triggerElement) {
    triggerObserver.observe(triggerElement);
    // Initial update based on current state
    updateStickyBarVisibility();
  }

  if (footer) {
    footerObserver.observe(footer);
  } else {
    // Fallback: If footer doesn't exist at initialization, use scroll-based detection
    // This handles dynamic content loading scenarios
    let ticking = false;
    const checkFooterPosition = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const footerElement = document.getElementById("footerId");
          if (footerElement) {
            // Try to observe it if it now exists
            footerObserver.observe(footerElement);
            const footerRect = footerElement.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            // Consider footer visible if its top edge is within viewport
            isFooterVisible = footerRect.top < viewportHeight;
            updateStickyBarVisibility();
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", checkFooterPosition, { passive: true });
    checkFooterPosition(); // Initial check
  }

  // Handle resize events with debouncing
  // Recalculates state on viewport size changes (handles mobile rotation, etc.)
  let resizeTimeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Recheck initial trigger state in case layout changed
      checkInitialTriggerState();
      updateStickyBarVisibility();
    }, 150);
  };

  window.addEventListener("resize", handleResize, { passive: true });

  // Handle dynamic content loading
  // Rechecks trigger state after a short delay to account for lazy-loaded content
  // This ensures the sticky bar works correctly even if page height changes
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => {
        checkInitialTriggerState();
        updateStickyBarVisibility();
      }, 100);
    });
  } else {
    // DOM already loaded, check after a short delay for any dynamic content
    setTimeout(() => {
      checkInitialTriggerState();
      updateStickyBarVisibility();
    }, 100);
  }

  // Cleanup function (optional, but good practice)
  // Can be called if needed for cleanup, though in this case observers
  // will be garbage collected when the IIFE scope ends
  return {
    destroy: () => {
      triggerObserver.disconnect();
      footerObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    }
  };
})();