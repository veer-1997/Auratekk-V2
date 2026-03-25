document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger);

    // --- Initial Loading Animation ---
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                initHeroAnimations();
            }, 1000);
        }, 500);
    } else {
        initHeroAnimations();
    }

    function initHeroAnimations() {
        const tl = gsap.timeline();

        // 1. Fade in Video Background
        tl.from('#hero video', { opacity: 0, duration: 2, ease: "power2.out" }, 0);

        // 2. Text Reveal (Staggered)
        tl.to('.reveal-text', {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: "power3.out"
        }, "-=1.0");
    }

    // --- Parallax Interaction (REMOVED for Video Hero) ---
    // const layers = document.querySelectorAll('.layer'); 

    const heroSection = document.getElementById('hero');
    let windowCenterX = window.innerWidth / 2;
    let windowCenterY = window.innerHeight / 2;

    window.addEventListener('resize', () => {
        windowCenterX = window.innerWidth / 2;
        windowCenterY = window.innerHeight / 2;
    });

    // Using IntersectionObserver only for pausing video if needed (optional optimization)
    const video = document.querySelector('video');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (video) {
                if (entry.isIntersecting) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        });
    }, { threshold: 0.1 });

    if (heroSection) observer.observe(heroSection);

    // --- Scroll Animations for New Sections ---

    // Animate Search Bar
    gsap.from("#search-bar .glass-panel", {
        scrollTrigger: {
            trigger: "#search-bar",
            start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    // Animate Categories
    gsap.from("#categories .glass-card", {
        scrollTrigger: {
            trigger: "#categories",
            start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
    });

    // Animate Property Cards
    gsap.from("#featured-properties .glass-card", {
        scrollTrigger: {
            trigger: "#featured-properties",
            start: "top 80%",
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });

    // --- Custom Cursor & Magnetic Interactions ---
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');

    if (cursor && follower) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Immediate update for dot
            gsap.set(cursor, { x: mouseX, y: mouseY });
        });

        // Smooth follower
        gsap.ticker.add(() => {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            gsap.set(follower, { x: followerX, y: followerY });
        });

        // Hover Effects
        const interactiveElements = document.querySelectorAll('a, button, .glass-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('cursor-hover');
                gsap.to(cursor, { scale: 0.5, duration: 0.3 });
                gsap.to(follower, { width: 60, height: 60, duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                follower.classList.remove('cursor-hover');
                gsap.to(cursor, { scale: 1, duration: 0.3 });
                gsap.to(follower, { width: 40, height: 40, duration: 0.3 });
            });
        });
    }

    // Magnetic Buttons
    const magnets = document.querySelectorAll('.magnetic-wrap');
    magnets.forEach((magnet) => {
        magnet.addEventListener('mousemove', moveMagnet);
        magnet.addEventListener('mouseleave', function (event) {
            gsap.to(event.currentTarget, 1, { x: 0, y: 0, ease: "elastic.out(1, 0.3)" });
            gsap.to(event.currentTarget.querySelector('.magnetic-content'), 1, { x: 0, y: 0, ease: "elastic.out(1, 0.3)" });
        });
    });

    function moveMagnet(event) {
        const magnetButton = event.currentTarget;
        const bounding = magnetButton.getBoundingClientRect();
        const magnetsStrength = 40;
        const magnetsStrengthText = 20;

        // Calculate distance from center
        const x = ((event.clientX - bounding.left) / magnetButton.offsetWidth) - 0.5;
        const y = ((event.clientY - bounding.top) / magnetButton.offsetHeight) - 0.5;

        // Move button
        gsap.to(magnetButton, 1, {
            x: x * magnetsStrength,
            y: y * magnetsStrength,
            ease: "power4.out"
        });

        // Move content inside slightly less (parallax effect)
        gsap.to(magnetButton.querySelector('.magnetic-content'), 1, {
            x: x * magnetsStrengthText,
            y: y * magnetsStrengthText,
            ease: "power4.out"
        });
    }

    // --- 3D Tilt for Hero Text ---
    const heroTitle = document.querySelector('.hero-title-container'); // Need to ensure this class exists or target h1
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const xVal = (e.clientX - windowCenterX) / 40;
            const yVal = (e.clientY - windowCenterY) / 40;

            gsap.to('.hero-title-tilt', {
                rotationY: xVal,
                rotationX: -yVal,
                transformPerspective: 1000,
                ease: "power1.out",
                duration: 1
            });
        });
    }

});
