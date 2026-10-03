/**
 * ASK ELEVATORS - MAIN JS
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. NAVBAR SCROLL EFFECT ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 2. SCROLL REVEAL ANIMATIONS ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Automatically add reveal class to all sections for animation
    document.querySelectorAll('section').forEach(sec => {
        if(!sec.classList.contains('reveal')) {
            sec.classList.add('reveal');
            revealOnScroll.observe(sec);
        }
    });

    // --- 3. MOBILE MENU TOGGLE ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navBtn = document.querySelector('.navbar .btn');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            if (navBtn) {
                navBtn.classList.toggle('active');
            }
        });
    }
    
    // --- 4. FORM VALIDATION ---
    const enquiryForm = document.getElementById('enquiry-form');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const req = document.getElementById('requirement').value;
            const msg = document.getElementById('message').value;
            
            if(name && phone && email && req && msg) {
                const btn = enquiryForm.querySelector('button');
                const originalText = btn.textContent;
                
                btn.textContent = 'Message Sent Successfully!';
                btn.style.backgroundColor = '#25D366';
                btn.style.borderColor = '#25D366';
                
                enquiryForm.reset();
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                }, 3000);
            }
        });
    }

    // --- 5. FIXED ACTION BUTTONS ---
    const actionBtnsHTML = `
        <div class="fixed-action-btns">
            <a href="https://wa.me/919960000228" target="_blank" class="action-btn whatsapp-btn" title="Chat on WhatsApp">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style="width: 30px; height: 30px;">
            </a>
            <a href="tel:+919960000228" class="action-btn call-btn" title="Call Us">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </a>
            <button id="scrollToTop" class="action-btn top-btn" title="Scroll to Top">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
            </button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', actionBtnsHTML);

    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 6. HERO SLIDER ---
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroPrev = document.getElementById('heroPrev');
    const heroNext = document.getElementById('heroNext');
    let currentHeroSlide = 0;
    let heroSlideInterval;

    if (heroSlides.length > 0) {
        function showHeroSlide(index) {
            heroSlides.forEach(slide => slide.classList.remove('active'));
            heroSlides[index].classList.add('active');
        }

        function nextHeroSlide() {
            currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
            showHeroSlide(currentHeroSlide);
        }

        function prevHeroSlide() {
            currentHeroSlide = (currentHeroSlide - 1 + heroSlides.length) % heroSlides.length;
            showHeroSlide(currentHeroSlide);
        }

        if (heroNext && heroPrev) {
            heroNext.addEventListener('click', () => {
                nextHeroSlide();
                resetHeroInterval();
            });
            heroPrev.addEventListener('click', () => {
                prevHeroSlide();
                resetHeroInterval();
            });
        }

        function resetHeroInterval() {
            clearInterval(heroSlideInterval);
            heroSlideInterval = setInterval(nextHeroSlide, 8000);
        }

        resetHeroInterval();
    }

    // --- 7. PRODUCT CAROUSEL (2-CARDS STEP SLIDER) ---
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');

    if (carouselTrack) {
        const productCards = Array.from(carouselTrack.children);
        const totalProducts = productCards.length;
        let currentProdIndex = 0;

        function getProdCardsPerView() {
            if (window.innerWidth <= 600) return 1;
            if (window.innerWidth <= 992) return 2;
            return 3;
        }

        function updateProdSlider() {
            const cardsPerView = getProdCardsPerView();
            const maxIndex = Math.max(0, totalProducts - cardsPerView);
            if (currentProdIndex > maxIndex) currentProdIndex = maxIndex;
            if (currentProdIndex < 0) currentProdIndex = 0;

            const firstCard = productCards[0];
            if (!firstCard) return;
            const cardWidth = firstCard.getBoundingClientRect().width;
            const gap = parseInt(window.getComputedStyle(carouselTrack).gap) || 24;

            const moveAmount = (cardWidth + gap) * currentProdIndex;
            carouselTrack.style.transform = `translateX(-${moveAmount}px)`;
            carouselTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        }

        function nextProdSlide() {
            const step = 2; // Shift 2 cards at a time!
            const cardsPerView = getProdCardsPerView();
            const maxIndex = totalProducts - cardsPerView;
            if (currentProdIndex >= maxIndex) {
                currentProdIndex = 0;
            } else {
                currentProdIndex += step;
                if (currentProdIndex > maxIndex) currentProdIndex = maxIndex;
            }
            updateProdSlider();
        }

        function prevProdSlide() {
            const step = 2; // Shift 2 cards back at a time!
            const cardsPerView = getProdCardsPerView();
            const maxIndex = totalProducts - cardsPerView;
            if (currentProdIndex <= 0) {
                currentProdIndex = maxIndex > 0 ? maxIndex : 0;
            } else {
                currentProdIndex -= step;
                if (currentProdIndex < 0) currentProdIndex = 0;
            }
            updateProdSlider();
        }

        if (carouselNext) {
            carouselNext.style.display = 'flex';
            carouselNext.addEventListener('click', () => {
                nextProdSlide();
                resetProdAutoSlide();
            });
        }
        if (carouselPrev) {
            carouselPrev.style.display = 'flex';
            carouselPrev.addEventListener('click', () => {
                prevProdSlide();
                resetProdAutoSlide();
            });
        }

        let prodInterval;
        function resetProdAutoSlide() {
            clearInterval(prodInterval);
            prodInterval = setInterval(nextProdSlide, 5000);
        }

        updateProdSlider();
        resetProdAutoSlide();

        window.addEventListener('resize', updateProdSlider);
    }

    // --- 8. TESTIMONIALS (2-CARDS STEP SLIDER) ---
    const testiTrack = document.getElementById('testiTrack');
    const testiPrev = document.getElementById('testi-prev');
    const testiNext = document.getElementById('testi-next');
    const testiDotsContainer = document.getElementById('testiDots');

    if (testiTrack) {
        const testiCards = Array.from(testiTrack.children);
        const totalCards = testiCards.length;
        let currentTestiIndex = 0;

        function getTestiCardsPerView() {
            return window.innerWidth <= 768 ? 1 : 2;
        }

        function updateTestiSlider() {
            const cardsPerView = getTestiCardsPerView();
            const maxIndex = Math.max(0, totalCards - cardsPerView);
            if (currentTestiIndex > maxIndex) currentTestiIndex = maxIndex;
            if (currentTestiIndex < 0) currentTestiIndex = 0;

            const firstCard = testiCards[0];
            if (!firstCard) return;
            const cardWidth = firstCard.getBoundingClientRect().width;
            const gap = parseInt(window.getComputedStyle(testiTrack).gap) || 24;

            const moveAmount = (cardWidth + gap) * currentTestiIndex;
            testiTrack.style.transform = `translateX(-${moveAmount}px)`;
            testiTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';

            if (testiDotsContainer) {
                const activeDotIndex = Math.floor(currentTestiIndex / cardsPerView);
                Array.from(testiDotsContainer.children).forEach((dot, idx) => {
                    dot.classList.toggle('active', idx === activeDotIndex);
                });
            }
        }

        function createTestiDots() {
            if (!testiDotsContainer) return;
            testiDotsContainer.innerHTML = '';
            const cardsPerView = getTestiCardsPerView();
            const totalDots = Math.ceil(totalCards / cardsPerView);

            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('button');
                dot.classList.add('testi-dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    currentTestiIndex = i * cardsPerView;
                    updateTestiSlider();
                    resetTestiAutoSlide();
                });
                testiDotsContainer.appendChild(dot);
            }
        }

        function nextTestiSlide() {
            const cardsPerView = getTestiCardsPerView();
            const maxIndex = totalCards - cardsPerView;
            if (currentTestiIndex >= maxIndex) {
                currentTestiIndex = 0;
            } else {
                currentTestiIndex += cardsPerView; // shift 2 cards at a time!
                if (currentTestiIndex > maxIndex) currentTestiIndex = maxIndex;
            }
            updateTestiSlider();
        }

        function prevTestiSlide() {
            const cardsPerView = getTestiCardsPerView();
            const maxIndex = totalCards - cardsPerView;
            if (currentTestiIndex <= 0) {
                currentTestiIndex = maxIndex > 0 ? maxIndex : 0;
            } else {
                currentTestiIndex -= cardsPerView; // shift 2 cards back at a time!
                if (currentTestiIndex < 0) currentTestiIndex = 0;
            }
            updateTestiSlider();
        }

        if (testiNext) {
            testiNext.addEventListener('click', () => {
                nextTestiSlide();
                resetTestiAutoSlide();
            });
        }
        if (testiPrev) {
            testiPrev.addEventListener('click', () => {
                prevTestiSlide();
                resetTestiAutoSlide();
            });
        }

        let testiInterval;
        function resetTestiAutoSlide() {
            clearInterval(testiInterval);
            testiInterval = setInterval(nextTestiSlide, 5000);
        }

        createTestiDots();
        updateTestiSlider();
        resetTestiAutoSlide();

        window.addEventListener('resize', () => {
            createTestiDots();
            updateTestiSlider();
        });
    }

    // --- 10. COUNTER STATS NUMBER ANIMATION ---
    const counterElements = document.querySelectorAll('.counter-val');
    if (counterElements.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const endVal = parseInt(target.getAttribute('data-target'), 10);
                    let startVal = 0;
                    const duration = 2000;
                    const stepTime = 30;
                    const steps = duration / stepTime;
                    const increment = endVal / steps;

                    const timer = setInterval(() => {
                        startVal += increment;
                        if (startVal >= endVal) {
                            target.textContent = endVal;
                            clearInterval(timer);
                        } else {
                            target.textContent = Math.ceil(startVal);
                        }
                    }, stepTime);

                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.3 });

        counterElements.forEach(el => counterObserver.observe(el));
    }
});

