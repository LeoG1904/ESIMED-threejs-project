import * as THREE from "three";

export class Enemy {
    constructor(scene, player, position = new THREE.Vector3()) {
        this.scene = scene;
        this.player = player;

        // Vitesse de déplacement
        this.speed = 3;

        // Créer le mesh (cube rouge par défaut)
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(geometry, material);

        this.mesh.position.copy(position);
        this.mesh.position.y = 0.5; // moitié du cube pour poser sur le sol

        this.scene.add(this.mesh);
    }

    update(dt) {
        if (!dt) return;

        // Direction vers le joueur
        const direction = new THREE.Vector3().subVectors(
            this.player.mesh.position,
            this.mesh.position
        );
        direction.y = 0; // on ne bouge que sur le plan XZ
        direction.normalize();

        // Déplacement
        this.mesh.position.add(direction.multiplyScalar(this.speed * dt));
    }
}
