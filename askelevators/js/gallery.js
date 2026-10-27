/**
 * ASK ELEVATORS - GALLERY FILTER & LIGHTBOX JS
 */
document.addEventListener('DOMContentLoaded', function () {
    // --- 1. GALLERY TAB FILTERING ---
    const filterLinks = document.querySelectorAll('#gallery-filter a');
    const galleryItems = document.querySelectorAll('#gallery-grid .masonry-item');

    if (filterLinks.length > 0 && galleryItems.length > 0) {
        filterLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                filterLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- 2. GALLERY LIGHTBOX MODAL ---
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    let visibleItems = [];
    let currentIndex = 0;

    function updateVisibleItems() {
        visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
    }

    function openLightbox(index) {
        updateVisibleItems();
        if (visibleItems.length === 0) return;

        currentIndex = (index + visibleItems.length) % visibleItems.length;
        const activeItem = visibleItems[currentIndex];
        const img = activeItem.querySelector('img');
        const title = activeItem.querySelector('h4');
        const desc = activeItem.querySelector('p');

        if (img && lightboxImg) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || '';
        }
        if (lightboxTitle) lightboxTitle.textContent = title ? title.textContent : '';
        if (lightboxDesc) lightboxDesc.textContent = desc ? desc.textContent : '';

        if (lightbox) {
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
        }
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
        }
        document.body.style.overflow = '';
    }

    galleryItems.forEach((item) => {
        item.addEventListener('click', function () {
            updateVisibleItems();
            const index = visibleItems.indexOf(this);
            openLightbox(index >= 0 ? index : 0);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            openLightbox(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            openLightbox(currentIndex + 1);
        });
    }

    document.addEventListener('keydown', function (e) {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
        if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
    });
});
