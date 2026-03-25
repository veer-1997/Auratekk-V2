document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Initial Hero Animation Overrides if needed, otherwise CSS handles simple ones.
    // Let's use GSAP for complex scroll reveals.

    const scrollElements = document.querySelectorAll('[data-scroll]');

    scrollElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Number Counter Animation
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));

        ScrollTrigger.create({
            trigger: counter,
            start: "top 90%",
            once: true,
            onEnter: () => {
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 2,
                    snap: { innerHTML: 0.1 },
                    ease: "power2.out",
                    onUpdate: function () {
                        // Formatting if needed for decimals vs integers
                        if (Number.isInteger(target)) {
                            this.targets()[0].innerHTML = Math.round(this.targets()[0].innerHTML);
                        } else {
                            this.targets()[0].innerHTML = parseFloat(this.targets()[0].innerHTML).toFixed(1) + 's';
                        }
                    }
                });
            }
        });
    });
});
