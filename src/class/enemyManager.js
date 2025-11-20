import * as THREE from "three";
import { Enemy } from "./enemy.js";

export class EnemyManager {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.enemies = [];

        this.spawnInterval = 2; // en secondes
        this.timeSinceLastSpawn = 0;
        this.elapsedTime = 0; // temps total écoulé depuis le début de la partie

    }

    update(dt) {
        if (!dt) return;

        const minInterval = 0.1; // intervalle minimal pour ne pas spammer
        const intervalDecrease = Math.floor(this.elapsedTime / 10) * 0.1;
        const currentInterval = Math.max(this.spawnInterval - intervalDecrease, minInterval);

        // Temps écoulé depuis le dernier spawn
        this.timeSinceLastSpawn += dt;

        if (this.timeSinceLastSpawn >= currentInterval) {
            this.spawnEnemy();
            this.timeSinceLastSpawn = 0;
        }

        // Mettre à jour tous les ennemis
        this.enemies.forEach(enemy => enemy.update(dt));
    }

    spawnEnemy() {
        // Spawn à une distance aléatoire autour du joueur
        const radius = 15;
        const angle = Math.random() * Math.PI * 2;
        const x = this.player.mesh.position.x + Math.cos(angle) * radius;
        const z = this.player.mesh.position.z + Math.sin(angle) * radius;

        const enemy = new Enemy(this.scene, this.player, new THREE.Vector3(x, 0, z));
        this.enemies.push(enemy);
    }
}
