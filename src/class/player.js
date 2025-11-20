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

        // Saut
        this.velocityY = 0;      // vitesse verticale
        this.gravity = -20;      // gravité
        this.jumpPower = 8;      // puissance du saut
        this.isGrounded = true;  // joueur au sol ?

        this.createMesh();
        this.initControls();
    }

    createMesh() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 0.5, 0); // 0.5 pour que le cube repose sur le sol

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
            case " ": // espace pour sauter
                if (isDown && this.isGrounded) {
                    this.velocityY = this.jumpPower;
                    this.isGrounded = false;
                }
                break;
        }
    }

    update(dt) {
        if (!dt) return;

        const move = this.speed * dt;

        // Mouvement horizontal
        if (this.direction.forward) this.mesh.position.z -= move;
        if (this.direction.backward) this.mesh.position.z += move;
        if (this.direction.left) this.mesh.position.x -= move;
        if (this.direction.right) this.mesh.position.x += move;

        // Gravité & saut
        this.velocityY += this.gravity * dt;
        this.mesh.position.y += this.velocityY * dt;

        // Collision simple avec le sol
        if (this.mesh.position.y <= 0.5) { // 0.5 = moitié du cube
            this.mesh.position.y = 0.5;
            this.velocityY = 0;
            this.isGrounded = true;
        }
    }   
}