/**
 * ASK ELEVATORS - PRODUCTS FILTER & SIDEBAR JS
 */
document.addEventListener('DOMContentLoaded', function () {
    const filterLinks = document.querySelectorAll('#product-filter a');
    const productCards = document.querySelectorAll('#product-grid .product-two-card, #product-grid .product-card');
    const categoryTitle = document.getElementById('category-title');
    const categoryTag = document.getElementById('category-tag');
    const categoryCount = document.getElementById('category-count');

    if (!filterLinks.length || !productCards.length) return;

    function applyFilter(filterValue, linkElement) {
        // Update active class on sidebar
        filterLinks.forEach(l => l.classList.remove('active'));
        if (linkElement) {
            linkElement.classList.add('active');
        } else {
            const matchingSidebar = document.querySelector(`#product-filter a[data-filter="${filterValue}"]`);
            if (matchingSidebar) matchingSidebar.classList.add('active');
        }

        let visibleCount = 0;

        // Filter cards
        productCards.forEach(card => {
            if (filterValue === 'all') {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                if (card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            }
        });

        // Update header details
        if (categoryTitle && categoryTag && categoryCount) {
            if (filterValue === 'all') {
                categoryTag.textContent = 'Complete Collection';
                categoryTitle.textContent = 'All Products & Services';
                categoryCount.textContent = `${visibleCount} Photo Designs`;
            } else {
                const targetEl = linkElement || document.querySelector(`#product-filter a[data-filter="${filterValue}"]`);
                const label = targetEl ? 
                              (targetEl.querySelector('span:not(.sidebar-nav-icon)') ? 
                               targetEl.querySelector('span:not(.sidebar-nav-icon)').textContent.trim() : 
                               targetEl.textContent.trim()) : 
                              filterValue;
                categoryTag.textContent = 'Specialized Solutions';
                categoryTitle.textContent = label;
                categoryCount.textContent = `${visibleCount} Photo Designs`;
            }
        }
    }

    // Attach click events to sidebar filter links
    filterLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const filterValue = this.getAttribute('data-filter') || 'all';
            applyFilter(filterValue, this);

            // Update URL hash without jumping
            if (history.pushState) {
                history.pushState(null, null, `#${filterValue}`);
            } else {
                window.location.hash = filterValue;
            }

            // Mobile auto-scroll to results
            if (window.innerWidth <= 991) {
                const gridElem = document.querySelector('.product-content');
                if (gridElem) {
                    gridElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    function handleHash() {
        const hash = window.location.hash ? window.location.hash.replace('#', '') : 'all';
        const matchingLink = document.querySelector(`#product-filter a[data-filter="${hash}"]`) || 
                             document.querySelector(`#product-filter a[data-filter="all"]`);
        if (matchingLink) {
            applyFilter(hash, matchingLink);
        }
    }

    // Check for hash on initial page load
    handleHash();

    // Listen for hash changes (e.g., browser back/forward or hash updates)
    window.addEventListener('hashchange', handleHash);

    // Intercept clicks on navbar dropdown links when already on products.html
    document.querySelectorAll('.nav-dropdown-menu a').forEach(dropLink => {
        dropLink.addEventListener('click', function (e) {
            const href = this.getAttribute('href') || '';
            if (href.includes('#')) {
                const targetHash = href.split('#')[1] || 'all';
                e.preventDefault();

                if (window.location.hash !== `#${targetHash}`) {
                    if (history.pushState) {
                        history.pushState(null, null, `#${targetHash}`);
                    } else {
                        window.location.hash = targetHash;
                    }
                }
                const matchingLink = document.querySelector(`#product-filter a[data-filter="${targetHash}"]`);
                applyFilter(targetHash, matchingLink);

                // Smooth scroll to product content
                const contentElem = document.querySelector('.product-content');
                if (contentElem) {
                    contentElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                const mobileToggle = document.getElementById('mobile-toggle');
                const overlay = document.querySelector('.mobile-menu-overlay');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (mobileToggle) mobileToggle.classList.remove('active');
                    if (overlay) overlay.classList.remove('active');
                    document.body.classList.remove('mobile-drawer-open');
                }
            }
        });
    });
});
