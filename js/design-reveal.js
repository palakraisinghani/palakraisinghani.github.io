document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("[data-reveal]");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

    if (!("IntersectionObserver" in window) || sections.length === 0 || prefersReducedMotion) {
        sections.forEach((el) => el.classList.add("mg-visible"));
    } else {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("mg-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
        );

        sections.forEach((el) => observer.observe(el));
    }

    // Soft colour-glow that trails the pointer — pure gradient, no imagery.
    if (prefersReducedMotion || isCoarsePointer) {
        return;
    }

    const glow = document.createElement("div");
    glow.className = "mg-cursor-glow";
    document.body.appendChild(glow);

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    document.addEventListener("mousemove", (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    function tick() {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;
        glow.style.transform = `translate(${currentX}px, ${currentY}px)`;
        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
});
