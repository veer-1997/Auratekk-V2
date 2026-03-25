document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Custom Cursor
    const cursor = document.querySelector('.cursor-follower');
    if (cursor) {
        const moveCursor = (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power2.out'
            });
        };
        document.addEventListener('mousemove', moveCursor);

        const hoverElements = document.querySelectorAll('a, button, .glass-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });
    }

    // 3D Tilt Effect for Typed Text
    const tiltContainer = document.querySelector('.tilt-card-container');
    if (tiltContainer) {
        document.addEventListener('mousemove', (e) => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX - innerWidth / 2) / 35; // Divide to reduce sensitivity
            const y = (e.clientY - innerHeight / 2) / 35;

            gsap.to(tiltContainer, {
                rotationY: x,
                rotationX: -y,
                duration: 1,
                ease: 'power2.out'
            });
        });
    }

    // Kinetic Hero Animation
    const heroTimeline = gsap.timeline({ delay: 0.5 });

    heroTimeline.to('.reveal-hero', {
        y: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power4.out'
    }).to('.reveal-hero-line', {
        scaleX: 1,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    }, "-=1");

    // Parallax Hero Background
    gsap.to('#hero-bg img', {
        scale: 1.25,
        y: '25%',
        scrollTrigger: {
            trigger: 'header',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5
        }
    });

    // Runway Horizontal Scroll
    const runwayContainer = document.querySelector('#runway-container');
    if (runwayContainer) {
        const totalWidth = runwayContainer.scrollWidth;
        const viewportWidth = window.innerWidth;

        gsap.to(runwayContainer, {
            x: () => -(totalWidth - viewportWidth + 150),
            ease: 'none',
            scrollTrigger: {
                trigger: '#runway-wrapper',
                pin: true,
                scrub: 1,
                start: 'top top',
                end: () => `+=${totalWidth}`,
                anticipatePin: 1
            }
        });
    }

    // Fade in elements on scroll
    gsap.utils.toArray('[data-scroll]').forEach(element => {
        gsap.from(element, {
            y: 60,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });
});
