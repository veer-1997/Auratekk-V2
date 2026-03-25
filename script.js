
// Theme Management Logic
function initThemeAndMisc() {
    const html = document.documentElement;

    // Force dark mode
    html.classList.add('dark');
    localStorage.theme = 'dark';

    // --- Header Scroll Logic ---
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 3D Hero Scene Implementation ---
    let heroScene;
    try {
        if (!window.__heroSceneInitialized) {
            heroScene = initHeroScene();
            // Initial Theme Update for 3D Scene
            if (heroScene) {
                heroScene.updateTheme(true);
            }
            window.__heroSceneInitialized = true;
        }
    } catch (error) {
        console.error("Hero Scene Init Failed:", error);
    }

    // --- Mobile Menu Logic ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileAccordionTriggers = document.querySelectorAll('.mobile-accordion-trigger');

    if (mobileMenuBtn && mobileMenu && !mobileMenuBtn._hasMenuLogic) {
        mobileMenuBtn._hasMenuLogic = true;
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('translate-x-full');
            document.body.classList.add('overflow-hidden');
        });
    }

    if (mobileMenuClose && mobileMenu && !mobileMenuClose._hasMenuLogic) {
        mobileMenuClose._hasMenuLogic = true;
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.add('translate-x-full');
            document.body.classList.remove('overflow-hidden');
        });
    }

    // Mobile Accordion Logic
    mobileAccordionTriggers.forEach(trigger => {
        if (trigger._hasAccordionLogic) return;
        trigger._hasAccordionLogic = true;
        
        trigger.addEventListener('click', () => {
            const content = trigger.nextElementSibling;
            const icon = trigger.querySelector('.material-symbols-outlined');

            // Toggle Hidden Class
            content.classList.toggle('hidden');

            // Rotate Icon
            if (content.classList.contains('hidden')) {
                icon.style.transform = 'rotate(0deg)';
            } else {
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // Demo Carousel Navigation
    const demoCarousel = document.getElementById('demo-carousel');
    const scrollLeftBtn = document.getElementById('demo-scroll-left');
    const scrollRightBtn = document.getElementById('demo-scroll-right');

    if (demoCarousel && scrollLeftBtn && scrollRightBtn && !scrollLeftBtn._hasCarouselLogic) {
        scrollLeftBtn._hasCarouselLogic = true;
        scrollLeftBtn.addEventListener('click', () => {
            demoCarousel.scrollBy({
                left: -400,
                behavior: 'smooth'
            });
        });

        scrollRightBtn.addEventListener('click', () => {
            demoCarousel.scrollBy({
                left: 400,
                behavior: 'smooth'
            });
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeAndMisc);
} else {
    setTimeout(initThemeAndMisc, 100);
}

function initHeroScene() {
    const container = document.getElementById('hero-canvas-container');
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const clock = new THREE.Clock();

    // Mouse tracking variables
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // --- Aurora Particle System ---
    const particlesGroup = new THREE.Group();
    scene.add(particlesGroup);

    let particlesMesh = null;

    // Configuration
    const particleCount = 3000;
    const spreadX = 50; // Width of the aurora
    const colorDark = 0xC5A059; // Gold
    const colorLight = 0xB08D55; // Bronze

    // Create Geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3); // Store for wave calc
    const scales = new Float32Array(particleCount);
    const randomness = new Float32Array(particleCount * 3); // Individual particle drift

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // X: Spread wide (-25 to 25)
        const x = (Math.random() - 0.5) * spreadX;

        // Y & Z: Condensed circle / Cylinder shape following a curve
        // We want a "ship" or "circle" feel, so let's make a toroid slice or cylinder
        const radius = 4 + Math.random() * 2; // Base radius of the "tube"
        const angle = (x / spreadX) * Math.PI * 2; // Twist along the length

        // Condensed circle vertically
        const ringAngle = Math.random() * Math.PI * 2;
        const ringRadius = 1.5 + Math.random(); // Thickness of the aurora band

        // Base Position (condensed circle flowing in a line)
        // A sine wave path for the "ship"
        const curveY = Math.sin(x * 0.2) * 2;
        const curveZ = Math.cos(x * 0.2) * 2;

        const y = curveY + Math.sin(ringAngle) * ringRadius;
        const z = curveZ + Math.cos(ringAngle) * ringRadius;

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        // Store original for animation reference
        originalPositions[i3] = x;
        originalPositions[i3 + 1] = y;
        originalPositions[i3 + 2] = z;

        // Random scale for twinkling
        scales[i] = Math.random();

        // Random drift parameters
        randomness[i3] = Math.random();
        randomness[i3 + 1] = Math.random();
        randomness[i3 + 2] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('originalPosition', new THREE.BufferAttribute(originalPositions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randomness, 3));

    // Create circular particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    // Draw a radial gradient circle
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);

    // Material
    const material = new THREE.PointsMaterial({
        size: 0.08,
        color: document.documentElement.classList.contains('dark') ? colorDark : colorLight,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        map: texture
    });

    particlesMesh = new THREE.Points(geometry, material);
    particlesGroup.add(particlesMesh);

    // Slight tilt to face camera better
    particlesGroup.rotation.z = 0.2;
    particlesGroup.rotation.x = 0.1;


    // Camera Position
    camera.position.z = 8;
    camera.position.y = 0;

    // Mouse Interaction
    const mouse = new THREE.Vector2();
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        if (particlesMesh) {
            const time = clock.getElapsedTime() * 0.5;
            const positions = particlesMesh.geometry.attributes.position.array;
            const originalPositions = particlesMesh.geometry.attributes.originalPosition.array;
            // const randomness = particlesMesh.geometry.attributes.aRandom.array;

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const ox = originalPositions[i3];
                const oy = originalPositions[i3 + 1];
                const oz = originalPositions[i3 + 2];

                // Aurora Wave Effect
                // We displace Y and Z based on X and Time

                // Macroscopic Wave (The whole "ship" moves)
                const macroWave = Math.sin(ox * 0.3 + time) * 0.5;

                // Micro Ripples (Individual strands)
                const microWave = Math.sin(ox * 1.5 + time * 2) * 0.2;

                positions[i3 + 1] = oy + macroWave + microWave;
                positions[i3 + 2] = oz + Math.cos(ox * 0.3 + time) * 0.5;
            }

            particlesMesh.geometry.attributes.position.needsUpdate = true;

            // Gentle group rotation for parallax feel
            particlesGroup.rotation.y = Math.sin(time * 0.1) * 0.1;
        }

        // Mouse interaction for parallax (scene root rotation)
        targetX = mouseX * 0.0005;
        targetY = mouseY * 0.0005;

        // Smooth rotation based on mouse - Rotate the particle group for parallax
        particlesGroup.rotation.y += 0.02 * (targetX - particlesGroup.rotation.y);
        particlesGroup.rotation.x += 0.02 * (targetY - particlesGroup.rotation.x);

        renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- Theme Update Logic ---
    function updateTheme(isDark) {
        if (!particlesMesh) return;

        if (isDark) {
            // Dark Mode
            particlesMesh.material.color.setHex(0xC5A059); // Gold
            particlesMesh.material.opacity = 0.8;
            renderer.setClearColor(0x000000, 0); // Transparent
        } else {
            // Light Mode
            particlesMesh.material.color.setHex(0xB08D55); // Darker Gold/Bronze
            particlesMesh.material.opacity = 0.9;
            renderer.setClearColor(0x000000, 0);
        }
    }

    return { updateTheme };
}

// --- Generic Modal Functions ---
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Trigger animation
    setTimeout(() => {
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.95)';
        modal.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';

        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        });
    }, 10);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Animate out
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.95)';

    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');

        // Only reset overflow if no other modals are open (simple check)
        // For now, we assume only one modal is open at a time for simplicity
        document.body.style.overflow = '';
    }, 300);
}

// --- Industry Modal Functions ---
function openIndustryModal(industryId) {
    const allContent = document.querySelectorAll('.industry-content');
    const targetContent = document.getElementById(`modal-${industryId}`);

    // Hide all industry content
    allContent.forEach(content => content.classList.add('hidden'));

    // Show target industry content
    if (targetContent) {
        targetContent.classList.remove('hidden');
    }

    openModal('industryModal');
}

function closeIndustryModal() {
    closeModal('industryModal');
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeIndustryModal();
        closeServiceModal();
        closeContactModal();
    }
});

// --- Service Modal Functions (Dynamic) ---
function openServiceModal(serviceId) {
    if (typeof serviceDetails === 'undefined') {
        console.error("Service details payload not loaded");
        return;
    }

    const modal = document.getElementById('service-modal');
    const details = serviceDetails[serviceId];

    if (!modal) {
        console.error("Service modal element not found");
        return;
    }

    if (!details) {
        console.error("Details not found for service ID:", serviceId);
        // Fallback or just return?
        return;
    }

    // Populate Content
    const title = details.title || 'Service Details';
    const titleEl = document.getElementById('modal-title');
    const titleMobileEl = document.getElementById('modal-title-mobile');
    if (titleEl) titleEl.textContent = title;
    if (titleMobileEl) titleMobileEl.textContent = title;

    const descEl = document.getElementById('modal-description');
    if (descEl) descEl.textContent = details.long_desc || '';

    const quoteEl = document.getElementById('modal-quote');
    if (quoteEl) quoteEl.textContent = details.quote || '';

    // Image Handling
    const imgEl = document.getElementById('modal-image');
    if (imgEl && details.image) {
        let prefix = '';
        // Simple check for subdirectory
        if (window.location.pathname.includes('/services/') || window.location.href.includes('/services/')) {
            prefix = '../';
        }
        imgEl.src = `${prefix}assets/images/heroes/${details.image}`;
    }

    // Bullets
    const bulletList = document.getElementById('modal-bullets');
    if (bulletList) {
        bulletList.innerHTML = ''; // Clear existing
        if (details.bullets && Array.isArray(details.bullets)) {
            details.bullets.forEach(bullet => {
                const li = document.createElement('li');
                li.className = "flex items-start gap-3";
                li.innerHTML = `
                    <span class="material-symbols-outlined text-accent-gold mt-1 text-sm">arrow_right_alt</span>
                    <span class="text-slate-600 dark:text-slate-300 text-base">${bullet}</span>
                `;
                bulletList.appendChild(li);
            });
        }
    }

    // Show Modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Animation
    setTimeout(() => {
        const backdrop = document.getElementById('modal-backdrop');
        const content = document.getElementById('modal-content');

        if (backdrop) backdrop.classList.remove('opacity-0');
        if (content) {
            content.classList.remove('opacity-0', 'scale-95');
            content.classList.add('scale-100');
        }
    }, 10);

    document.body.style.overflow = 'hidden';
}

function closeServiceModal() {
    const modal = document.getElementById('service-modal');
    if (!modal) return;

    const backdrop = document.getElementById('modal-backdrop');
    const content = document.getElementById('modal-content');

    if (backdrop) backdrop.classList.add('opacity-0');
    if (content) {
        content.classList.remove('scale-100');
        content.classList.add('opacity-0', 'scale-95');
    }

    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    }, 300);
}

// --- Contact Modal Logic ---
function openContactModal() {
    openModal('contactModal');
}

function closeContactModal() {
    closeModal('contactModal');
}

// --- Path to Success Animation ---
function initPathToSuccess() {
    const section = document.getElementById('path-to-success-section');
    const orb = document.getElementById('catalyst-orb');
    const stages = document.querySelectorAll('.success-stage');

    if (!section || !orb || stages.length === 0) return;

    // Remove old observer if re-initializing
    if (section._hasSuccessObserver) return;
    section._hasSuccessObserver = true;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runSuccessAnimation();
                observer.unobserve(section); // Run once
            }
        });
    }, { threshold: 0.5 });

    observer.observe(section);

    function runSuccessAnimation() {
        // Extract timing variables
        stages.forEach(stage => stage.classList.remove('active-stage'));
        orb.style.transition = 'none';
        orb.style.left = '0%';
        orb.style.opacity = '1';

        setTimeout(() => {
            orb.style.transition = 'left 2s linear';
            orb.style.left = '100%';
        }, 100);

        const triggers = [200, 500, 800, 1100, 1400, 1700];

        triggers.forEach((time, index) => {
            if (stages[index]) {
                setTimeout(() => {
                    stages[index].classList.add('active-stage');
                }, time);
            }
        });

        setTimeout(() => {
            orb.style.opacity = '0';
        }, 2200);
    }
}

// Execute immediately if DOM is ready, otherwise wait. Use MutationObserver for React hydration safety
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPathToSuccess);
} else {
    // Timeout to ensure React has painted
    setTimeout(initPathToSuccess, 100);
}

// Ensure it binds when Next.js navigates
const observer = new MutationObserver(() => {
    if (document.getElementById('path-to-success-section') && !document.getElementById('path-to-success-section')._hasSuccessObserver) {
        initPathToSuccess();
    }
});
observer.observe(document.body, { childList: true, subtree: true });

// =========================================================================
// --- Unified HubSpot Contact Form Integration ---
// =========================================================================

/**
 * Handles form submission directly to the HubSpot API.
 * 
 * @param {HTMLFormElement} formElement - The form DOM element being submitted.
 * @param {HTMLElement} submitButton - The button to disable/animate during submission.
 * @param {Array} fields - Array of objects { name: 'hubspot_field_name', value: 'user_input' }
 */
async function submitToHubSpot(formElement, submitButton, fields) {
    const originalButtonText = submitButton.innerHTML;

    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="relative z-10 flex items-center justify-center gap-3">Transmitting... <span class="material-symbols-outlined animate-spin">sync</span></span>';

    // HubSpot Configuration
    const portalId = '147786509';
    const formId = 'fcbfa3f5-87e9-4947-beff-4a4e2faf7f6d';

    // Construct Payload
    const payload = {
        fields: fields,
        context: {
            pageUri: window.location.href,
            pageName: document.title
        }
    };

    try {
        const response = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // Success
            alert('✅ Transmission Successful! Our team has received your uplink request. We will contact you shortly.');
            formElement.reset();

            // If this was a modal, optinally close it after a delay?
            // Checking if it's the expert form to close modal
            if (formElement.id === 'expertContactForm' && typeof closeContactModal === 'function') {
                closeContactModal();
            }

        } else {
            // Error from HubSpot
            const errorData = await response.json();
            console.error('HubSpot Submission Error:', errorData);
            alert('⚠️ Transmission Interrupted. Please check all fields and try again.');
        }
    } catch (error) {
        console.error('Network Error:', error);
        alert('❌ Network Error: Unable to reach secure server. Please check your connection.');
    } finally {
        // Restore button state
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    }
}

function initHubSpotForms() {

    // --- 1. Main Contact Form (#contactForm) ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm && !contactForm._hasHubSpotEvent) {
        contactForm._hasHubSpotEvent = true;
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = document.getElementById('submitButton') || contactForm.querySelector('button[type="submit"]');

            // Map fields for Main Form
            const fields = [
                { name: 'firstname', value: document.getElementById('firstname')?.value || '' },
                { name: 'email', value: document.getElementById('email')?.value || '' },
                { name: 'phone', value: document.getElementById('phone')?.value || '' },
                { name: 'company', value: document.getElementById('company')?.value || '' },
                { name: 'message', value: document.getElementById('message')?.value || '' }
            ];

            await submitToHubSpot(contactForm, submitButton, fields);
        });
    }

    // --- 2. Expert Contact Form (Modal - #expertContactForm) ---
    const expertForm = document.getElementById('expertContactForm');
    if (expertForm && !expertForm._hasHubSpotEvent) {
        expertForm._hasHubSpotEvent = true;
        expertForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = expertForm.querySelector('button[type="submit"]');

            // Collect values
            const fullName = document.getElementById('expert_full_name')?.value || '';
            const email = document.getElementById('expert_email_address')?.value || '';
            const phone = document.getElementById('expert_phone_number')?.value || '';
            const company = document.getElementById('expert_company_name')?.value || '';
            const projectInterest = document.getElementById('expert_project_interest')?.value || '';

            // Construct Message from Project Interest to ensure it is captured
            // HubSpot default form might not have a 'project_interest' field, so mapping to 'message' or custom field
            // We'll map it to 'message' for now, potentially prefixing it.
            const messageContent = projectInterest ? `Project Interest: ${projectInterest}` : 'Expert Consultation Request';

            // Map fields for Expert Form
            // Note: HubSpot field names must match internal names (firstname, email, phone, company, message)
            const fields = [
                { name: 'firstname', value: fullName },
                { name: 'email', value: email },
                { name: 'phone', value: phone },
                { name: 'company', value: company },
                { name: 'message', value: messageContent }
            ];

            await submitToHubSpot(expertForm, submitButton, fields);
        });
    }
}

function initDemoCards() {
    const cards = document.querySelectorAll('.perspective-container');
    cards.forEach(card => {
        if (!card._hasNavEvent) {
            card._hasNavEvent = true;
            const onclickAttr = card.getAttribute('onclick');
            if (onclickAttr && onclickAttr.includes('window.location.href')) {
                // Extract 'demos/.../index.html'
                const match = onclickAttr.match(/'([^']+)'/);
                if (match && match[1]) {
                    // Remove the inline onclick to avoid CSP or React interference
                    card.removeAttribute('onclick');
                    card.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.location.href = '/' + match[1].replace(/^\/?/, '');
                    });
                }
            }
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initHubSpotForms();
        initDemoCards();
    });
} else {
    setTimeout(() => {
        initHubSpotForms();
        initDemoCards();
    }, 100);
}

// Ensure demo cards bind when Next.js navigates
const demoCardObserver = new MutationObserver(() => {
    if (document.querySelector('.perspective-container:not([_hasNavEvent])')) {
        initDemoCards();
    }
});
demoCardObserver.observe(document.body, { childList: true, subtree: true });

// Explicitly bind functions to window so React components can trigger them
window.openServiceModal = openServiceModal;
window.closeServiceModal = closeServiceModal;
if (typeof openContactModal !== 'undefined') window.openContactModal = openContactModal;
if (typeof closeContactModal !== 'undefined') window.closeContactModal = closeContactModal;
