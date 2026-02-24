/**
 * Scroll Reveal Animations — IntersectionObserver
 * Elements with [data-animate] will fade/slide in when scrolled into view.
 */
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('[data-animate]');

    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    // Navbar scroll effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // Mobile hamburger toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // Cloud provider dropdown toggles
    document.querySelectorAll('.cloud-provider-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const services = btn.nextElementSibling;
            const isOpen = btn.classList.contains('open');

            // Close all others first
            document.querySelectorAll('.cloud-provider-toggle.open').forEach(other => {
                if (other !== btn) {
                    other.classList.remove('open');
                    other.setAttribute('aria-expanded', 'false');
                    other.nextElementSibling.classList.remove('open');
                }
            });

            // Toggle this one
            btn.classList.toggle('open', !isOpen);
            btn.setAttribute('aria-expanded', !isOpen);
            services.classList.toggle('open', !isOpen);
        });
    });
});
