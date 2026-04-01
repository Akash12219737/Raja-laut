/**
 * Raja Laut Dive Resort — Main JS
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ─────────────────────────────────────────────
       1.  Navbar scroll effect
    ───────────────────────────────────────────── */
    const navbar  = document.getElementById('navbar');
    const hasHero = document.querySelector('.hero') !== null;

    function updateNavbar() {
        if (!hasHero || window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();                          // run once on load


    /* ─────────────────────────────────────────────
       2.  Mobile menu — open / close helpers
    ───────────────────────────────────────────── */
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks  = document.querySelector('.nav-links');

    function openMenu() {
        mobileBtn.classList.add('active');
        navLinks.classList.add('active');
        document.body.classList.add('menu-open');
    }

    function closeMenu() {
        mobileBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        // Collapse all open dropdowns
        document.querySelectorAll('.dropdown.open').forEach(d => {
            d.classList.remove('open');
        });
    }

    if (mobileBtn && navLinks) {

        /* Hamburger toggle */
        mobileBtn.addEventListener('click', e => {
            e.stopPropagation();
            navLinks.classList.contains('active') ? closeMenu() : openMenu();
        });

        /* Close when tapping the backdrop (body::before overlay) */
        document.body.addEventListener('click', e => {
            if (
                navLinks.classList.contains('active') &&
                !navLinks.contains(e.target) &&
                !mobileBtn.contains(e.target)
            ) {
                closeMenu();
            }
        });

        /* Close on Escape key */
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });
    }


    /* ─────────────────────────────────────────────
       3.  Mobile dropdowns — tap to expand / collapse
           (inject chevron arrows into parent links)
    ───────────────────────────────────────────── */
    const dropdownParents = document.querySelectorAll('.dropdown > a');

    // Inject a <span class="arrow"></span> into each dropdown parent link
    dropdownParents.forEach(link => {
        if (!link.querySelector('.arrow')) {
            const arrow = document.createElement('span');
            arrow.className = 'arrow';
            arrow.setAttribute('aria-hidden', 'true');
            link.appendChild(arrow);
        }

        link.addEventListener('click', e => {
            // Only intercept on mobile widths
            if (window.innerWidth > 768) return;

            e.preventDefault();
            e.stopPropagation();

            const dropdown = link.parentElement;
            const isOpen   = dropdown.classList.contains('open');

            // Close all other open dropdowns
            document.querySelectorAll('.dropdown.open').forEach(d => {
                if (d !== dropdown) d.classList.remove('open');
            });

            // Toggle this one
            dropdown.classList.toggle('open', !isOpen);
        });
    });

    /* Close menu when user clicks an actual destination link (not parent) */
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            // Skip dropdown parent links (they're handled above on mobile)
            const isDropdownParent = link.parentElement.classList.contains('dropdown') &&
                                     !link.closest('.dropdown-content');
            if (!isDropdownParent) {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 768) closeMenu();
                });
            }
        });
    }


    /* ─────────────────────────────────────────────
       4.  Scroll-reveal animations (Intersection Observer)
    ───────────────────────────────────────────── */
    const animatedEls = document.querySelectorAll(
        '.fade-in, .glass-card, .feature-item, .about-text'
    );

    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                obs.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px', threshold: 0.12 });

    animatedEls.forEach(el => revealObserver.observe(el));


    /* ─────────────────────────────────────────────
       5.  Smooth scroll for in-page anchor links
    ───────────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                const offset = 80;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - offset,
                    behavior: 'smooth'
                });
            }
        });
    });


    /* ─────────────────────────────────────────────
       6.  Accordion interactive gallery
    ───────────────────────────────────────────── */
    const accordionItems = document.querySelectorAll('.accordion-item');

    if (accordionItems.length > 0) {
        accordionItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                accordionItems.forEach(el => el.classList.remove('active'));
                item.classList.add('active');
            });
            item.addEventListener('focus', () => {
                accordionItems.forEach(el => el.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

});
