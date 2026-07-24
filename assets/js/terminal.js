/* ==========================================================================
   Portfolio terminal — interactions
   ========================================================================== */
(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ----- Typing effect -------------------------------------------------- */
    function typeText(el, phrases, opts) {
        const settings = Object.assign(
            { typeSpeed: 55, deleteSpeed: 28, holdTime: 1600, loop: true },
            opts || {}
        );

        if (reduceMotion) {
            el.textContent = phrases[0] || '';
            return;
        }

        let phraseIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function tick() {
            const current = phrases[phraseIndex] || '';

            if (!deleting) {
                charIndex++;
                el.textContent = current.slice(0, charIndex);
                if (charIndex === current.length) {
                    if (!settings.loop && phraseIndex === phrases.length - 1) return;
                    deleting = true;
                    return setTimeout(tick, settings.holdTime);
                }
                return setTimeout(tick, settings.typeSpeed);
            }

            charIndex--;
            el.textContent = current.slice(0, charIndex);
            if (charIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                return setTimeout(tick, settings.typeSpeed);
            }
            return setTimeout(tick, settings.deleteSpeed);
        }

        tick();
    }

    /* ----- Reveal au scroll ---------------------------------------------- */
    function initReveal() {
        const items = document.querySelectorAll('.reveal');
        if (!items.length) return;

        if (reduceMotion || !('IntersectionObserver' in window)) {
            items.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        items.forEach((el) => observer.observe(el));
    }

    /* ----- Horloge du header --------------------------------------------- */
    function initClock() {
        const clock = document.querySelector('[data-clock]');
        if (!clock) return;
        const update = () => {
            clock.textContent = new Date().toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
        };
        update();
        setInterval(update, 1000);
    }

    /* ----- Init ----------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {
        const typeEl = document.querySelector('[data-type]');
        if (typeEl) {
            let phrases = [];
            try {
                phrases = JSON.parse(typeEl.getAttribute('data-type') || '[]');
            } catch (e) {
                phrases = [typeEl.getAttribute('data-type') || ''];
            }
            typeText(typeEl, phrases);
        }
        initReveal();
        initClock();
    });
})();
