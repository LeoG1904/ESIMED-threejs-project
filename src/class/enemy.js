import * as THREE from "three";
export class Enemy {
    constructor(scene, player, position = new THREE.Vector3()) {
        this.scene = scene;
        this.player = player;
        this.baseSpeed = 2 + Math.random() * 2 // entre 2 et 4
        this.speed = this.baseSpeed
        this.globalSpeedBoost = 1
        this.damage = 10; // dégâts infligés au joueur
        this.health = 50;

        // Variation de taille aléatoire (0.8 à 1.2 fois la taille standard)
        const scale = 0.8 + Math.random() * 0.4;

        // Variation de couleur rouge-orange légèrement aléatoire
        const r = 1.0; // rouge fixe
        const g = Math.random() * 0.5; // vert aléatoire 0-0.5
        const b = 0; // bleu fixe
        const color = new THREE.Color(r, g, b);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color });
        this.mesh = new THREE.Mesh(geometry, material);

        this.mesh.scale.set(scale, scale, scale);

        this.mesh.position.copy(position);
        this.mesh.position.y = 0.5 * scale; // ajuster pour que ça touche le sol

        this.scene.add(this.mesh);
    }

    update(dt) {
        if (!dt) return;

        // Direction vers le joueur
        const direction = new THREE.Vector3().subVectors(
            this.player.mesh.position,
            this.mesh.position
        );
        direction.y = 0; // mouvement sur XZ uniquement
        direction.normalize();

        // Déplacement
        this.mesh.position.add(direction.multiplyScalar(this.speed * this.globalSpeedBoost * dt));

        // Collision avec le joueur
        this.checkCollision();
    }

    checkCollision() {
        const distance = this.mesh.position.distanceTo(this.player.mesh.position);
        const collisionDistance = 1; // seuil de collision (taille des cubes)

        if (distance < collisionDistance) {
            // Appliquer les dégâts et éviter double collision instantanée
            if (!this.hasHit) {
                this.player.health -= this.damage;
                if (this.player.health < 0) this.player.health = 0;
                this.player.updateHealthBar();
                this.hasHit = true;

                // On peut repousser légèrement l'ennemi pour éviter plusieurs hits instantanés
                const pushBack = new THREE.Vector3().subVectors(
                    this.mesh.position,
                    this.player.mesh.position
                ).normalize().multiplyScalar(0.5);
                this.mesh.position.add(pushBack);

                // Réactiver après un petit délai pour pouvoir infliger à nouveau des dégâts
                setTimeout(() => (this.hasHit = false), 500); // 0.5s
            }
        }
    }
}
