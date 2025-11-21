import * as THREE from 'three';

const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
camera.position.z = 10;
camera.position.y = 10;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Lumières
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

// Création des cubes flottants
const cubes = [];
for (let i = 0; i < 500; i++) {
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
    scene.add(cube);
    cubes.push(cube);
}

// Animation
function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.001;

    cubes.forEach(cube => {
        // Petit mouvement vertical
        cube.position.y += Math.sin(time + cube.position.x) * 0.01 * cube.userData.speed;
        // Rotation sur plusieurs axes
        cube.rotation.x += 0.01 * cube.userData.speed;
        cube.rotation.y += 0.01 * cube.userData.speed;
    });

    // Camera qui tourne légèrement
    camera.position.x = Math.sin(time * 0.1) * 10;
    camera.position.z = 15 + Math.cos(time * 0.1) * 5;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}

animate();
