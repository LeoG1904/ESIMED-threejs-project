// PlayerMovement.js
export class PlayerMovement {
    constructor(player) {
        this.player = player;

        // Mouvement horizontal
        this.direction = { forward: false, backward: false, left: false, right: false };
        this.speed = 6;           // valeur de base
        this.speedPerc = 1;       // multiplicateur de vitesse

        // Saut et gravité
        this.velocityY = 0;
        this.gravity = -20;
        this.jumpPower = 8;       // valeur de base
        this.jumpPowerPerc = 1;   // multiplicateur saut
        this.isGrounded = true;

        this.initControls();
    }

    initControls() {
        window.addEventListener("keydown", e => this.handleKey(e, true));
        window.addEventListener("keyup", e => this.handleKey(e, false));
    }

    handleKey(e, isDown) {
        if (this.player.isLevelUp) return; // bloquer les mouvements pendant le level-up

        switch (e.key.toLowerCase()) {
            case "z": case "w": this.direction.forward = isDown; break;
            case "s": this.direction.backward = isDown; break;
            case "q": case "a": this.direction.left = isDown; break;
            case "d": this.direction.right = isDown; break;
            case " ":
                if (isDown && this.isGrounded) {
                    this.velocityY = this.jumpPower * this.jumpPowerPerc;
                    this.isGrounded = false;
                }
                break;
        }
    }

    update(dt) {
        if (!dt) return;

        const move = this.speed * dt * this.speedPerc;
        const mesh = this.player.mesh;

        // Mouvement horizontal
        if (this.direction.forward) mesh.position.z -= move;
        if (this.direction.backward) mesh.position.z += move;
        if (this.direction.left) mesh.position.x -= move;
        if (this.direction.right) mesh.position.x += move;

        // Gravité & saut
        this.velocityY += this.gravity * dt;
        mesh.position.y += this.velocityY * dt;

        if (mesh.position.y <= 0.5) {
            mesh.position.y = 0.5;
            this.velocityY = 0;
            this.isGrounded = true;
        }
    }
}
