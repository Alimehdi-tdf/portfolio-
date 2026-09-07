/**
 * ==========================================================================
 * SYED ALI MEHDI (I M MEHDI) - PORTFOLIO JAVASCRIPT (script.js)
 * Features:
 * 1. Dark / Light Theme Toggle Switch (Persistent with localStorage)
 * 2. Smooth Scroll with Dynamic Sticky Navbar Offset
 * 3. Mobile Hamburger Menu Drawer (Accessible & Animated)
 * 4. Fade-In & Slide-Up Animations on Scroll (Intersection Observer)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       FEATURE 1: DARK / LIGHT THEME TOGGLE SWITCH
       - Default: Dark (Neon Navy Blue & White)
       - Light: Neon Golden & Crisp White
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const themeLabel = document.getElementById('theme-label');
    const htmlElement = document.documentElement;

    // LocalStorage se saved theme lena (Default: 'dark')
    const savedTheme = localStorage.getItem('mehdi_portfolio_theme') || 'dark';

    // Theme apply karne ka function
    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('mehdi_portfolio_theme', theme);

        if (theme === 'light') {
            if (themeIcon) {
                themeIcon.innerHTML = `<svg class="theme-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
            }
            if (themeLabel) themeLabel.textContent = 'Light';
        } else {
            if (themeIcon) {
                themeIcon.innerHTML = `<svg class="theme-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
            }
            if (themeLabel) themeLabel.textContent = 'Dark';
        }
    }

    // Initial theme set karna
    applyTheme(savedTheme);

    // Toggle button click listener
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }


    /* ==========================================================================
       FEATURE 2: MOBILE HAMBURGER MENU
       ========================================================================== */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');
    const navIconItems = document.querySelectorAll('.nav-icon-link, .nav-link');

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
            hamburgerBtn.setAttribute('aria-expanded', isOpen);
        });

        // Close drawer when any nav link is tapped on mobile
        navIconItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburgerBtn.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (event) => {
            if (!navLinks.contains(event.target) && !hamburgerBtn.contains(event.target)) {
                navLinks.classList.remove('active');
                hamburgerBtn.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }


    /* ==========================================================================
       FEATURE 3: SMOOTH SCROLL (Sticky Header Offset + Active Nav Tracking)
       - Handles icon navbar, clickable skill tags, CTA buttons & brand logo
       ========================================================================== */
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    function setActiveIconLink(targetId) {
        if (!targetId || targetId === '#') return;
        navIconItems.forEach(nav => {
            if (nav.getAttribute('href') === targetId) {
                nav.classList.add('active');
            } else {
                nav.classList.remove('active');
            }
        });
    }

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                e.preventDefault();

                // Sticky navbar dynamic height
                const header = document.getElementById('site-header');
                const headerHeight = header ? header.offsetHeight : 70;

                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight + 2;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                setActiveIconLink(targetId);

                // If mobile drawer open, close it
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (hamburgerBtn) {
                        hamburgerBtn.classList.remove('active');
                        hamburgerBtn.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        });
    });


    /* ==========================================================================
       FEATURE 4: SCROLLSPY (Highlight active icon in navbar while scrolling)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id], header[id]');
    
    window.addEventListener('scroll', () => {
        const header = document.getElementById('site-header');
        const headerHeight = header ? header.offsetHeight : 70;
        const scrollPosition = window.pageYOffset + headerHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = `#${section.getAttribute('id')}`;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                setActiveIconLink(sectionId);
            }
        });
    }, { passive: true });


    /* ==========================================================================
       FEATURE 5: FADE-IN & SLIDE-UP ANIMATIONS (Scroll Reveal)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        };

        const revealOptions = {
            root: null,
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        };

        const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(element => {
            element.classList.add('active');
        });
    }

});


/* ==========================================================================
   FEATURE 6: SUBTLE TRAILING NEON AURA
   - Normal system mouse is fully visible and unrestrained
   - Small glowing circle follows mouse with smooth spring delay
   - Expands and becomes more transparent when hovering <a>, <button>
   - Completely disabled on touch / mobile devices for battery optimization
   ========================================================================== */
(function () {
    // Battery & CPU optimization: skip completely on touch / mobile devices
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches ||
                          window.matchMedia('(hover: none)').matches ||
                          window.matchMedia('(max-width: 768px)').matches ||
                          'ontouchstart' in window ||
                          navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const aura = document.getElementById('cursor-trailing-aura');
    if (!aura) return;

    let mouseX = -100, mouseY = -100;
    let auraX = -100, auraY = -100;
    let hasMoved = false;

    // Smooth spring trailing factor (subtle fluid follow)
    const springFactor = 0.15;

    // Mouse movement listener (passive for high performance)
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!hasMoved) {
            auraX = mouseX;
            auraY = mouseY;
            aura.style.left = auraX + 'px';
            aura.style.top = auraY + 'px';
            aura.style.opacity = '1';
            hasMoved = true;
        }
    }, { passive: true });

    // Handle cursor leaving & entering viewport
    document.addEventListener('mouseleave', () => {
        aura.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        if (hasMoved) {
            aura.style.opacity = '1';
        }
    });

    // 60 FPS Render Loop: Spring animation
    function renderAura() {
        if (hasMoved) {
            auraX += (mouseX - auraX) * springFactor;
            auraY += (mouseY - auraY) * springFactor;
            aura.style.left = auraX + 'px';
            aura.style.top = auraY + 'px';
        }
        requestAnimationFrame(renderAura);
    }
    requestAnimationFrame(renderAura);

    // Detect hover on clickable links, buttons, and interactive elements
    const clickableSelectors = 'a, button, [role="button"], input[type="submit"], input[type="button"], select, textarea, input, label, .clickable-tag, .pill-chip, .social-btn, .nav-icon-link, .theme-toggle-btn, .service-card-icon, .pe-stat-icon';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(clickableSelectors)) {
            aura.classList.add('is-hovered');
        }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(clickableSelectors)) {
            aura.classList.remove('is-hovered');
        }
    }, { passive: true });
})();


/* ==========================================================================
   FEATURE 7: INTERACTIVE FLUCTUATING MATRIX - MOUSE AURA GLOW
   - Smooth 60 FPS mouse-tracking aura glow positioned behind the geometric grid
   - Soft 400px radial gradient illuminates grid intersections from behind
   - Uses requestAnimationFrame lerp momentum for liquid 3D depth
   - Completely disabled on touch / mobile devices for battery & CPU optimization
   ========================================================================== */
(function () {
    // Battery optimization: skip completely on touch / mobile devices
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches ||
                          window.matchMedia('(hover: none)').matches ||
                          window.matchMedia('(max-width: 768px)').matches ||
                          'ontouchstart' in window ||
                          navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const mouseGlow = document.getElementById('matrix-mouse-glow');
    if (!mouseGlow) return;

    let targetX = -500, targetY = -500;
    let currentX = -500, currentY = -500;
    let isVisible = false;
    const lerpSpeed = 0.08; // Smooth, soft ambient floating momentum

    // Track mouse coordinates (passive listener for optimal performance)
    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;

        if (!isVisible) {
            currentX = targetX;
            currentY = targetY;
            mouseGlow.style.left = currentX + 'px';
            mouseGlow.style.top = currentY + 'px';
            mouseGlow.style.opacity = '1';
            isVisible = true;
        }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        mouseGlow.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        if (isVisible) {
            mouseGlow.style.opacity = '1';
        }
    });

    // 60 FPS Render Loop via requestAnimationFrame
    function renderMatrixGlow() {
        if (isVisible) {
            currentX += (targetX - currentX) * lerpSpeed;
            currentY += (targetY - currentY) * lerpSpeed;
            mouseGlow.style.left = currentX + 'px';
            mouseGlow.style.top = currentY + 'px';
        }
        requestAnimationFrame(renderMatrixGlow);
    }
    requestAnimationFrame(renderMatrixGlow);
})();

