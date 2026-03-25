document.addEventListener('DOMContentLoaded', () => {
    // GSAP Scroll Animations
    gsap.registerPlugin(ScrollTrigger);

    // Hero Entry
    const heroTl = gsap.timeline();
    heroTl.from(".hero-content > *", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out"
    })
        .from(".animate-float", {
            scale: 0.9,
            opacity: 0,
            duration: 1,
            ease: "back.out(1.7)"
        }, "-=0.5");

    // Appointment Widget Hover
    const widget = document.querySelector('.fixed.bottom-8');
    if (widget) {
        widget.addEventListener('mouseenter', () => {
            gsap.to(widget, { scale: 1.1, duration: 0.3, ease: "back.out(1.7)" });
        });
        widget.addEventListener('mouseleave', () => {
            gsap.to(widget, { scale: 1, duration: 0.3 });
        });
    }

    // --- Scroll Animations ---

    // Services / Features
    gsap.to(".service-card", {
        scrollTrigger: {
            trigger: "#features",
            start: "top 80%",
        },
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out"
    });

    // How It Works (Steps)
    gsap.from("#how-it-works .relative.z-10", {
        scrollTrigger: {
            trigger: "#how-it-works",
            start: "top 80%",
        },
        y: 30,
        opacity: 0,
        stagger: 0.3,
        duration: 1,
        ease: "back.out(1.7)"
    });

    // Animate the connecting line
    gsap.from("#how-it-works .absolute.top-12", {
        scrollTrigger: {
            trigger: "#how-it-works",
            start: "top 80%",
        },
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.5,
        ease: "power3.out"
    });

    // Doctors
    gsap.from("#doctors .group", {
        scrollTrigger: {
            trigger: "#doctors",
            start: "top 80%",
        },
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out"
    });

    // Testimonials & FAQ
    gsap.from("#testimonials > div", {
        scrollTrigger: {
            trigger: "#testimonials",
            start: "top 80%",
        },
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out"
    });

    // --- Interaction Logic ---

    // FAQ Accordion (Replaces inline onclick for better control)
    const faqItems = document.querySelectorAll('#testimonials button');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const content = item.nextElementSibling;
            const arrow = item.querySelector('.arrow');

            // Toggle current
            content.classList.toggle('hidden');
            arrow.classList.toggle('rotate-180');

            // Optional: Close others? Keeping it simple for now as requested.
        });
    });

    // Interactive diagnosis button (Mock)
    const diagnosisBtn = document.querySelector('button.bg-blue-600');
    if (diagnosisBtn) {
        diagnosisBtn.addEventListener('click', () => {
            diagnosisBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span> Analyzing...';
            setTimeout(() => {
                diagnosisBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Analysis Complete';
                diagnosisBtn.classList.add('bg-green-600');
                diagnosisBtn.classList.remove('bg-blue-600');
            }, 2000);
        });
    }
});
