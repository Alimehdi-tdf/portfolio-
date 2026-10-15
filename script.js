/**
 * ==========================================================================
 * MEHDI PORTFOLIO — PREMIUM JAVASCRIPT
 * Features:
 * 1. Typewriter Effect (Type + Erase Loop)
 * 2. Custom Interactive Cursor (Dot + Ring)
 * 3. Hero Mouse-Glow Tracking
 * 4. Scroll Reveal Animations (Intersection Observer)
 * 5. Floating Right-Side Navigation (Smooth Scroll + ScrollSpy)
 * 8. Magnetic Button Hover Effect
 * 9. Skill Bar Animation on Scroll
 * 10. Counter Animation (About Stats)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // Global Device Detection (Available to all modules)
    const isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
                          window.matchMedia('(pointer: coarse)').matches;

    /* ==========================================================================
       1. TYPEWRITER EFFECT
       - Types each phrase, pauses, erases, then types the next
       ========================================================================== */
    const typewriterEl = document.getElementById('typewriter-text');
    const phrases = [
        'I AM MEHDI',
        "I'M MEHDI"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const TYPING_SPEED = 95;
    const DELETING_SPEED = 45;
    const PAUSE_AFTER_TYPE = 2400;
    const PAUSE_AFTER_DELETE = 450;

    function renderTypewriter(phrase, len) {
        if (len <= 0) return '';
        const text = phrase.substring(0, len);
        const nameIdx = phrase.indexOf('MEHDI');
        if (nameIdx === -1 || len <= nameIdx) {
            return `<span class="hero__name-first">${text}</span>`;
        } else {
            const prefix = text.substring(0, nameIdx);
            const name = text.substring(nameIdx);
            return `<span class="hero__name-first">${prefix}</span><span class="hero__name-last">${name}</span>`;
        }
    }

    function typewriterTick() {
        if (!typewriterEl) return;

        const currentPhrase = phrases[phraseIndex];

        if (!isDeleting) {
            // Typing
            charIndex++;
            typewriterEl.innerHTML = renderTypewriter(currentPhrase, charIndex);

            if (charIndex === currentPhrase.length) {
                // Finished typing — pause, then start deleting
                isDeleting = true;
                setTimeout(typewriterTick, PAUSE_AFTER_TYPE);
                return;
            }
            setTimeout(typewriterTick, TYPING_SPEED);
        } else {
            // Deleting
            charIndex--;
            typewriterEl.innerHTML = renderTypewriter(currentPhrase, charIndex);

            if (charIndex === 0) {
                // Finished deleting — move to next phrase
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(typewriterTick, PAUSE_AFTER_DELETE);
                return;
            }
            setTimeout(typewriterTick, DELETING_SPEED);
        }
    }

    // Start typewriter with a slight initial delay
    setTimeout(typewriterTick, 400);


    /* ==========================================================================
       2. CUSTOM INTERACTIVE CURSOR
       - Small dot follows mouse precisely
       - Larger ring follows with smooth spring delay
       - Both expand on hovering interactive elements
       - Disabled on touch/mobile devices
       ========================================================================== */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    if (!isTouchDevice && cursorDot && cursorRing) {
        let mouseX = -100, mouseY = -100;
        let ringX = -100, ringY = -100;
        const ringSpring = 0.18;
        let cursorInitialized = false;
        let ringRaf = null;

        function animateRing() {
            if (cursorInitialized) {
                const dx = mouseX - ringX;
                const dy = mouseY - ringY;
                ringX += dx * ringSpring;
                ringY += dy * ringSpring;
                cursorRing.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0) translate(-50%, -50%)`;
                if (Math.abs(dx) > 0.15 || Math.abs(dy) > 0.15) {
                    ringRaf = requestAnimationFrame(animateRing);
                    return;
                }
            }
            ringRaf = null;
        }

        function updateCursorPositions(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!cursorInitialized) {
                cursorInitialized = true;
                ringX = mouseX;
                ringY = mouseY;
                cursorDot.style.display = 'block';
                cursorRing.style.display = 'block';
            }
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
            cursorDot.style.opacity = '1';
            cursorRing.style.opacity = '1';
            if (!ringRaf) {
                ringRaf = requestAnimationFrame(animateRing);
            }
        }

        window.addEventListener('mousemove', updateCursorPositions, { passive: true });

        // Click / Drag states
        window.addEventListener('mousedown', () => {
            cursorDot.classList.add('is-clicking');
            cursorRing.classList.add('is-clicking');
        });
        window.addEventListener('mouseup', () => {
            cursorDot.classList.remove('is-clicking');
            cursorRing.classList.remove('is-clicking');
        });

        // Hide on leave / restore on enter
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorRing.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            if (cursorInitialized) {
                cursorDot.style.opacity = '1';
                cursorRing.style.opacity = '1';
            }
        });

        // Hover detection for interactive elements
        const hoverTargets = 'a, button, [role="button"], input, textarea, select, label, .magnetic-btn, .skill-tag, .contact__social-link, .nav__link, .cert-card, .timeline__item, .service-card, .portfolio-card, .brand-letter, .site-header__icon-btn, .float-nav__btn';

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverTargets)) {
                cursorDot.classList.add('is-hovering');
                cursorRing.classList.add('is-hovering');
            }
        }, { passive: true });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverTargets)) {
                cursorDot.classList.remove('is-hovering');
                cursorRing.classList.remove('is-hovering');
            }
        }, { passive: true });
    }

    /* ==========================================================================
       3. HERO MOUSE-GLOW TRACKING
       - Large radial glow follows mouse in the hero section
       - Creates an interactive lighting effect on the grid
       ========================================================================== */
    const heroSection = document.getElementById('hero');
    const heroGlow = document.getElementById('hero-mouse-glow');

    if (!isTouchDevice && heroSection && heroGlow) {
        let glowTargetX = -500, glowTargetY = -500;
        let glowX = -500, glowY = -500;
        let glowVisible = false;
        const glowLerp = 0.06;

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            glowTargetX = e.clientX - rect.left;
            glowTargetY = e.clientY - rect.top;

            if (!glowVisible) {
                glowX = glowTargetX;
                glowY = glowTargetY;
                heroGlow.style.opacity = '1';
                glowVisible = true;
            }
            if (!glowRaf) {
                glowRaf = requestAnimationFrame(renderGlow);
            }
        }, { passive: true });

        heroSection.addEventListener('mouseleave', () => {
            heroGlow.style.opacity = '0';
            glowVisible = false;
            if (glowRaf) { cancelAnimationFrame(glowRaf); glowRaf = null; }
        });

        let glowRaf = null;
        function renderGlow() {
            if (!glowVisible) {
                glowRaf = null;
                return;
            }
            const dx = glowTargetX - glowX;
            const dy = glowTargetY - glowY;
            glowX += dx * glowLerp;
            glowY += dy * glowLerp;
            heroGlow.style.transform = `translate3d(${glowX.toFixed(1)}px, ${glowY.toFixed(1)}px, 0) translate(-50%, -50%)`;
            if (Math.abs(dx) > 0.2 || Math.abs(dy) > 0.2) {
                glowRaf = requestAnimationFrame(renderGlow);
            } else {
                glowRaf = null;
            }
        }
    }


    /* ==========================================================================
       4. BIDIRECTIONAL SCROLL REVEAL OBSERVER (APPEAR & DISAPPEAR ON SCROLL UP/DOWN)
       - Runs seamlessly on both Desktop & Mobile (iOS / Android / Touch / PC)
       - Fully bidirectional: elements smoothly appear when scrolled into view,
         disappear when scrolled out of view, and re-animate whenever user scrolls up or down!
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal, .section__header');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active', 'is-visible');
                } else {
                    // Element moved out of viewport (scrolled past up or down):
                    // remove active classes so it disappears and smoothly re-animates when user scrolls back!
                    entry.target.classList.remove('active', 'is-visible');
                }
            });
        }, {
            root: null,
            threshold: 0.08,
            rootMargin: '0px 0px -25px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active', 'is-visible'));
    }

    /* ==========================================================================
       ACTIVE SCROLL GPU ACCELERATOR
       - Adds .is-scrolling class to body during active scrolling
       - Pauses secondary keyframes and offloads GPU during scroll on laptops
       ========================================================================== */
    let isScrollingTimer = null;
    window.addEventListener('scroll', () => {
        if (!document.body.classList.contains('is-scrolling')) {
            document.body.classList.add('is-scrolling');
        }
        if (isScrollingTimer) clearTimeout(isScrollingTimer);
        isScrollingTimer = setTimeout(() => {
            document.body.classList.remove('is-scrolling');
        }, 120);
    }, { passive: true });

    /* ==========================================================================
       5. FLOATING RIGHT-SIDE ICON NAVIGATION (Smooth Scroll + ScrollSpy)
       ========================================================================== */
    const floatNavBtns = document.querySelectorAll('.float-nav__btn');
    const sections = document.querySelectorAll('section[id], header[id]');

    // Click handler — smooth scroll
    floatNavBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.pageYOffset - 30;
                window.scrollTo({ top, behavior: 'smooth' });

                floatNavBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // ScrollSpy — Highlights active icon as user scrolls (zero layout reflow)
    let sectionMetrics = [];
    function cacheSectionMetrics() {
        sectionMetrics = Array.from(sections).map(sec => ({
            id: sec.getAttribute('id'),
            top: sec.offsetTop,
            height: sec.offsetHeight
        }));
    }
    cacheSectionMetrics();
    window.addEventListener('resize', cacheSectionMetrics, { passive: true });

    let scrollSpyScheduled = false;
    window.addEventListener('scroll', () => {
        if (!scrollSpyScheduled) {
            scrollSpyScheduled = true;
            requestAnimationFrame(() => {
                scrollSpyScheduled = false;
                if (sectionMetrics.length === 0) cacheSectionMetrics();
                const scrollPos = window.pageYOffset + 240;
                for (let i = 0; i < sectionMetrics.length; i++) {
                    const sm = sectionMetrics[i];
                    if (scrollPos >= sm.top && scrollPos < sm.top + sm.height) {
                        floatNavBtns.forEach(btn => {
                            if (btn.getAttribute('data-section') === sm.id) {
                                if (!btn.classList.contains('active')) btn.classList.add('active');
                            } else {
                                btn.classList.remove('active');
                            }
                        });
                        break;
                    }
                }
            });
        }
    }, { passive: true });

    // Floating Nav Random Wandering vs Hover/Drag Straight-Alignment Controller
    const floatingNavEl = document.getElementById('floating-nav');
    if (floatingNavEl) {
        floatingNavEl.addEventListener('mouseenter', () => {
            floatingNavEl.classList.add('is-aligned');
        });
        floatingNavEl.addEventListener('mouseleave', () => {
            floatingNavEl.classList.remove('is-aligned');
        });

        window.addEventListener('mousemove', (e) => {
            const distanceFromRight = window.innerWidth - e.clientX;
            // When mouse is near or dragging across the right side navigation zone, snap straight
            if (distanceFromRight <= 120 && e.clientY >= 60 && e.clientY <= window.innerHeight - 60) {
                floatingNavEl.classList.add('is-aligned');
            } else if (distanceFromRight > 145) {
                floatingNavEl.classList.remove('is-aligned');
            }
        }, { passive: true });
    }



    /* ==========================================================================
       8. BUTTON INTERACTION (Strict 2D Mode)
       ========================================================================== */
    // Kept flat 2D without magnetic mouse displacement


    /* ==========================================================================
       9. E-COMMERCE HERO-STYLE SKILLS CAROUSEL / SLIDER
       - Tab navigation, arrow controls, pagination dots
       - Mouse drag & touch swipe support
       - Auto-play with pause on hover
       - Active progress bar animation
       ========================================================================== */
    const skillsTrack = document.getElementById('skills-track');
    const skillsContainer = document.getElementById('skills-track-container');
    const skillsSlides = document.querySelectorAll('.skills__slide');
    const skillsTabs = document.querySelectorAll('.skills__tab-btn');
    const skillsDots = document.querySelectorAll('.skills__dot');
    const prevBtn = document.getElementById('skills-prev-btn');
    const nextBtn = document.getElementById('skills-next-btn');
    const counterCurr = document.getElementById('skills-current-num');

    if (skillsTrack && skillsSlides.length) {
        let currentSlide = 0;
        const totalSlides = skillsSlides.length;
        let autoPlayTimer = null;
        const AUTOPLAY_INTERVAL = 4500;

        function goToSlide(index) {
            if (index < 0) {
                currentSlide = totalSlides - 1;
            } else if (index >= totalSlides) {
                currentSlide = 0;
            } else {
                currentSlide = index;
            }

            // Move track
            skillsTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

            // Update Tabs
            skillsTabs.forEach((tab, idx) => {
                const isActive = idx === currentSlide;
                tab.classList.toggle('active', isActive);
                tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            // Update Dots
            skillsDots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentSlide);
            });

            // Update Counter
            if (counterCurr) {
                counterCurr.textContent = String(currentSlide + 1).padStart(2, '0');
            }

            // Animate bar in active slide
            const activeSlide = skillsSlides[currentSlide];
            if (activeSlide) {
                const bar = activeSlide.querySelector('.skill-card__bar-fill');
                if (bar) {
                    const width = bar.getAttribute('data-width') || '90';
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width + '%';
                    }, 80);
                }
            }
        }

        // Arrow buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentSlide - 1);
                resetAutoPlay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentSlide + 1);
                resetAutoPlay();
            });
        }

        // Tab buttons
        skillsTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const slideIdx = parseInt(tab.getAttribute('data-slide'), 10);
                if (!isNaN(slideIdx)) {
                    goToSlide(slideIdx);
                    resetAutoPlay();
                }
            });
        });

        // Dots
        skillsDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const slideIdx = parseInt(dot.getAttribute('data-slide'), 10);
                if (!isNaN(slideIdx)) {
                    goToSlide(slideIdx);
                    resetAutoPlay();
                }
            });
        });

        // Mouse Drag & Touch Swipe
        let isDragging = false;
        let startX = 0;

        function getPositionX(e) {
            return e.type.includes('mouse') ? e.pageX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        }

        function touchStart(e) {
            isDragging = true;
            startX = getPositionX(e);
            stopAutoPlay();
        }

        function touchMove(e) {
            if (!isDragging) return;
            const currentX = getPositionX(e);
            const diff = currentX - startX;
            skillsTrack.style.transform = `translateX(calc(-${currentSlide * 100}% + ${diff}px))`;
        }

        function touchEnd(e) {
            if (!isDragging) return;
            isDragging = false;
            const endX = e.type.includes('mouse') ? e.pageX : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : startX);
            const diff = endX - startX;

            if (diff < -50) {
                goToSlide(currentSlide + 1);
            } else if (diff > 50) {
                goToSlide(currentSlide - 1);
            } else {
                goToSlide(currentSlide);
            }
            startAutoPlay();
        }

        if (skillsContainer) {
            // Mouse events
            skillsContainer.addEventListener('mousedown', touchStart);
            window.addEventListener('mousemove', touchMove);
            window.addEventListener('mouseup', touchEnd);

            // Touch events
            skillsContainer.addEventListener('touchstart', touchStart, { passive: true });
            skillsContainer.addEventListener('touchmove', touchMove, { passive: true });
            skillsContainer.addEventListener('touchend', touchEnd);

            // Hover pause
            skillsContainer.addEventListener('mouseenter', stopAutoPlay);
            skillsContainer.addEventListener('mouseleave', startAutoPlay);
        }

        // Autoplay
        function startAutoPlay() {
            stopAutoPlay();
            autoPlayTimer = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, AUTOPLAY_INTERVAL);
        }

        function stopAutoPlay() {
            if (autoPlayTimer) {
                clearInterval(autoPlayTimer);
                autoPlayTimer = null;
            }
        }

        function resetAutoPlay() {
            stopAutoPlay();
            startAutoPlay();
        }

        startAutoPlay();
        goToSlide(0);
    }


    /* ==========================================================================
       10. ABOUT PORTRAIT STEPPER & DOMAIN CONTROLLER
       - 3 Domains ONLY: Developer, Digital Marketer, Quantitative Trader
       - Interactive horizontal timeline line with 3 glowing clickable dots
       - Clicking a dot updates the progress bar, dot active state, and reveals domain details
       - Synchronizes with the Work Experience section filters
       ========================================================================== */
    const stepperDots = document.querySelectorAll('.about__stepper-dot');
    const stepperProgress = document.getElementById('about-stepper-progress');
    const domainPanel = document.getElementById('about-domain-panel');
    const domainTagEl = document.getElementById('domain-tag');
    const domainTitleEl = document.getElementById('domain-title');
    const domainDescEl = document.getElementById('domain-desc');
    const statYearsEl = document.getElementById('stat-years');
    const statYearsLabel = document.getElementById('stat-years-label');
    const statProjectsEl = document.getElementById('stat-projects');
    const statProjectsLabel = document.getElementById('stat-projects-label');
    const statClientsEl = document.getElementById('stat-clients');
    const statClientsLabel = document.getElementById('stat-clients-label');

    const domainExperienceData = {
        'developer': {
            index: 0,
            progress: '0%',
            tag: 'Specialization 01',
            title: 'Software & Web Developer',
            years: 4,
            yearsSuffix: '+',
            yearsLabel: 'Years Engineering',
            projects: 45,
            projectsSuffix: '+',
            projectsLabel: 'Web Apps Shipped',
            clients: 35,
            clientsSuffix: '+',
            clientsLabel: 'Cloud Deployments',
            desc: 'End-to-end full-stack architectures, high-velocity Python/FastAPI microservices, modern reactive frontends, and resilient cloud deployments.'
        },
        'marketer': {
            index: 1,
            progress: '50%',
            tag: 'Specialization 02',
            title: 'Data-Driven Digital Marketer',
            years: 4,
            yearsSuffix: '+',
            yearsLabel: 'Years in Growth',
            projects: 50,
            projectsSuffix: '+',
            projectsLabel: 'Campaigns Scaled',
            clients: 3.8,
            clientsSuffix: 'x',
            clientsLabel: 'Avg ROAS Generated',
            desc: 'Building high-converting acquisition funnels, data-backed paid ad campaigns (Meta & Google), SEO architectures, and automated customer journeys.'
        },
        'trader': {
            index: 2,
            progress: '100%',
            tag: 'Specialization 03',
            title: 'Quantitative Trader & Analyst',
            years: 3,
            yearsSuffix: '+',
            yearsLabel: 'Years in Markets',
            projects: 88,
            projectsSuffix: '%+',
            projectsLabel: 'Strategy Win-Rate',
            clients: 28,
            clientsSuffix: '+',
            clientsLabel: 'Advised Accounts',
            desc: 'Executing disciplined technical market models, systematic risk-weighted asset positioning, quantitative indicators, and capital growth roadmaps.'
        }
    };

    function animateNumber(element, targetNum, suffix = '+') {
        if (!element) return;
        const isDecimal = !Number.isInteger(targetNum);
        const startNum = 0;
        const duration = 500;
        const startTime = performance.now();

        function updateCounter(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 2); // Ease out quad
            const current = isDecimal
                ? (startNum + (targetNum - startNum) * ease).toFixed(1)
                : Math.round(startNum + (targetNum - startNum) * ease);
            element.textContent = current + suffix;
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = targetNum + suffix;
            }
        }
        requestAnimationFrame(updateCounter);
    }

    function switchExperienceCategory(domainKey, syncExpFilters = false) {
        const data = domainExperienceData[domainKey];
        if (!data) return;

        // 1. Update stepper progress line width
        if (stepperProgress) {
            stepperProgress.style.width = data.progress;
        }

        // 2. Update active dot state
        stepperDots.forEach(dot => {
            const isActive = dot.getAttribute('data-domain') === domainKey;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // 3. Smooth fade transition on details panel
        if (domainPanel) {
            domainPanel.style.opacity = '0.4';
            domainPanel.style.transform = 'translateY(4px)';
        }

        setTimeout(() => {
            if (domainTagEl) domainTagEl.textContent = data.tag;
            if (domainTitleEl) domainTitleEl.textContent = data.title;
            if (domainDescEl) domainDescEl.textContent = data.desc;

            // Animate stats
            animateNumber(statYearsEl, data.years, data.yearsSuffix);
            animateNumber(statProjectsEl, data.projects, data.projectsSuffix);
            animateNumber(statClientsEl, data.clients, data.clientsSuffix);

            if (statYearsLabel) statYearsLabel.textContent = data.yearsLabel;
            if (statProjectsLabel) statProjectsLabel.textContent = data.projectsLabel;
            if (statClientsLabel) statClientsLabel.textContent = data.clientsLabel;

            if (domainPanel) {
                domainPanel.style.opacity = '1';
                domainPanel.style.transform = 'translateY(0)';
            }
        }, 120);

        // 4. Optionally synchronize with Work Experience filters
        if (syncExpFilters) {
            const matchingExpBtn = document.querySelector(`.exp__filter-btn[data-filter="${domainKey}"]`);
            if (matchingExpBtn) matchingExpBtn.click();
        }
    }

    // Attach click listeners to stepper dots
    stepperDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const domain = dot.getAttribute('data-domain');
            switchExperienceCategory(domain, true);
        });
    });

    // IntersectionObserver for initial counter trigger on scroll into view
    const stepperContainer = document.querySelector('.about__stepper-wrapper');
    if ('IntersectionObserver' in window && stepperContainer) {
        let hasAnimatedInitial = false;
        const stepperObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimatedInitial) {
                    hasAnimatedInitial = true;
                    switchExperienceCategory('developer', false);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        stepperObserver.observe(stepperContainer);
    }


    /* ==========================================================================
       11. GLOBAL BACKGROUND (Strict 2D Mode)
       - Kept static without 3D parallax displacement
       ========================================================================== */
    /* ==========================================================================
       12. CERTIFICATE PICTURE LIGHTBOX MODAL
       - Clicking any picture thumbnail opens high-res certificate image preview
       - Supports keyboard access, download/open link, backdrop, or ESC key
       ========================================================================== */
    const certModal = document.getElementById('cert-modal');
    const certModalClose = document.getElementById('cert-modal-close');
    const certModalBackdrop = document.getElementById('cert-modal-backdrop');
    const certThumbs = document.querySelectorAll('.cert-thumb');
    const modalCertImg = document.getElementById('modal-cert-img');
    const modalCertTag = document.getElementById('modal-cert-tag');
    const modalCertTitle = document.getElementById('modal-cert-title');
    const modalCertSub = document.getElementById('modal-cert-sub');
    const modalCertDownload = document.getElementById('modal-cert-download');

    function openCertModal(thumb) {
        if (!certModal) return;

        const imgSrc = thumb.getAttribute('data-cert-img') || 'cert-1.svg';
        const tag = thumb.getAttribute('data-cert-tag') || 'Certificate';
        const title = thumb.getAttribute('data-title') || 'Accredited Credential';
        const issuer = thumb.getAttribute('data-issuer') || 'Accredited Authority';
        const date = thumb.getAttribute('data-date') || '2024';

        if (modalCertImg) {
            modalCertImg.src = imgSrc;
            modalCertImg.alt = `${tag} - ${title}`;
        }
        if (modalCertTag) modalCertTag.textContent = tag;
        if (modalCertTitle) modalCertTitle.textContent = title;
        if (modalCertSub) modalCertSub.textContent = `${issuer} • ${date}`;
        if (modalCertDownload) {
            modalCertDownload.href = imgSrc;
            modalCertDownload.setAttribute('download', `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`);
        }

        certModal.classList.add('active');
        certModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeCertModal() {
        if (!certModal) return;
        certModal.classList.remove('active');
        certModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    certThumbs.forEach(thumb => {
        thumb.addEventListener('click', () => openCertModal(thumb));
        thumb.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openCertModal(thumb);
            }
        });
    });

    if (certModalClose) certModalClose.addEventListener('click', closeCertModal);
    if (certModalBackdrop) certModalBackdrop.addEventListener('click', closeCertModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
            closeCertModal();
        }
    });

    /* ==========================================================================
       13. EXPERIENCE ROLE FILTER
       - Filters experience cards by category with smooth transitions
       ========================================================================== */
    const expFilterBtns = document.querySelectorAll('.exp__filter-btn');
    const expCards = document.querySelectorAll('.exp-card');
    const expGrid = document.getElementById('exp-grid');

    if (expFilterBtns.length > 0 && expCards.length > 0) {
        expFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                expFilterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                const filter = btn.getAttribute('data-filter');
                if (filter && filter !== 'all' && domainExperienceData[filter]) {
                    switchExperienceCategory(filter, false);
                }

                if (expGrid) {
                    expGrid.classList.toggle('is-single-filtered', filter !== 'all');
                }

                expCards.forEach(card => {
                    const categories = card.getAttribute('data-category') || '';
                    if (filter === 'all' || categories.includes(filter)) {
                        card.style.display = 'flex';
                        requestAnimationFrame(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0) scale(1)';
                        });
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(14px) scale(0.98)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 220);
                    }
                });
            });
        });

        // Interactive cursor spotlight tracker on Work Experience Bento cards (desktop only)
        if (!isTouchDevice) {
            expCards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    card.style.setProperty('--mouse-x', `${x}px`);
                    card.style.setProperty('--mouse-y', `${y}px`);
                }, { passive: true });
            });
        }
    }
    /* ==========================================================================
       15. PYTHON FULL-STACK CONTACT API INTEGRATION
       - Intercepts contact form and submits to Python backend (http://127.0.0.1:8000/api/contact)
       - Handles validation, success banners, and state transitions
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Sending message...</span>';
            }

            const formData = {
                name: (document.getElementById('contact-name')?.value || '').trim(),
                email: (document.getElementById('contact-email')?.value || '').trim(),
                subject: (document.getElementById('contact-subject')?.value || 'Portfolio Inquiry').trim(),
                message: (document.getElementById('contact-message')?.value || '').trim()
            };

            const existingAlert = contactForm.querySelector('.contact-alert');
            if (existingAlert) existingAlert.remove();

            const alertDiv = document.createElement('div');
            alertDiv.className = 'contact-alert';
            alertDiv.style.padding = '12px 16px';
            alertDiv.style.marginBottom = '16px';
            alertDiv.style.borderRadius = '8px';
            alertDiv.style.fontSize = '0.9rem';
            alertDiv.style.fontWeight = '500';

            try {
                // Submit to Formspree endpoint or local python endpoint
                const endpoints = ['https://formspree.io/f/mdeowaeg', '/api/contact', 'http://127.0.0.1:8000/api/contact'];
                let res = null;
                for (const url of endpoints) {
                    try {
                        res = await fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify(formData)
                        });
                        if (res.ok) break;
                    } catch (err) {
                        // try next endpoint or fallback to local storage
                    }
                }

                // Also save to localStorage for admin panel inbox
                try {
                    const localInquiries = JSON.parse(localStorage.getItem('portfolio_inquiries') || '[]');
                    localInquiries.unshift({
                        ...formData,
                        date: new Date().toLocaleString()
                    });
                    localStorage.setItem('portfolio_inquiries', JSON.stringify(localInquiries));
                } catch (e) {}

                alertDiv.style.background = 'rgba(192, 192, 192, 0.12)';
                alertDiv.style.color = '#FFFFFF';
                alertDiv.style.border = '1px solid rgba(192, 192, 192, 0.35)';
                alertDiv.innerHTML = `✓ Thank you, ${formData.name || 'there'}! Your message has been sent successfully. I will get back to you shortly.`;
                contactForm.reset();
                showSuccessToast('Message Sent Successfully!', `Thank you, ${formData.name || 'friend'}! Syed Ali Mehdi will get back to you shortly.`);
            } catch (error) {
                alertDiv.style.background = 'rgba(192, 192, 192, 0.12)';
                alertDiv.style.color = '#C0C0C0';
                alertDiv.innerHTML = '✓ Thank you! You can reach Syed Ali Mehdi directly at <a href="mailto:alimehdi3417@gmail.com" style="color: #C0C0C0; text-decoration: underline;">alimehdi3417@gmail.com</a>.';
                contactForm.reset();
            } finally {
                contactForm.prepend(alertDiv);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
                setTimeout(() => {
                    alertDiv.style.transition = 'opacity 0.5s ease';
                    alertDiv.style.opacity = '0';
                    setTimeout(() => alertDiv.remove(), 500);
                }, 6000);
            }
        });
    }


    /* ==========================================================================
       16. INTERACTIVE 360° CIRCULAR SOCIAL MEDIA ORBIT
       - Auto-rotates smoothly when idle
       - Speeds up when dragged by mouse / touch
       - Momentum physics on drag release
       - Keeps icons upright at all times
    /* ==========================================================================
       13. INTERACTIVE 360° CIRCULAR SOCIAL MEDIA HUB (3D Elevated Dial & Dark Embers)
       - Borderless Floating Logos with Monochrome-to-Glow Color Shifting
       - Drag & Push to Spin: Faster drag/push = higher speed ("jitna tez drag utni speed")
       - Continuous smooth deceleration ("automatically speed fast ho and phir slow hojai")
       - 3D Interactive Perspective Parallax & Ambient Ground Shadow
       - Atmospheric "Black Black Chingariyan" (Dark Embers & Sparks) Canvas
       ========================================================================== */
    const socialContainer = document.getElementById('social-circle-container');
    const socialWrapper = document.getElementById('social-circle-wrapper');
    const socialNodes = document.querySelectorAll('.social-orbit-node');
    const emberCanvas = document.getElementById('social-ember-canvas');

    /* --- Part A: Interactive 360° Borderless Kinetic Wheel --- */
    if (socialWrapper && socialNodes.length > 0) {
        let rotationAngle = 0;
        let currentVelocity = 0.32; // Default idle speed (deg/frame)
        let isDragging = false;
        let isHovered = false;
        let lastAngle = 0;
        let lastMoveTime = performance.now();
        let velocitySamples = [];

        const count = socialNodes.length;

        function getAngleFromCenter(e) {
            const rect = socialWrapper.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
        }

        let cachedRadius = 150;
        function updateRadius() {
            if (socialWrapper) {
                const rect = socialWrapper.getBoundingClientRect();
                cachedRadius = Math.max(70, (rect.width / 2) - 34);
            }
        }
        updateRadius();

        function updateNodePositions() {
            const radFactor = Math.PI / 180;
            socialNodes.forEach((node, i) => {
                const baseAngle = (i * (360 / count));
                const totalAngle = (baseAngle + rotationAngle) * radFactor;
                const x = cachedRadius * Math.cos(totalAngle);
                const y = cachedRadius * Math.sin(totalAngle);
                node.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
            });
        }

        let isOrbitVisible = false;
        let orbitRafId = null;

        function runOrbitLoop() {
            if (!isOrbitVisible && !isDragging) {
                orbitRafId = null;
                return;
            }
            if (!isDragging) {
                if (Math.abs(currentVelocity) > 0.32) {
                    rotationAngle += currentVelocity;
                    const friction = Math.abs(currentVelocity) > 12 ? 0.986 : 0.978;
                    currentVelocity *= friction;
                } else {
                    const idleSpeed = isHovered ? 0.12 : 0.32;
                    rotationAngle += (currentVelocity >= 0 ? idleSpeed : -idleSpeed);
                }
                updateNodePositions();
            }
            orbitRafId = requestAnimationFrame(runOrbitLoop);
        }

        let totalAngularDrag = 0;

        // Prevent accidental link opening while spinning the wheel
        socialNodes.forEach(node => {
            node.addEventListener('click', (e) => {
                if (totalAngularDrag > 8) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
        });

        // Pointer down: grab the wheel immediately and illuminate logos
        function onPointerDown(e) {
            isDragging = true;
            totalAngularDrag = 0;
            socialWrapper.classList.add('is-dragging');
            lastAngle = getAngleFromCenter(e);
            lastMoveTime = performance.now();
            velocitySamples = [];
            currentVelocity = 0;
            socialWrapper.style.cursor = 'grabbing';
            if (!orbitRafId) {
                orbitRafId = requestAnimationFrame(runOrbitLoop);
            }
        }

        // Pointer move: track 1:1 angular rotation and store velocity samples
        function onPointerMove(e) {
            if (!isDragging) return;
            const now = performance.now();
            const currentAngle = getAngleFromCenter(e);

            // Compute delta with seamless 180/-180 wrap handling
            let diff = currentAngle - lastAngle;
            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;

            totalAngularDrag += Math.abs(diff);
            rotationAngle += diff;
            lastAngle = currentAngle;

            const dt = Math.max(now - lastMoveTime, 4);
            lastMoveTime = now;

            // Angular velocity (deg/frame normalized to 16.6ms)
            const v = (diff / dt) * 16.6;
            velocitySamples.push({ v, time: now, diff });

            // Keep samples from the last 120ms
            if (velocitySamples.length > 8) velocitySamples.shift();
            velocitySamples = velocitySamples.filter(s => now - s.time <= 120);

            updateNodePositions();
        }

        // Pointer up: fling wheel with kinetic push momentum ("jitna tez drag utni speed")
        function onPointerUp() {
            if (!isDragging) return;
            isDragging = false;
            socialWrapper.classList.remove('is-dragging');
            socialWrapper.style.cursor = 'grab';

            const now = performance.now();
            const recent = velocitySamples.filter(s => now - s.time <= 90);

            if (recent.length > 0) {
                const avgV = recent.reduce((sum, s) => sum + s.v, 0) / recent.length;
                let flingSpeed = avgV * 1.35;
                // Cap between -42 and 42 deg/frame for maximum thrill without visual tearing
                currentVelocity = Math.max(Math.min(flingSpeed, 42), -42);
            }

            // Cruise in last dragged direction if gently released
            if (Math.abs(currentVelocity) < 0.32) {
                const lastDiff = velocitySamples.length > 0 ? velocitySamples[velocitySamples.length - 1].diff : 1;
                currentVelocity = lastDiff >= 0 ? 0.32 : -0.32;
            }

            if (!orbitRafId) {
                orbitRafId = requestAnimationFrame(runOrbitLoop);
            }
        }

        socialWrapper.addEventListener('mousedown', onPointerDown);
        window.addEventListener('mousemove', onPointerMove);
        window.addEventListener('mouseup', onPointerUp);

        socialWrapper.addEventListener('touchstart', onPointerDown, { passive: true });
        window.addEventListener('touchmove', onPointerMove, { passive: true });
        window.addEventListener('touchend', onPointerUp);

        socialWrapper.addEventListener('mouseenter', () => { isHovered = true; });
        socialWrapper.addEventListener('mouseleave', () => { isHovered = false; });

        // Interactive 3D tilt tracking: Mouse hover gently tilts the wheel in 3D perspective
        if (socialContainer && !isTouchDevice) {
            socialContainer.addEventListener('mousemove', (e) => {
                if (isDragging) return;
                const rect = socialWrapper.getBoundingClientRect();
                const mouseX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
                const mouseY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
                const tiltX = Math.max(Math.min(-mouseY * 7, 10), -10);
                const tiltY = Math.max(Math.min(mouseX * 7, 10), -10);
                socialWrapper.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(32px)`;
            });

            socialContainer.addEventListener('mouseleave', () => {
                if (!isDragging) {
                    socialWrapper.style.transform = '';
                }
            });
        }

        // IntersectionObserver: ONLY run wheel rotation loop when #social is in viewport (0% CPU/GPU elsewhere)
        if ('IntersectionObserver' in window && socialContainer) {
            const orbitObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        isOrbitVisible = true;
                        updateRadius();
                        updateNodePositions();
                        if (!orbitRafId) orbitRafId = requestAnimationFrame(runOrbitLoop);
                    } else {
                        isOrbitVisible = false;
                        if (orbitRafId && !isDragging) {
                            cancelAnimationFrame(orbitRafId);
                            orbitRafId = null;
                        }
                    }
                });
            }, { threshold: 0.05 });
            orbitObserver.observe(socialContainer);
        } else {
            isOrbitVisible = true;
            updateRadius();
            updateNodePositions();
            orbitRafId = requestAnimationFrame(runOrbitLoop);
        }

        window.addEventListener('resize', () => {
            updateRadius();
            updateNodePositions();
        }, { passive: true });
    }

    /* --- Part B: Atmospheric Dark Embers ("Black Black Chingariyan") Canvas Engine --- */
    if (emberCanvas) {
        const ctx = emberCanvas.getContext('2d');
        let emberWidth = 0;
        let emberHeight = 0;
        let particles = [];
        let emberAnimId = null;
        let isEmberVisible = true;

        function resizeEmberCanvas() {
            const rect = emberCanvas.getBoundingClientRect();
            emberWidth = rect.width || 460;
            emberHeight = rect.height || 460;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            emberCanvas.width = emberWidth * dpr;
            emberCanvas.height = emberHeight * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        class DarkEmber {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                // Spawn inside ambient circle boundary
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * (emberWidth * 0.46);
                this.x = (emberWidth / 2) + Math.cos(angle) * dist;
                this.y = initial 
                    ? (emberHeight / 2) + Math.sin(angle) * dist 
                    : emberHeight + Math.random() * 20;

                this.size = 1.4 + Math.random() * 2.8;
                this.speedY = -(0.35 + Math.random() * 0.65);
                this.speedX = (Math.random() - 0.5) * 0.35;
                this.waveOffset = Math.random() * Math.PI * 2;
                this.waveSpeed = 0.02 + Math.random() * 0.02;

                // Charcoal / obsidian dark ember shades with subtle dark warmth
                const shades = [
                    { r: 16, g: 14, b: 18 },  // Dark obsidian
                    { r: 24, g: 18, b: 15 },  // Smoky dark cinder
                    { r: 12, g: 12, b: 15 },  // Deep charcoal
                    { r: 35, g: 25, b: 20 }   // Deep warm ash
                ];
                this.shade = shades[Math.floor(Math.random() * shades.length)];
                this.maxAlpha = 0.45 + Math.random() * 0.45;
                this.alpha = initial ? Math.random() * this.maxAlpha : 0;
                this.fadeIn = true;
                this.pulseSpeed = 0.015 + Math.random() * 0.02;
            }

            update() {
                this.waveOffset += this.waveSpeed;
                this.x += this.speedX + Math.sin(this.waveOffset) * 0.4;
                this.y += this.speedY;

                // Gentle pulsing opacity
                if (this.fadeIn) {
                    this.alpha += this.pulseSpeed;
                    if (this.alpha >= this.maxAlpha) this.fadeIn = false;
                } else {
                    this.alpha -= this.pulseSpeed * 0.65;
                    if (this.alpha <= 0.15) this.fadeIn = true;
                }

                // Recycle if drifted out of frame
                if (this.y < -15 || this.x < -15 || this.x > emberWidth + 15) {
                    this.reset(false);
                }
            }

            draw() {
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                
                // Deep dark smoky core
                ctx.fillStyle = `rgba(${this.shade.r}, ${this.shade.g}, ${this.shade.b}, ${this.alpha.toFixed(3)})`;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
                ctx.shadowBlur = 6;
                ctx.fill();

                // Faint inner ember glint on larger particles
                if (this.size > 2.6) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size * 0.45, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(192, 192, 192, ${(this.alpha * 0.40).toFixed(3)})`;
                    ctx.shadowBlur = 2;
                    ctx.fill();
                }
                ctx.restore();
            }
        }

        function initEmbers() {
            resizeEmberCanvas();
            particles = [];
            const particleCount = 42; // Atmospheric density
            for (let i = 0; i < particleCount; i++) {
                particles.push(new DarkEmber());
            }
        }

        function emberAnimationLoop() {
            if (!isEmberVisible) return;
            ctx.clearRect(0, 0, emberWidth, emberHeight);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }

            emberAnimId = requestAnimationFrame(emberAnimationLoop);
        }

        // IntersectionObserver to conserve CPU when section is offscreen
        if ('IntersectionObserver' in window) {
            const emberObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        isEmberVisible = true;
                        if (!emberAnimId) emberAnimationLoop();
                    } else {
                        isEmberVisible = false;
                        if (emberAnimId) {
                            cancelAnimationFrame(emberAnimId);
                            emberAnimId = null;
                        }
                    }
                });
            }, { threshold: 0.1 });

            emberObserver.observe(emberCanvas);
        } else {
            emberAnimationLoop();
        }

        window.addEventListener('resize', () => {
            resizeEmberCanvas();
        }, { passive: true });

        initEmbers();
    }

    

    /* ==========================================================================
       14. HIGH-PERFORMANCE NATIVE SCROLL ENGINE (ZERO LATENCY, ZERO LAG)
       - Native hardware-accelerated smooth scrolling directly on GPU compositor
       - No artificial wheel hijacking or damping lag
       - Instant, silky 120 FPS / 60 FPS response
       ========================================================================== */
    const progressBar = document.getElementById('scroll-progress-bar');

    function updateProgressBar() {
        if (!progressBar) return;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll <= 0) return;
        const pct = (window.pageYOffset / maxScroll) * 100;
        progressBar.style.width = `${Math.min(100, Math.max(0, pct)).toFixed(1)}%`;
    }

    // Silky smooth anchor navigation for internal jump links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const navHeight = 72;
                const targetY = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({
                    top: Math.max(0, targetY),
                    behavior: 'smooth'
                });
            }
        });
    });


    /* ==========================================================================
       14B. ZERO-DELAY CUSTOM SCROLL TRACK & DRAGGABLE LINE ENGINE
       - Hardware-accelerated GPU translate3d positioning (0ms layout latency)
       - Instant real-time tracking without DOM reflow thrashing
       - Butter-smooth 1:1 mouse and touch drag control
       - Click track to glide instantly to target
       ========================================================================== */
    const customScrollTrack = document.getElementById('custom-scroll-track');
    const customScrollLine = document.getElementById('custom-scroll-line');
    const customScrollThumb = document.getElementById('custom-scroll-thumb');
    const customScrollTooltip = document.getElementById('custom-scroll-tooltip');

    if (customScrollTrack && customScrollLine && customScrollThumb) {
        // Disable on touch devices or screens <= 768px to ensure native silky mobile scrolling
        if (isTouchDevice || window.innerWidth <= 768) {
            customScrollTrack.style.display = 'none';
            return;
        }

        let isDraggingTrack = false;
        let dragStartY = 0;
        let dragStartScrollTop = 0;
        let trackHeight = 0;
        let thumbHeight = 46;
        let availableTravel = 1;
        let maxScrollHeight = 1;

        function measureTrackDimensions() {
            trackHeight = customScrollLine.clientHeight || 200;
            thumbHeight = customScrollThumb.clientHeight || 46;
            availableTravel = Math.max(1, trackHeight - thumbHeight);
            maxScrollHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        }

        measureTrackDimensions();
        window.addEventListener('resize', measureTrackDimensions, { passive: true });

        function updateCustomScrollTrack() {
            if (maxScrollHeight <= 1) measureTrackDimensions();
            const currentY = window.pageYOffset;
            const scrollRatio = Math.max(0, Math.min(1, currentY / maxScrollHeight));
            const thumbTop = scrollRatio * availableTravel;

            customScrollThumb.style.transform = `translate3d(-50%, ${thumbTop.toFixed(1)}px, 0)`;
            customScrollTrack.setAttribute('aria-valuenow', Math.round(scrollRatio * 100));

            updateProgressBar();

            if (customScrollTooltip && (customScrollTrack.matches(':hover') || isDraggingTrack)) {
                customScrollTooltip.textContent = `${Math.round(scrollRatio * 100)}%`;
                customScrollTooltip.style.transform = `translate3d(0, ${thumbTop.toFixed(1)}px, 0)`;
            }
        }

        // Single RAF ticket guard for 120 FPS passive scroll tracking
        let scrollTicking = false;
        window.addEventListener('scroll', () => {
            if (!scrollTicking && !isDraggingTrack) {
                scrollTicking = true;
                requestAnimationFrame(() => {
                    updateCustomScrollTrack();
                    scrollTicking = false;
                });
            }
        }, { passive: true });

        // Initial alignment
        requestAnimationFrame(updateCustomScrollTrack);

        // Click anywhere on track to glide smoothly
        customScrollTrack.addEventListener('click', (e) => {
            if (isDraggingTrack) return;
            measureTrackDimensions();
            const rect = customScrollLine.getBoundingClientRect();
            const clickY = e.clientY - rect.top;
            const targetRatio = Math.max(0, Math.min(1, clickY / rect.height));
            const targetY = targetRatio * maxScrollHeight;
            window.scrollTo({ top: targetY, behavior: 'smooth' });
        });

        // Instant Drag Functionality (Zero Delay)
        function startTrackDrag(clientY) {
            isDraggingTrack = true;
            measureTrackDimensions();
            dragStartY = clientY;
            dragStartScrollTop = window.pageYOffset;
            customScrollTrack.classList.add('is-dragging');
            document.body.style.userSelect = 'none';
        }

        function handleTrackDrag(clientY) {
            if (!isDraggingTrack) return;
            const deltaY = clientY - dragStartY;
            const deltaScroll = (deltaY / availableTravel) * maxScrollHeight;
            const newScrollTop = Math.max(0, Math.min(maxScrollHeight, dragStartScrollTop + deltaScroll));

            window.scrollTo(0, newScrollTop);

            const scrollRatio = Math.max(0, Math.min(1, newScrollTop / maxScrollHeight));
            const thumbTop = scrollRatio * availableTravel;
            customScrollThumb.style.transform = `translate3d(-50%, ${thumbTop.toFixed(1)}px, 0)`;
            updateProgressBar();

            if (customScrollTooltip) {
                customScrollTooltip.textContent = `${Math.round(scrollRatio * 100)}%`;
                customScrollTooltip.style.transform = `translate3d(0, ${thumbTop.toFixed(1)}px, 0)`;
            }
        }

        function stopTrackDrag() {
            if (!isDraggingTrack) return;
            isDraggingTrack = false;
            customScrollTrack.classList.remove('is-dragging');
            document.body.style.userSelect = '';
        }

        customScrollThumb.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            startTrackDrag(e.clientY);
        });

        window.addEventListener('mousemove', (e) => {
            if (isDraggingTrack) {
                e.preventDefault();
                handleTrackDrag(e.clientY);
            }
        }, { passive: false });

        window.addEventListener('mouseup', stopTrackDrag);

        customScrollThumb.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                e.stopPropagation();
                startTrackDrag(e.touches[0].clientY);
            }
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (isDraggingTrack && e.touches.length > 0) {
                e.preventDefault();
                handleTrackDrag(e.touches[0].clientY);
            }
        }, { passive: false });

        window.addEventListener('touchend', stopTrackDrag);
    }

    // Interactive Hero & About Section Draggable Scroll Indicators
    function setupSectionScrollIndicator(indicatorId, targetSectionId) {
        const indicator = document.getElementById(indicatorId);
        if (!indicator) return;

        let isDraggingIndicator = false;
        let indicatorStartY = 0;
        let initialScroll = 0;

        function triggerIndicatorScroll(e) {
            if (isDraggingIndicator) return;
            if (e) e.preventDefault();
            const target = document.querySelector(targetSectionId);
            if (target) {
                const navHeight = 72;
                const targetY = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
            }
        }

        indicator.addEventListener('click', triggerIndicatorScroll);
        indicator.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                triggerIndicatorScroll(e);
            }
        });

        const lineInteractive = indicator.querySelector('.hero__scroll-line-interactive, .about__scroll-line-interactive');
        if (!lineInteractive) return;

        function startIndicatorDrag(clientY) {
            isDraggingIndicator = true;
            indicatorStartY = clientY;
            initialScroll = window.pageYOffset;
            lineInteractive.classList.add('is-dragging');
            document.body.style.userSelect = 'none';
        }

        function handleIndicatorDrag(clientY) {
            if (!isDraggingIndicator) return;
            const deltaY = clientY - indicatorStartY;
            const newScroll = Math.max(0, initialScroll + deltaY * 2.8);
            window.scrollTo(0, newScroll);
            updateProgressBar();
        }

        function stopIndicatorDrag() {
            if (!isDraggingIndicator) return;
            setTimeout(() => { isDraggingIndicator = false; }, 80);
            lineInteractive.classList.remove('is-dragging');
            document.body.style.userSelect = '';
        }

        lineInteractive.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            startIndicatorDrag(e.clientY);
        });

        window.addEventListener('mousemove', (e) => {
            if (isDraggingIndicator) {
                e.preventDefault();
                handleIndicatorDrag(e.clientY);
            }
        });

        window.addEventListener('mouseup', stopIndicatorDrag);

        lineInteractive.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                e.stopPropagation();
                startIndicatorDrag(e.touches[0].clientY);
            }
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (isDraggingIndicator && e.touches.length > 0) {
                e.preventDefault();
                handleIndicatorDrag(e.touches[0].clientY);
            }
        }, { passive: false });

        window.addEventListener('touchend', stopIndicatorDrag);
    }

    setupSectionScrollIndicator('hero-scroll-indicator', '#about');
    setupSectionScrollIndicator('about-scroll-indicator', '#social');


    // Section headers and all reveal components are unified in Section 4 bidirectional observer



    /* ==========================================================================
       17. UNIFIED BIDIRECTIONAL PORTRAIT JOURNEY & SITE BACKGROUND CONTROLLER
       - Header to About (Down Scroll): Hero portrait glides smoothly down into About frame
       - About to Header (Up Scroll): About portrait glides smoothly back UP into Header frame
       - Below About: Profile picture softly appears across the entire site background ("halki halki poori website me background me picture dikhni chahiye")
       - Seamless continuous linear interpolation, zero delay, fully reversible
       ========================================================================== */
    const heroPortrait = document.querySelector('.hero__portrait');
    const aboutSection = document.getElementById('about');
    const aboutImgWrapper = document.querySelector('.about__image-wrapper');
    const bgPortrait = document.getElementById('site-bg-portrait');
    const bgImg = bgPortrait ? bgPortrait.querySelector('.site-bg-portrait__img, .global-bg__image') : null;

    if (heroPortrait && aboutSection && aboutImgWrapper) {
        let portraitRaf = null;
        let cachedAboutTop = 0;
        let cachedAboutHeight = 0;

        function updateAboutMetrics() {
            if (aboutSection) {
                cachedAboutTop = aboutSection.offsetTop;
                cachedAboutHeight = aboutSection.offsetHeight;
            }
        }
        updateAboutMetrics();
        window.addEventListener('resize', updateAboutMetrics, { passive: true });

        function updatePortraitJourney() {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            if (cachedAboutTop === 0) updateAboutMetrics();
            const aboutTop = cachedAboutTop || 700;
            const aboutHeight = cachedAboutHeight || 800;

            const isMobile = window.innerWidth < 992;
            if (isMobile) {
                // Mobile layout: Soft responsive parallax glide that moves smoothly with scroll
                const mobileTravelMax = Math.max(aboutTop * 0.75, 360);
                if (scrollY < mobileTravelMax) {
                    const travelY = scrollY * 0.28;
                    heroPortrait.style.transform = `translateY(${travelY.toFixed(1)}px)`;
                    const fade = Math.min(1, scrollY / (mobileTravelMax * 0.85));
                    heroPortrait.style.opacity = Math.max(0, 1 - fade).toFixed(2);

                    const aboutFade = Math.max(0, Math.min(1, (scrollY - 120) / (mobileTravelMax - 120)));
                    aboutImgWrapper.style.transform = `translateY(${((1 - aboutFade) * 18).toFixed(1)}px)`;
                    aboutImgWrapper.style.opacity = (0.3 + aboutFade * 0.7).toFixed(2);
                } else {
                    heroPortrait.style.opacity = '0';
                    aboutImgWrapper.style.transform = 'translateY(0px)';
                    aboutImgWrapper.style.opacity = '1';
                }
                aboutImgWrapper.style.pointerEvents = 'auto';

                // Soft mobile watermark below About
                const mobileExit = aboutTop + (aboutHeight * 0.35);
                if (bgPortrait) {
                    if (scrollY > mobileExit) {
                        bgPortrait.classList.add('is-active-bg');
                        bgPortrait.style.opacity = '0.10';
                        bgPortrait.style.visibility = 'visible';
                    } else {
                        bgPortrait.classList.remove('is-active-bg');
                        bgPortrait.style.opacity = '0';
                        bgPortrait.style.visibility = 'hidden';
                    }
                }
                return;
            }

            // Desktop layout: Bidirectional smooth glide from Hero to About
            const travelMax = Math.max(aboutTop * 0.85, 400);

            if (scrollY < travelMax) {
                // ZONE 1: BETWEEN HEADER AND ABOUT (Scrolling Down & Scrolling UP)
                const p = Math.max(0, Math.min(1, scrollY / travelMax));

                // 1. Hero picture translates smoothly down or up with scroll
                const travelY = scrollY * 0.72;
                heroPortrait.style.transform = `translateY(${travelY.toFixed(1)}px)`;

                // 2. Smooth symmetric cross-fade:
                if (p < 0.28) {
                    heroPortrait.style.opacity = '1';
                    aboutImgWrapper.style.opacity = '0';
                    aboutImgWrapper.style.transform = 'translateY(40px)';
                    aboutImgWrapper.style.pointerEvents = 'none';
                } else if (p >= 0.28 && p <= 0.85) {
                    // Transition zone: smoothly cross-fading in both directions!
                    const t = (p - 0.28) / 0.57; // 0 to 1
                    heroPortrait.style.opacity = (1 - t).toFixed(3);
                    aboutImgWrapper.style.opacity = t.toFixed(3);
                    const glideY = (1 - t) * 40;
                    aboutImgWrapper.style.transform = `translateY(${glideY.toFixed(1)}px)`;
                    aboutImgWrapper.style.pointerEvents = t > 0.5 ? 'auto' : 'none';
                } else {
                    heroPortrait.style.opacity = '0';
                    aboutImgWrapper.style.opacity = '1';
                    aboutImgWrapper.style.transform = 'translateY(0px)';
                    aboutImgWrapper.style.pointerEvents = 'auto';
                }

                // Background watermark remains hidden while in Hero / transitioning to About
                if (bgPortrait) {
                    bgPortrait.classList.remove('is-active-bg');
                    bgPortrait.style.opacity = '0';
                    bgPortrait.style.visibility = 'hidden';
                }
            } else {
                // ZONE 2: INSIDE OR BELOW ABOUT SECTION
                heroPortrait.style.opacity = '0';

                // Exit threshold: past the About section
                const exitPoint = aboutTop + (aboutHeight * 0.40);

                if (scrollY <= exitPoint) {
                    // Inside About: Foreground card fully visible, background watermark hidden
                    aboutImgWrapper.style.opacity = '1';
                    aboutImgWrapper.style.transform = 'translateY(0px)';
                    aboutImgWrapper.style.pointerEvents = 'auto';

                    if (bgPortrait) {
                        bgPortrait.classList.remove('is-active-bg');
                        bgPortrait.style.opacity = '0';
                        bgPortrait.style.visibility = 'hidden';
                    }
                } else {
                    // PAST ABOUT SECTION:
                    const pastDistance = scrollY - exitPoint;
                    const dissolve = Math.min(1, pastDistance / 220);

                    // Foreground about picture smoothly dissolves as user scrolls away
                    aboutImgWrapper.style.opacity = Math.max(0, 1 - dissolve).toFixed(3);
                    aboutImgWrapper.style.transform = `translateY(${(-dissolve * 25).toFixed(1)}px)`;
                    aboutImgWrapper.style.pointerEvents = dissolve > 0.8 ? 'none' : 'auto';

                    // BACKGROUND WATERMARK ACTIVATES ACROSS THE ENTIRE WEBSITE!
                    if (bgPortrait) {
                        bgPortrait.classList.add('is-active-bg');
                        bgPortrait.style.opacity = '0.16';
                        bgPortrait.style.visibility = 'visible';
                    }

                    // Gentle luxury parallax shift on background image
                    if (bgImg) {
                        const shift = Math.min(pastDistance * 0.045, 140);
                        bgImg.style.transform = `scaleX(-1) translateY(${shift.toFixed(1)}px)`;
                    }
                }
            }
        }

        function onScrollPortraitJourney() {
            if (!portraitRaf) {
                portraitRaf = requestAnimationFrame(() => {
                    updatePortraitJourney();
                    portraitRaf = null;
                });
            }
        }

        window.addEventListener('scroll', onScrollPortraitJourney, { passive: true });
        window.addEventListener('resize', updatePortraitJourney, { passive: true });
        // Initial call
        updatePortraitJourney();
    }


    /* ==========================================================================
       18. INTERACTIVE "MEHDI" BRAND NAME (Physics Drop & Scramble Easter Egg)
       - Clicking does not navigate anywhere
       - Letters playfully tumble/drop down and scramble through glitch glyphs
       - Gracefully springs back and recovers original name
       ========================================================================== */
    const brandMehdi = document.getElementById('header-brand-mehdi');
    if (brandMehdi) {
        let isBrandAnimating = false;
        const GLYPHS = ['!', '@', '#', '$', '%', '&', '*', '?', '0', '1', '7', 'X', 'Z', '▲', '◆'];

        function triggerBrandTumble(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            if (isBrandAnimating) return;
            isBrandAnimating = true;

            const letterEls = brandMehdi.querySelectorAll('.brand-letter');
            const rotations = [-18, 14, -12, 16, -15];

            // 1. Tumble / Gravity Drop
            letterEls.forEach((el, idx) => {
                el.style.setProperty('--fall-rot', `${rotations[idx % rotations.length]}deg`);
                el.classList.remove('is-recovered');
                el.classList.add('is-falling');
            });

            // 2. Scramble Glyphs during tumble
            let scrambleCount = 0;
            const scrambleInterval = setInterval(() => {
                scrambleCount++;
                letterEls.forEach((el) => {
                    if (Math.random() > 0.3) {
                        el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                    }
                });

                if (scrambleCount > 8) {
                    clearInterval(scrambleInterval);
                }
            }, 55);

            // 3. Physics Bounce & Snap Back into Place
            setTimeout(() => {
                letterEls.forEach((el, idx) => {
                    setTimeout(() => {
                        el.textContent = el.getAttribute('data-orig') || 'M';
                        el.classList.remove('is-falling');
                        el.classList.add('is-recovered');
                    }, idx * 45); // Staggered spring recovery
                });

                setTimeout(() => {
                    letterEls.forEach(el => el.classList.remove('is-recovered'));
                    isBrandAnimating = false;
                }, 600);
            }, 520);
        }

        brandMehdi.addEventListener('click', triggerBrandTumble);
        brandMehdi.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                triggerBrandTumble(e);
            }
        });
    }



    /* ==========================================================================
       19. PROCEDURAL SKELETON LIZARD (ULTRA-LIGHTWEIGHT BACKGROUND AMBIENT)
       - Layered at z-index: 2 behind all cards and content
       - 0% GPU overhead: batched lines and joints (2 draw calls total)
       - Smooth serpentine kinematics at 60-120 FPS
       - Pauses when tab is hidden to preserve battery
       ========================================================================== */
    (function initProceduralSkeletalLizard() {
        let canvas = document.getElementById('skeletal-lizard-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'skeletal-lizard-canvas';
            canvas.className = 'skeletal-lizard-canvas';
            document.body.appendChild(canvas);
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const isMobileDevice = window.innerWidth < 768 || ('ontouchstart' in window && !window.matchMedia('(hover: hover)').matches);

        // Position as global fixed overlay visible across the entire website
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '18'; // Floats above all section backgrounds across entire site
        canvas.style.opacity = isMobileDevice ? '0.36' : '0.40';
        canvas.style.display = 'block';

        let width = window.innerWidth;
        let height = window.innerHeight;
        let dpr = isMobileDevice ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.2);

        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            const mobile = (width < 768 || ('ontouchstart' in window && !window.matchMedia('(hover: hover)').matches));
            dpr = mobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.2);
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });

        // Kinematic Segment
        class LizardSegment {
            constructor(parent, size, angle, range, stiffness) {
                this.isSegment = true;
                this.parent = parent;
                if (typeof parent.children === 'object') parent.children.push(this);
                this.children = [];
                this.size = size;
                this.relAngle = angle;
                this.defAngle = angle;
                this.absAngle = (parent.absAngle || 0) + angle;
                this.range = range;
                this.stiffness = stiffness;
                this.x = (parent.x || 0) + Math.cos(this.absAngle) * this.size;
                this.y = (parent.y || 0) + Math.sin(this.absAngle) * this.size;
                this.updateRelative(false, true);
            }
            updateRelative(iter, flex) {
                this.relAngle =
                    this.relAngle -
                    2 * Math.PI * Math.floor((this.relAngle - this.defAngle) / (2 * Math.PI) + 0.5);
                if (flex) {
                    this.relAngle = Math.min(
                        this.defAngle + this.range / 2,
                        Math.max(
                            this.defAngle - this.range / 2,
                            (this.relAngle - this.defAngle) / this.stiffness + this.defAngle
                        )
                    );
                }
                this.absAngle = this.parent.absAngle + this.relAngle;
                this.x = this.parent.x + Math.cos(this.absAngle) * this.size;
                this.y = this.parent.y + Math.sin(this.absAngle) * this.size;
                if (iter) {
                    for (let i = 0; i < this.children.length; i++) {
                        this.children[i].updateRelative(iter, flex);
                    }
                }
            }
            follow(iter) {
                const px = this.parent.x;
                const py = this.parent.y;
                const dist = Math.hypot(this.x - px, this.y - py) || 0.001;
                this.x = px + (this.size * (this.x - px)) / dist;
                this.y = py + (this.size * (this.y - py)) / dist;
                this.absAngle = Math.atan2(this.y - py, this.x - px);
                this.relAngle = this.absAngle - this.parent.absAngle;
                this.updateRelative(false, true);
                if (iter) {
                    for (let i = 0; i < this.children.length; i++) {
                        this.children[i].follow(true);
                    }
                }
            }
        }

        // Limb System
        class LizardLimbSystem {
            constructor(end, length, speed, creature) {
                this.end = end;
                this.length = Math.max(1, length);
                this.creature = creature;
                this.speed = speed;
                creature.systems.push(this);
                this.nodes = [];
                let node = end;
                for (let i = 0; i < length; i++) {
                    this.nodes.unshift(node);
                    node = node.parent;
                    if (!node.isSegment) {
                        this.length = i + 1;
                        break;
                    }
                }
                this.hip = this.nodes[0].parent;
            }
            moveTo(targetX, targetY) {
                this.nodes[0].updateRelative(true, true);
                const dist = Math.hypot(targetX - this.end.x, targetY - this.end.y);
                let len = Math.max(0, dist - this.speed);
                let currX = targetX;
                let currY = targetY;
                for (let i = this.nodes.length - 1; i >= 0; i--) {
                    const node = this.nodes[i];
                    const ang = Math.atan2(node.y - currY, node.x - currX);
                    node.x = currX + len * Math.cos(ang);
                    node.y = currY + len * Math.sin(ang);
                    currX = node.x;
                    currY = node.y;
                    len = node.size;
                }
                for (let i = 0; i < this.nodes.length; i++) {
                    const node = this.nodes[i];
                    node.absAngle = Math.atan2(node.y - node.parent.y, node.x - node.parent.x);
                    node.relAngle = node.absAngle - node.parent.absAngle;
                    for (let ii = 0; ii < node.children.length; ii++) {
                        const childNode = node.children[ii];
                        if (!this.nodes.includes(childNode)) {
                            childNode.updateRelative(true, false);
                        }
                    }
                }
            }
            update(mx, my) {
                this.moveTo(mx, my);
            }
        }

        // Stepping Leg Machine
        class LizardLegSystem extends LizardLimbSystem {
            constructor(end, length, speed, creature) {
                super(end, length, speed, creature);
                this.goalX = end.x;
                this.goalY = end.y;
                this.step = 0;
                this.forwardness = 0;
                this.reach = 0.9 * Math.hypot(this.end.x - this.hip.x, this.end.y - this.hip.y);
                let relAngle = this.creature.absAngle - Math.atan2(this.end.y - this.hip.y, this.end.x - this.hip.x);
                relAngle -= 2 * Math.PI * Math.floor(relAngle / (2 * Math.PI) + 0.5);
                this.swing = -relAngle + (2 * (relAngle < 0 ? 1 : 0) - 1) * (Math.PI / 2);
                this.swingOffset = this.creature.absAngle - this.hip.absAngle;
            }
            update(x, y) {
                this.moveTo(this.goalX, this.goalY);
                if (this.step === 0) {
                    const dist = Math.hypot(this.end.x - this.goalX, this.end.y - this.goalY);
                    if (dist > 1.2) {
                        this.step = 1;
                        this.goalX =
                            this.hip.x +
                            this.reach * Math.cos(this.swing + this.hip.absAngle + this.swingOffset) +
                            (2 * Math.random() - 1) * (this.reach / 2.2);
                        this.goalY =
                            this.hip.y +
                            this.reach * Math.sin(this.swing + this.hip.absAngle + this.swingOffset) +
                            (2 * Math.random() - 1) * (this.reach / 2.2);
                    }
                } else if (this.step === 1) {
                    const theta = Math.atan2(this.end.y - this.hip.y, this.end.x - this.hip.x) - this.hip.absAngle;
                    const dist = Math.hypot(this.end.x - this.hip.x, this.end.y - this.hip.y);
                    const forwardness2 = dist * Math.cos(theta);
                    const dF = this.forwardness - forwardness2;
                    this.forwardness = forwardness2;
                    if (dF * dF < 1) {
                        this.step = 0;
                        this.goalX = this.hip.x + (this.end.x - this.hip.x);
                        this.goalY = this.hip.y + (this.end.y - this.hip.y);
                    }
                }
            }
        }

        // Creature master controller
        class LizardCreature {
            constructor(x, y, angle, fAccel, fFric, fRes, fThresh, rAccel, rFric, rRes, rThresh) {
                this.x = x;
                this.y = y;
                this.absAngle = angle;
                this.fSpeed = 0;
                this.fAccel = fAccel;
                this.fFric = fFric;
                this.fRes = fRes;
                this.fThresh = fThresh;
                this.rSpeed = 0;
                this.rAccel = rAccel;
                this.rFric = rFric;
                this.rRes = rRes;
                this.rThresh = rThresh;
                this.children = [];
                this.systems = [];
            }
            follow(targetX, targetY, accelMult = 1) {
                const dist = Math.hypot(this.x - targetX, this.y - targetY);
                const angle = Math.atan2(targetY - this.y, targetX - this.x);
                let accel = this.fAccel * accelMult;
                if (this.systems.length > 0) {
                    let sum = 0;
                    for (let i = 0; i < this.systems.length; i++) {
                        if (this.systems[i].step === 0) sum++;
                    }
                    accel *= sum / this.systems.length;
                }
                this.fSpeed += accel * (dist > this.fThresh ? 1 : 0);
                this.fSpeed *= 1 - this.fRes;
                this.speed = Math.max(0, this.fSpeed - this.fFric);

                let dif = this.absAngle - angle;
                dif -= 2 * Math.PI * Math.floor(dif / (2 * Math.PI) + 0.5);
                if (Math.abs(dif) > this.rThresh && dist > this.fThresh) {
                    this.rSpeed -= this.rAccel * (dif > 0 ? 1 : -1);
                }
                this.rSpeed *= 1 - this.rRes;
                if (Math.abs(this.rSpeed) > this.rFric) {
                    this.rSpeed -= this.rFric * (this.rSpeed > 0 ? 1 : -1);
                } else {
                    this.rSpeed = 0;
                }

                this.absAngle += this.rSpeed;
                this.absAngle -= 2 * Math.PI * Math.floor(this.absAngle / (2 * Math.PI) + 0.5);
                this.x += this.speed * Math.cos(this.absAngle);
                this.y += this.speed * Math.sin(this.absAngle);

                this.absAngle += Math.PI;
                for (let i = 0; i < this.children.length; i++) {
                    this.children[i].follow(true);
                }
                for (let i = 0; i < this.systems.length; i++) {
                    this.systems[i].update(targetX, targetY);
                }
                this.absAngle -= Math.PI;
            }
        }

        // Build Streamlined, Ultra-Lightweight Anatomy (~70 nodes total)
        const isSmallScreen = width < 768;
        const s = isSmallScreen ? 0.68 : 0.88;
        const legs = 2; // 4 legs total
        const tail = 14; // Streamlined 14-vertebrae tail

        const critter = new LizardCreature(
            width * 0.5,
            height * 0.45,
            0,
            s * 11,
            s * 2.2,
            0.5,
            20,
            0.52,
            0.088,
            0.5,
            0.28
        );
        let spinal = critter;

        // 1. Neck (4 vertebrae)
        for (let i = 0; i < 4; i++) {
            spinal = new LizardSegment(spinal, s * 4.8, 0, (Math.PI * 2) / 3, 1.1);
            for (let ii = -1; ii <= 1; ii += 2) {
                new LizardSegment(spinal, s * 4.0, ii * 1.3, 0.1, 2);
            }
        }

        // 2. Torso & 4 Legs
        for (let i = 0; i < legs; i++) {
            if (i > 0) {
                for (let ii = 0; ii < 4; ii++) {
                    spinal = new LizardSegment(spinal, s * 5.0, 0, 1.571, 1.5);
                    for (let iii = -1; iii <= 1; iii += 2) {
                        new LizardSegment(spinal, s * 5.8, iii * 1.4, 0.1, 1.5);
                    }
                }
            }
            for (let ii = -1; ii <= 1; ii += 2) {
                let node = new LizardSegment(spinal, s * 12, ii * 0.785, 0, 8);
                node = new LizardSegment(node, s * 15, -ii * 0.785, 6.28, 1);
                node = new LizardSegment(node, s * 15, ii * 1.571, 3.1415, 2);
                for (let iii = 0; iii < 3; iii++) {
                    new LizardSegment(node, s * 4.5, (iii / 2 - 0.5) * 1.4, 0.1, 4);
                }
                new LizardLegSystem(node, 3, s * 13, critter);
            }
        }

        // 3. Tail (14 vertebrae)
        for (let i = 0; i < tail; i++) {
            spinal = new LizardSegment(spinal, s * 4.6, 0, (Math.PI * 2) / 3, 1.1);
            for (let ii = -1; ii <= 1; ii += 2) {
                new LizardSegment(spinal, (s * 4.2 * (tail - i)) / tail, ii * 1.4, 0.1, 2);
            }
        }

        // Ultra-fast single-pass bone recursion
        function traceBoneLines(segment) {
            ctx.moveTo(segment.parent.x, segment.parent.y);
            ctx.lineTo(segment.x, segment.y);
            for (let i = 0; i < segment.children.length; i++) {
                traceBoneLines(segment.children[i]);
            }
        }

        function traceJointDots(segment) {
            ctx.moveTo(segment.x + 1.1, segment.y);
            ctx.arc(segment.x, segment.y, 1.1, 0, Math.PI * 2);
            for (let i = 0; i < segment.children.length; i++) {
                traceJointDots(segment.children[i]);
            }
        }

        function traceSkull(critter, scale) {
            const x = critter.x;
            const y = critter.y;
            const cos = Math.cos(critter.absAngle);
            const sin = Math.sin(critter.absAngle);
            const pCos = Math.cos(critter.absAngle + Math.PI / 2);
            const pSin = Math.sin(critter.absAngle + Math.PI / 2);

            const snoutX = x + cos * (scale * 18);
            const snoutY = y + sin * (scale * 18);
            const jawW = scale * 7.0;
            const lJawX = x + pCos * jawW;
            const lJawY = y + pSin * jawW;
            const rJawX = x - pCos * jawW;
            const rJawY = y - pSin * jawW;
            const baseX = x - cos * (scale * 4);
            const baseY = y - sin * (scale * 4);

            ctx.moveTo(snoutX, snoutY);
            ctx.lineTo(lJawX, lJawY);
            ctx.lineTo(baseX, baseY);
            ctx.lineTo(rJawX, rJawY);
            ctx.lineTo(snoutX, snoutY);

            ctx.moveTo(snoutX, snoutY);
            ctx.lineTo(x, y);

            const eyeFwd = scale * 7.0;
            const eyeSide = scale * 3.8;
            const eyeR = scale * 2.0;
            ctx.moveTo(x + cos * eyeFwd + pCos * eyeSide + eyeR, y + sin * eyeFwd + pSin * eyeSide);
            ctx.arc(x + cos * eyeFwd + pCos * eyeSide, y + sin * eyeFwd + pSin * eyeSide, eyeR, 0, Math.PI * 2);

            ctx.moveTo(x + cos * eyeFwd - pCos * eyeSide + eyeR, y + sin * eyeFwd - pSin * eyeSide);
            ctx.arc(x + cos * eyeFwd - pCos * eyeSide, y + sin * eyeFwd - pSin * eyeSide, eyeR, 0, Math.PI * 2);
        }

        function traceEyePupils(critter, scale) {
            const x = critter.x;
            const y = critter.y;
            const cos = Math.cos(critter.absAngle);
            const sin = Math.sin(critter.absAngle);
            const pCos = Math.cos(critter.absAngle + Math.PI / 2);
            const pSin = Math.sin(critter.absAngle + Math.PI / 2);
            const eyeFwd = scale * 7.0;
            const eyeSide = scale * 3.8;

            ctx.moveTo(x + cos * eyeFwd + pCos * eyeSide + 1.1, y + sin * eyeFwd + pCos * eyeSide);
            ctx.arc(x + cos * eyeFwd + pCos * eyeSide, y + sin * eyeFwd + pSin * eyeSide, 1.1, 0, Math.PI * 2);

            ctx.moveTo(x + cos * eyeFwd - pCos * eyeSide + 1.1, y + sin * eyeFwd - pSin * eyeSide);
            ctx.arc(x + cos * eyeFwd - pCos * eyeSide, y + sin * eyeFwd - pSin * eyeSide, 1.1, 0, Math.PI * 2);
        }

        let mouseX = width / 2;
        let mouseY = height / 2;
        let touchActive = false;
        let touchX = width / 2;
        let touchY = height / 2;
        let isDragging = false;
        let hasUserMoved = false;
        let lastInteractionTime = performance.now();
        let lizardRafId = null;

        function wakeLizard() {
            lastInteractionTime = performance.now();
            if (!lizardRafId && !document.hidden) {
                lizardRafId = requestAnimationFrame(animateLizard);
            }
        }

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            hasUserMoved = true;
            wakeLizard();
        }, { passive: true });

        window.addEventListener('mousedown', () => { isDragging = true; wakeLizard(); });
        window.addEventListener('mouseup', () => { isDragging = false; wakeLizard(); });

        // Mobile touch tracking & interaction
        window.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length > 0) {
                touchX = e.touches[0].clientX;
                touchY = e.touches[0].clientY;
                touchActive = true;
                hasUserMoved = true;
                wakeLizard();
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches.length > 0) {
                touchX = e.touches[0].clientX;
                touchY = e.touches[0].clientY;
                touchActive = true;
                hasUserMoved = true;
                wakeLizard();
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            setTimeout(() => { touchActive = false; }, 1800);
        }, { passive: true });

        // Wake lizard on scroll so it swims across whichever section user views
        window.addEventListener('scroll', () => {
            wakeLizard();
        }, { passive: true });

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                wakeLizard();
            } else if (lizardRafId) {
                cancelAnimationFrame(lizardRafId);
                lizardRafId = null;
            }
        });

        // Buttery smooth animation loop (60-120 FPS continuous kinematics)
        let time = 0;
        function animateLizard() {
            if (document.hidden) {
                lizardRafId = null;
                return;
            }

            const now = performance.now();
            const idleTime = now - lastInteractionTime;

            // Desktop only: after 6s idle near mouse, rest gracefully
            if (!isMobileDevice && hasUserMoved && idleTime > 6000) {
                const distToMouse = Math.hypot(critter.x - mouseX, critter.y - mouseY);
                if (distToMouse < 22) {
                    lizardRafId = null;
                    return; // 0% CPU at rest on desktop!
                }
            }

            time += 0.032;

            let targetX = mouseX;
            let targetY = mouseY;

            if (isMobileDevice) {
                // Mobile UI: Autonomously and organically roams randomly across the screen ("randomly kahin na kahin ghumta rahe")
                if (touchActive) {
                    targetX = touchX;
                    targetY = touchY;
                } else {
                    const cx = width * 0.5;
                    const cy = height * 0.5;
                    const rx = width * 0.40;
                    const ry = height * 0.38;
                    // Multi-harmonic Lissajous organic roaming across the screen
                    targetX = cx + Math.cos(time * 0.38 + 1.2) * (rx * 0.85) + Math.sin(time * 0.77) * (rx * 0.15);
                    targetY = cy + Math.sin(time * 0.29) * (ry * 0.85) + Math.cos(time * 0.65) * (ry * 0.15);
                }
            } else if (!hasUserMoved) {
                targetX = width / 2 + Math.cos(time * 0.45) * (width * 0.28);
                targetY = height / 2 + Math.sin(time * 0.9) * (height * 0.24);
            } else {
                const distToMouse = Math.hypot(critter.x - mouseX, critter.y - mouseY);
                const wanderAmp = Math.min(18, Math.max(5, distToMouse * 0.06));
                const wanderAngle = critter.absAngle + Math.PI / 2;
                const wanderOffset = Math.sin(time * 3.0) * wanderAmp;
                targetX += Math.cos(wanderAngle) * wanderOffset;
                targetY += Math.sin(wanderAngle) * wanderOffset;
            }

            const accelMult = isDragging ? 1.6 : 1.0;
            critter.follow(targetX, targetY, accelMult);

            ctx.clearRect(0, 0, width, height);

            // BATCH 1: All Bone & Skull Lines in 1 GPU Draw Call
            ctx.beginPath();
            traceSkull(critter, s);
            for (let i = 0; i < critter.children.length; i++) {
                traceBoneLines(critter.children[i]);
            }
            ctx.strokeStyle = 'rgba(215, 230, 245, 0.65)';
            ctx.lineWidth = 1.15;
            ctx.stroke();

            // BATCH 2: All Joint & Eye Dots in 1 GPU Fill Call
            ctx.beginPath();
            traceEyePupils(critter, s);
            for (let i = 0; i < critter.children.length; i++) {
                traceJointDots(critter.children[i]);
            }
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.fill();

            lizardRafId = requestAnimationFrame(animateLizard);
        }
        lizardRafId = requestAnimationFrame(animateLizard);
    })();


    /* ==========================================================================
       LUXURY SUCCESS TOAST NOTIFICATION ENGINE
       ========================================================================== */
    function showSuccessToast(title, message, duration = 4500) {
        let container = document.getElementById('global-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'global-toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');

        toast.innerHTML = `
            <div class="toast__icon-wrap" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <div class="toast__content">
                <div class="toast__title">${title}</div>
                <div class="toast__message">${message}</div>
            </div>
            <button type="button" class="toast__close" aria-label="Close notification">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <div class="toast__progress"></div>
        `;

        container.appendChild(toast);

        // Animate appearance
        requestAnimationFrame(() => {
            toast.classList.add('is-visible');
            const progress = toast.querySelector('.toast__progress');
            if (progress) {
                progress.style.transition = `transform ${duration}ms linear`;
                progress.style.transform = 'scaleX(0)';
            }
        });

        function dismiss() {
            if (toast.classList.contains('is-hiding')) return;
            toast.classList.remove('is-visible');
            toast.classList.add('is-hiding');
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 360);
        }

        const closeBtn = toast.querySelector('.toast__close');
        if (closeBtn) closeBtn.addEventListener('click', dismiss);

        const timer = setTimeout(dismiss, duration);
        toast.addEventListener('mouseenter', () => clearTimeout(timer));
    }
    window.showSuccessToast = showSuccessToast;

    // Contact Action Success Listeners
    const emailBtn = document.getElementById('contact-email-btn');
    if (emailBtn) {
        emailBtn.addEventListener('click', () => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText('alimehdi3417@gmail.com').catch(() => {});
            }
            showSuccessToast('Email Copied', 'alimehdi3417@gmail.com copied to clipboard!');
        });
    }

    const phoneBtn = document.getElementById('contact-phone-btn');
    if (phoneBtn) {
        phoneBtn.addEventListener('click', () => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText('+923709494308').catch(() => {});
            }
            showSuccessToast('Phone Copied', '+92 370 9494308 copied to clipboard!');
        });
    }

    const whatsappBtn = document.getElementById('contact-whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            showSuccessToast('Opening WhatsApp', 'Redirecting you to direct chat with Syed Ali Mehdi...');
        });
    }

    const floatingWaBtn = document.getElementById('whatsapp-floating-btn');
    if (floatingWaBtn) {
        floatingWaBtn.addEventListener('click', () => {
            showSuccessToast('Opening WhatsApp', 'Redirecting you to direct chat with Syed Ali Mehdi...');
        });
    }

    const certDownloadBtn = document.getElementById('modal-cert-download');
    if (certDownloadBtn) {
        certDownloadBtn.addEventListener('click', () => {
            showSuccessToast('Credential Downloaded', 'Official accredited certificate credential saved.');
        });
    }

});