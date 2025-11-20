import * as THREE from "three";

export class Player{

    constructor(scene) {
        this.scene = scene;

        // Vitesse de déplacement
        this.speed = 6;

        // Stockage de la direction voulue
        this.direction = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };

        this.createMesh();
        this.initControls();
    }

    createMesh() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 0.5, 0);

        this.scene.add(this.mesh);
    }

    initControls() {
        window.addEventListener("keydown", e => this.handleKey(e, true));
        window.addEventListener("keyup", e => this.handleKey(e, false));
    }

    handleKey(e, isDown) {
        switch (e.key.toLowerCase()) {
            case "z":
            case "w":
                this.direction.forward = isDown;
                break;
            case "s":
                this.direction.backward = isDown;
                break;
            case "q":
            case "a":
                this.direction.left = isDown;
                break;
            case "d":
                this.direction.right = isDown;
                break;
        }
    }

    update(dt) {
        if (!dt) return;

        const move = this.speed * dt;

        if (this.direction.forward) this.mesh.position.z -= move;
        if (this.direction.backward) this.mesh.position.z += move;
        if (this.direction.left) this.mesh.position.x -= move;
        if (this.direction.right) this.mesh.position.x += move;
    }
}