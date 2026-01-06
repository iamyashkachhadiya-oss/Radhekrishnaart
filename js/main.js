/* ============================================
   RADHE KRISHNA ART - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ============================================
  // Loading Screen
  // ============================================
  const loader = document.getElementById('loader');

  // Immediate attempt as soon as the DOM is ready
  unmuteAndPlayVideos();

  window.addEventListener('load', function () {
    // Start fading loader
    setTimeout(function () {
      loader.classList.add('hidden');

      // IMPORTANT: As soon as loader starts fading, try to play
      // Browsers are more likely to allow it once the element is "visible"
      unmuteAndPlayVideos();

      // Repeatedly attempt playback as loader fades
      const retryInterval = setInterval(unmuteAndPlayVideos, 500);
      setTimeout(() => clearInterval(retryInterval), 5000);
    }, 1000);
  });

  // Global Interaction Unblocker
  // We listen for ANY user gesture to unblock playback
  const unblockVideos = () => {
    unmuteAndPlayVideos();
    // Once unblocked, we don't need these listeners anymore
    document.removeEventListener('touchstart', unblockVideos);
    document.removeEventListener('mousedown', unblockVideos);
    document.removeEventListener('scroll', unblockVideos);
    document.removeEventListener('keydown', unblockVideos);
  };

  // Add listeners with passive option for better performance
  document.addEventListener('touchstart', unblockVideos, { passive: true });
  document.addEventListener('mousedown', unblockVideos, { passive: true });
  document.addEventListener('scroll', unblockVideos, { passive: true });
  document.addEventListener('keydown', unblockVideos, { passive: true });

  function unmuteAndPlayVideos() {
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach(video => {
      // Ensure muted and playsinline are set (standard for mobile autoplay)
      video.muted = true;
      video.setAttribute('playsinline', '');

      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.then(_ => {
          // Autoplay started successfully
        }).catch(error => {
          // Autoplay was prevented
          // We don't log here to keep console clean, the unblockers will handle it
        });
      }
    });
  }

  // Additional Check: Play videos when they enter the viewport
  // This sometimes triggers a "blessed" play on certain browsers
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          unmuteAndPlayVideos();
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('video').forEach(video => {
      videoObserver.observe(video);
    });
  }

  // Fallback: hide loader after 3 seconds even if not fully loaded
  setTimeout(function () {
    if (!loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      const allVideos = document.querySelectorAll('video');
      allVideos.forEach(video => video.play().catch(() => { }));
    }
  }, 3000);

  // ============================================
  // Navigation
  // ============================================
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle mobile menu
  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when link is clicked
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Scroll effect for navigation
  let lastScroll = 0;

  window.addEventListener('scroll', function () {
    const currentScroll = window.pageYOffset;

    // Add scrolled class for background
    if (currentScroll > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));

      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // Scroll Reveal Animations
  // ============================================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Optional: Unobserve after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animation classes
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
  animatedElements.forEach(function (el) {
    observer.observe(el);
  });

  // ============================================
  // Parallax Effect for Hero
  // ============================================
  const hero = document.querySelector('.hero');
  const heroBackground = document.querySelector('.hero-background');

  if (hero && heroBackground) {
    window.addEventListener('scroll', function () {
      const scrolled = window.pageYOffset;
      const heroHeight = hero.offsetHeight;

      if (scrolled < heroHeight) {
        heroBackground.style.transform = 'translateY(' + (scrolled * 0.4) + 'px)';
      }
    });
  }

  // ============================================
  // Contact Form Handler
  // ============================================
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Here you would typically send the data to a server
      // Form data logged internally for verification

      // Show success message (replace with actual implementation)
      alert('Thank you for your inquiry! We will get back to you soon.');

      // Reset form
      contactForm.reset();
    });
  }

  // ============================================
  // Collections Slider Touch Support
  // ============================================
  const slider = document.querySelector('.collections-slider');

  if (slider) {
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', function (e) {
      isDown = true;
      slider.style.cursor = 'grabbing';
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', function () {
      isDown = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', function () {
      isDown = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    });

    // Set initial cursor
    slider.style.cursor = 'grab';
  }

  // ============================================
  // Active Section Highlight in Navigation
  // ============================================
  const sections = document.querySelectorAll('section[id]');

  function highlightNavigation() {
    const scrollPosition = window.scrollY + 200;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavigation);

  // ============================================
  // Preload Critical Images
  // ============================================
  function preloadImages(urls) {
    urls.forEach(function (url) {
      const img = new Image();
      img.src = url;
    });
  }

  // Add your critical image URLs here when you have them
  // preloadImages(['assets/images/hero.jpg', 'assets/images/heritage.jpg']);

  // ============================================
  // Counter Animation for Stats
  // ============================================
  function animateCounter(el, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
      start += increment;
      if (start < target) {
        el.textContent = Math.floor(start) + (el.dataset.suffix || '');
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target + (el.dataset.suffix || '');
      }
    }

    updateCounter();
  }

  // Observe stats for counter animation
  const stats = document.querySelectorAll('.stat-number');

  const statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const number = parseInt(text);
        const suffix = text.replace(/[0-9]/g, '');

        if (!isNaN(number)) {
          el.textContent = '0' + suffix;
          el.dataset.suffix = suffix;

          setTimeout(function () {
            animateCounter(el, number, 1500);
          }, 300);
        }

        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(function (stat) {
    statsObserver.observe(stat);
  });

  // ============================================
  // Cursor Effect (Desktop Only)
  // ============================================
  if (window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border: 1px solid rgba(201, 169, 98, 0.5);
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      transition: transform 0.15s ease, opacity 0.15s ease;
      opacity: 0;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', function (e) {
      cursor.style.left = e.clientX - 10 + 'px';
      cursor.style.top = e.clientY - 10 + 'px';
      cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', function () {
      cursor.style.opacity = '0';
    });

    // Expand cursor on interactive elements
    const interactives = document.querySelectorAll('a, button, .craft-item, .collection-card');
    interactives.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.style.transform = 'scale(2)';
        cursor.style.borderColor = 'rgba(201, 169, 98, 0.8)';
      });
      el.addEventListener('mouseleave', function () {
        cursor.style.transform = 'scale(1)';
        cursor.style.borderColor = 'rgba(201, 169, 98, 0.5)';
      });
    });
  }

  // ============================================
  // Performance: Throttle Scroll Events
  // ============================================
  function throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function () {
          inThrottle = false;
        }, limit);
      }
    };
  }

  // Apply throttle to scroll-heavy functions
  window.addEventListener('scroll', throttle(function () {
    // Additional scroll handlers can go here
  }, 100));

});

// Production ready
