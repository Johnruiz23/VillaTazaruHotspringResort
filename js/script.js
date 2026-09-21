/* ============================================
   VILLA TAZARU HOTSPRING RESORT - SCRIPT
   Vanilla JS, no dependencies
============================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* -------------------------------------------------
       PRELOADER
    ------------------------------------------------- */
    const preloader = document.getElementById('preloader');

    window.addEventListener('load', function () {
        setTimeout(function () {
            preloader.classList.add('hide');
        }, 700);
    });

    // Fallback: hide preloader even if load already fired
    setTimeout(function () {
        preloader.classList.add('hide');
    }, 3500);

    /* -------------------------------------------------
       HEADER + SCROLL PROGRESS + BACK-TO-TOP
    ------------------------------------------------- */
    const header = document.getElementById('header');
    const progressBar = document.getElementById('progress-bar');
    const backToTop = document.getElementById('back-to-top');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = navMenu.querySelectorAll('a');

    function onScroll() {
        const y = window.scrollY || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = height > 0 ? (y / height) * 100 : 0;

        header.classList.toggle('scrolled', y > 60);
        backToTop.classList.toggle('show', y > 500);
        progressBar.style.width = scrolled + '%';

        highlightActiveLink();
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Hero parallax
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', function () {
            const y = window.scrollY;
            if (y < window.innerHeight) {
                heroBg.style.transform = 'scale(1.1) translateY(' + y * 0.25 + 'px)';
            }
        }, { passive: true });
    }

    /* -------------------------------------------------
       MOBILE MENU
    ------------------------------------------------- */
    const menuToggle = document.getElementById('menu-toggle');

    function closeMenu() {
        navMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-label', 'Toggle menu');
    }

    menuToggle.addEventListener('click', function () {
        const isOpen = navMenu.classList.toggle('open');
        menuToggle.classList.toggle('open', isOpen);
        menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Toggle menu');
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
        if (navMenu.classList.contains('open') &&
            !navMenu.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });

    /* -------------------------------------------------
       SCROLLSPY - active nav link
    ------------------------------------------------- */
    function highlightActiveLink() {
        const sections = [];
        navLinks.forEach(function (link) {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) sections.push({ link: link, section: target });
        });

        const pos = (window.scrollY || document.documentElement.scrollTop) + 140;
        let current = sections[0] ? sections[0].link : null;

        sections.forEach(function (item) {
            if (pos >= item.section.offsetTop) {
                current = item.link;
            }
        });

        navLinks.forEach(function (link) {
            link.classList.toggle('active', link === current);
        });
    }

    /* -------------------------------------------------
       SCROLL REVEAL ANIMATION
    ------------------------------------------------- */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(function () {
                    entry.target.classList.add('show');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) {
        revealObserver.observe(el);
    });

    /* -------------------------------------------------
       ANIMATED COUNTERS
    ------------------------------------------------- */
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const duration = 1600;
            const start = performance.now();

            function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(eased * target);
                if (progress < 1) {
                    requestAnimationFrame(tick);
                }
            }

            requestAnimationFrame(tick);
            counterObserver.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(function (el) {
        counterObserver.observe(el);
    });

    /* -------------------------------------------------
       GALLERY FILTER
    ------------------------------------------------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            galleryItems.forEach(function (item, index) {
                const match = filter === 'all' || item.dataset.category === filter;
                item.classList.toggle('hidden', !match);
                if (match) {
                    item.style.order = '';
                    item.style.animation = 'none';
                    void item.offsetWidth;
                    item.style.animation = 'zoomIn .4s ease ' + (index * 60) + 'ms backwards';
                }
            });
        });
    });

    /* -------------------------------------------------
       LIGHTBOX with prev / next
    ------------------------------------------------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let lightboxIndex = 0;
    let lightboxItems = [];

    function refreshLightboxItems() {
        lightboxItems = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
    }

    function openLightbox(item) {
        refreshLightboxItems();
        const idx = lightboxItems.indexOf(item);
        lightboxIndex = idx >= 0 ? idx : 0;
        renderLightbox();
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function renderLightbox() {
        const item = lightboxItems[lightboxIndex];
        if (!item) return;
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-overlay h3');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = title ? title.textContent : '';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        lightboxImg.src = '';
    }

    function moveLightbox(step) {
        if (!lightboxItems.length) return;
        lightboxIndex = (lightboxIndex + step + lightboxItems.length) % lightboxItems.length;
        renderLightbox();
    }

    galleryItems.forEach(function (item) {
        item.addEventListener('click', function () { openLightbox(item); });
    });

    lightboxClose.addEventListener('click', closeLightbox);

    lightboxPrev.addEventListener('click', function (e) {
        e.stopPropagation();
        moveLightbox(-1);
    });

    lightboxNext.addEventListener('click', function (e) {
        e.stopPropagation();
        moveLightbox(1);
    });

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') moveLightbox(-1);
        if (e.key === 'ArrowRight') moveLightbox(1);
    });

    /* -------------------------------------------------
       TESTIMONIAL SLIDER
    ------------------------------------------------- */
    const slidesTrack = document.getElementById('slides-track');
    const slides = slidesTrack.querySelectorAll('.slide');
    const sliderDots = document.getElementById('slider-dots');
    const sliderPrev = document.getElementById('slider-prev');
    const sliderNext = document.getElementById('slider-next');

    let slideIndex = 0;
    let sliderTimer = null;

    function buildDots() {
        slides.forEach(function (_, i) {
            const dot = document.createElement('button');
            dot.classList.toggle('active', i === 0);
            dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
            dot.addEventListener('click', function () {
                goToSlide(i);
                restartSlider();
            });
            sliderDots.appendChild(dot);
        });
    }

    function goToSlide(i) {
        slideIndex = (i + slides.length) % slides.length;
        slidesTrack.style.transform = 'translateX(-' + slideIndex * 100 + '%)';
        sliderDots.querySelectorAll('button').forEach(function (dot, d) {
            dot.classList.toggle('active', d === slideIndex);
        });
    }

    function restartSlider() {
        clearInterval(sliderTimer);
        sliderTimer = setInterval(function () {
            goToSlide(slideIndex + 1);
        }, 5000);
    }

    sliderPrev.addEventListener('click', function () {
        goToSlide(slideIndex - 1);
        restartSlider();
    });

    sliderNext.addEventListener('click', function () {
        goToSlide(slideIndex + 1);
        restartSlider();
    });

    buildDots();
    restartSlider();

    /* -------------------------------------------------
       FAQ ACCORDION
    ------------------------------------------------- */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', function () {
            const isOpen = item.classList.contains('open');

            // Close all
            faqItems.forEach(function (other) {
                other.classList.remove('open');
                other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                other.querySelector('.faq-answer').style.maxHeight = '0';
            });

            // Open clicked (if it was closed)
            if (!isOpen) {
                item.classList.add('open');
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // Keep expanded heights correct on resize
    window.addEventListener('resize', function () {
        faqItems.forEach(function (item) {
            if (item.classList.contains('open')) {
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    /* -------------------------------------------------
       BOOKING FORM VALIDATION & SUCCESS
    ------------------------------------------------- */
    const bookingForm = document.getElementById('booking-form');
    const formSuccess = document.getElementById('form-success');

    function setError(input, message) {
        const group = input.closest('.form-group');
        const errorEl = group.querySelector('.error-msg');
        input.classList.add('error');
        errorEl.textContent = message;
    }

    function clearError(input) {
        const group = input.closest('.form-group');
        const errorEl = group.querySelector('.error-msg');
        input.classList.remove('error');
        errorEl.textContent = '';
    }

    const validateMap = {
        name: function (val) {
            return val.trim().length >= 2 ? '' : 'Please enter your full name.';
        },
        phone: function (val) {
            const clean = val.replace(/[\s\-()]/g, '');
            return /^(\+?63|0)?9\d{9}$/.test(clean) ? '' : 'Enter a valid PH mobile number (e.g. 0917 805 6750).';
        },
        email: function (val) {
            if (!val.trim()) return '';
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? '' : 'Enter a valid email address.';
        },
        guests: function (val) {
            return val ? '' : 'Please select the number of guests.';
        },
        message: function (val) {
            return val.trim().length >= 10 ? '' : 'Message should be at least 10 characters.';
        }
    };

    const validateFields = ['name', 'phone', 'email', 'guests', 'message'];

    // Live clear on input
    bookingForm.addEventListener('input', function (e) {
        if (validateFields.indexOf(e.target.name) !== -1) clearError(e.target);
    });

    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let valid = true;

        validateFields.forEach(function (field) {
            const input = bookingForm.querySelector('[name="' + field + '"]');
            const validator = validateMap[field];
            const err = validator(input.value);
            if (err) {
                setError(input, err);
                valid = false;
            } else {
                clearError(input);
            }
        });

        if (!valid) {
            bookingForm.querySelector('.error-msg').scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const formData = new FormData(bookingForm);
        const subject = 'Reservation Inquiry - Villa Tazaru';
        const body = [
            'New reservation inquiry for Villa Tazaru',
            '',
            'Full Name: ' + formData.get('name'),
            'Phone Number: ' + formData.get('phone'),
            'Email Address: ' + (formData.get('email') || 'Not provided'),
            'Number of Guests: ' + formData.get('guests'),
            'Preferred Date: ' + (formData.get('date') || 'Not provided'),
            'Inquiry Type: ' + formData.get('type'),
            '',
            'Message:',
            formData.get('message')
        ].join('\n');

        window.location.href = 'mailto:tazaruhotspringresort@gmail.com?subject=' +
            encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });

});