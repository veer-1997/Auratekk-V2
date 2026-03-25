/**
 * Auratekk custom 3D Galaxy Engine
 * High-performance Three.js particle system
 * No watermarks, 100% custom code.
 */

class GalaxyEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.parameters = {
            count: 70000,
            size: 0.022,           // Slightly bigger than original (was 0.015)
            radius: 6,             // Slightly wider than original (was 5)
            branches: 3,
            spin: 1,
            randomness: 0.2,
            randomnessPower: 3,
            insideColor: '#ff44f0', // Brighter magenta/pink core
            outsideColor: '#2244cc' // Brighter deep blue outer rim
        };

        this.scene = new THREE.Scene();

        // Camera placed to the upper-right, looking down-left
        // This frames the galaxy sweeping from bottom-left up toward top-right
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.x = 4;
        this.camera.position.y = 4;
        this.camera.position.z = 4;
        this.scene.add(this.camera);

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };

        this.init();
        this.addEventListeners();
        this.animate();
    }

    generateParticleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0,   'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(255,255,255,0.85)');
        gradient.addColorStop(0.4, 'rgba(255,255,255,0.25)');
        gradient.addColorStop(1,   'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
        return new THREE.CanvasTexture(canvas);
    }

    init() {
        if (this.points) {
            this.geometry.dispose();
            this.material.dispose();
            this.scene.remove(this.points);
        }

        this.geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.parameters.count * 3);
        const colors    = new Float32Array(this.parameters.count * 3);

        const colorInside  = new THREE.Color(this.parameters.insideColor);
        const colorOutside = new THREE.Color(this.parameters.outsideColor);

        for (let i = 0; i < this.parameters.count; i++) {
            const i3 = i * 3;

            const radius     = Math.random() * this.parameters.radius;
            const spinAngle  = radius * this.parameters.spin;
            const branchAngle = ((i % this.parameters.branches) / this.parameters.branches) * Math.PI * 2;

            const randomX = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * this.parameters.randomness * radius;
            const randomY = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * this.parameters.randomness * radius;
            const randomZ = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * this.parameters.randomness * radius;

            positions[i3]     = Math.cos(branchAngle + spinAngle) * radius + randomX;
            positions[i3 + 1] = randomY;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

            const mixedColor = colorInside.clone();
            mixedColor.lerp(colorOutside, radius / this.parameters.radius);

            colors[i3]     = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

        this.material = new THREE.PointsMaterial({
            size: this.parameters.size,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            transparent: true,
            opacity: 1.0,
            alphaMap: this.generateParticleTexture()
        });

        this.points = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.points);

        // Tilt the galaxy so it reads as a diagonal sweep bottom-left → top
        // X tilt: bring the bottom toward us
        this.points.rotation.x = Math.PI * 0.18;
        // Z tilt: rotate the whole disk so it angles from bottom-left to top-right
        this.points.rotation.z = Math.PI * 0.15;

        // Offset the galaxy center toward the bottom-left in 3D space
        // so it visually fills the left/bottom half of the hero and reaches the top
        this.points.position.x = -1.5;
        this.points.position.y = -0.5;
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        window.addEventListener('mousemove', (event) => {
            this.targetMouse.x = (event.clientX / window.innerWidth  - 0.5) * 2;
            this.targetMouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
        });

        window.addEventListener('touchmove', (event) => {
            if (event.touches.length > 0) {
                this.targetMouse.x = (event.touches[0].clientX / window.innerWidth  - 0.5) * 2;
                this.targetMouse.y = (event.touches[0].clientY / window.innerHeight - 0.5) * 2;
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const elapsedTime = performance.now() * 0.0001;

        // Smooth mouse — same feel as the original
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        // Original rotation speed, same as before
        this.points.rotation.y = elapsedTime * 0.5 + this.mouse.x * 0.2;
        this.points.rotation.z = Math.PI * 0.15 + this.mouse.y * 0.1;

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.heroGalaxy = new GalaxyEngine('hero-canvas-container');
});
