document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animations (Interactive 3D)
    const heroTl = gsap.timeline();

    // Initial Reveal
    heroTl.from(".hero-layer[data-depth='0.2'] h1", { // Back Text
        scale: 0.8,
        opacity: 0,
        duration: 2,
        ease: "power3.out"
    })
        .from(".hero-dish", { // Dish
            y: 100,
            opacity: 0,
            rotateX: 45,
            duration: 1.5,
            ease: "back.out(1.2)"
        }, "-=1.5")
        .from(".hero-content-3d h1 span", { // Front Text splits
            y: 100,
            opacity: 0,
            stagger: 0.2,
            duration: 1.5,
            ease: "power3.out"
        }, "-=1")
        .from(".reveal-hero", { // CTA
            opacity: 0,
            y: 20,
            duration: 1
        }, "-=0.5");

    // Interactive Parallax & Tilt
    const heroSection = document.querySelector('#hero');
    const heroDishContainer = document.querySelector('.hero-dish-container');
    const heroLayers = document.querySelectorAll('.hero-layer');

    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX - innerWidth / 2) / (innerWidth / 2); // -1 to 1
            const y = (e.clientY - innerHeight / 2) / (innerHeight / 2); // -1 to 1

            // Tilt the Dish
            gsap.to(heroDishContainer, {
                rotateY: x * 15, // Tilt X axis based on cursor X
                rotateX: -y * 15, // Tilt Y axis based on cursor Y
                duration: 0.5,
                ease: "power2.out"
            });

            // Parallax other layers
            heroLayers.forEach(layer => {
                const depth = parseFloat(layer.getAttribute('data-depth')) || 0.1;
                gsap.to(layer, {
                    x: x * 50 * depth,
                    y: y * 50 * depth,
                    duration: 1,
                    ease: "power2.out"
                });
            });
        });

        // Reset on leave
        heroSection.addEventListener('mouseleave', () => {
            gsap.to(heroDishContainer, {
                rotateY: 0,
                rotateX: 0,
                duration: 1,
                ease: "power2.out"
            });

            heroLayers.forEach(layer => {
                gsap.to(layer, {
                    x: 0,
                    y: 0,
                    duration: 1,
                    ease: "power2.out"
                });
            });
        });
    }

    // Scroll Animations for Sections
    const scrollElements = document.querySelectorAll('[data-scroll]');

    scrollElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Menu Item Hover Effect (Parallaxish)
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = item.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;

            gsap.to(item.querySelector('img'), {
                x: x * 20,
                y: y * 20,
                scale: 1.15,
                duration: 0.5
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item.querySelector('img'), {
                x: 0,
                y: 0,
                scale: 1, // Reset to CSS hover scale handled by CSS or 1
                duration: 0.5
            });
        });
    });
});
