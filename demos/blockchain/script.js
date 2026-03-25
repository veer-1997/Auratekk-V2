document.addEventListener('DOMContentLoaded', () => {
    // Matrix Rain Effect
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0f0';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawMatrix, 33);

    // Resize Handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // GSAP Scroll Animations
    gsap.registerPlugin(ScrollTrigger);

    gsap.from("#nodes .group", {
        scrollTrigger: {
            trigger: "#nodes",
            start: "top 80%",
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out"
    });

    gsap.from("#roadmap .relative", {
        scrollTrigger: {
            trigger: "#roadmap",
            start: "top 70%",
        },
        x: -50,
        opacity: 0,
        stagger: 0.3,
        duration: 0.8,
        ease: "power2.out"
    });
});
