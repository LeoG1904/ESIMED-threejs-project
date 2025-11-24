// /scene/HomeScene.js
import * as THREE from 'three';

export default class HomeScene {
    constructor(canvas, cubeCount = 500) {
        this.canvas = canvas;
        this.cubeCount = cubeCount;

        // Scene
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        this.camera.position.set(0, 10, 10);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Lights
        this.#addLights();

        // Cubes
        this.cubes = [];
        this.#createCubes();

        // Bind animate pour pouvoir l’appeler depuis start()
        this.animate = this.animate.bind(this);
    }

    // ---------- Private Methods ----------

    #addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(5, 10, 5);
        this.scene.add(dirLight);
    }

    #createCubes() {
        for (let i = 0; i < this.cubeCount; i++) {
            const size = Math.random() * 0.5 + 0.2;
            const geometry = new THREE.BoxGeometry(size, size, size);
            const material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(Math.random(), Math.random(), Math.random())
            });

            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(
                (Math.random() - 0.5) * 80,
                Math.random() * 40,
                (Math.random() - 0.5) * 80
            );
            cube.userData = { speed: Math.random() * 0.5 + 0.1 };

            this.scene.add(cube);
            this.cubes.push(cube);
        }
    }

    #updateCubes(time) {
        this.cubes.forEach(cube => {
            cube.position.y += Math.sin(time + cube.position.x) * 0.01 * cube.userData.speed;
            cube.rotation.x += 0.01 * cube.userData.speed;
            cube.rotation.y += 0.01 * cube.userData.speed;
        });
    }

    #updateCamera(time) {
        this.camera.position.x = Math.sin(time * 0.1) * 10;
        this.camera.position.z = 15 + Math.cos(time * 0.1) * 5;
        this.camera.lookAt(0, 0, 0);
    }

    // ---------- Public Methods ----------

    animate() {
        requestAnimationFrame(this.animate);
        const time = Date.now() * 0.001;

        this.#updateCubes(time);
        this.#updateCamera(time);

        this.renderer.render(this.scene, this.camera);
    }

    start() {
        this.animate();
    }

    resize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}
