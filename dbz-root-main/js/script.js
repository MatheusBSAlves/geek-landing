function initFloatingNav() {
    const nav = document.querySelector(".floating-nav");
    const hero = document.getElementById("hero");
    if (!nav || !hero) return;

    const links = nav.querySelectorAll(".floating-nav__link");
    const sectionIds = ["hero", "personagens", "trailers", "saga"];
    const sections = sectionIds
        .map(function (id) { return document.getElementById(id); })
        .filter(Boolean);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function getThreshold() {
        return hero.offsetHeight * 0.6;
    }

    function updateVisibility() {
        nav.classList.toggle("floating-nav--visible", window.scrollY >= getThreshold());
    }

    function setActiveLink(sectionId) {
        links.forEach(function (link) {
            const isActive = link.dataset.section === sectionId;
            link.classList.toggle("floating-nav__link--active", isActive);
            if (isActive) {
                link.setAttribute("aria-current", "true");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    function initScrollSpy() {
        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        setActiveLink(entry.target.id);
                    }
                });
            },
            {
                root: null,
                rootMargin: "-40% 0px -40% 0px",
                threshold: 0
            }
        );

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    function initAnchorScroll() {
        links.forEach(function (link) {
            link.addEventListener("click", function (event) {
                const targetId = link.getAttribute("href").slice(1);
                const target = document.getElementById(targetId);
                if (!target) return;

                event.preventDefault();

                if (prefersReducedMotion) {
                    target.scrollIntoView();
                } else {
                    target.scrollIntoView({ behavior: "smooth" });
                }
            });
        });
    }

    let ticking = false;
    window.addEventListener("scroll", function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
            updateVisibility();
            ticking = false;
        });
    }, { passive: true });

    window.addEventListener("resize", updateVisibility, { passive: true });

    updateVisibility();
    initScrollSpy();
    initAnchorScroll();
}

document.addEventListener("DOMContentLoaded", function () {
    initFloatingNav();
    initPersonagensBlueprint();
});
