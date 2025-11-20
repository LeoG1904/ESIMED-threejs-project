import * as THREE from "three";
import { Enemy } from "./enemy.js";

export class EnemyManager {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.enemies = [];

        this.spawnInterval = 2; // en secondes
        this.timeSinceLastSpawn = 0;

        this.kills = 0; // compteur d'ennemis tués
    }

    update(dt) {
        if (!dt) return;

        const minInterval = 0.1; // intervalle minimal pour ne pas spammer
        this.spawnInterval -= dt*0.05;


        // Temps écoulé depuis le dernier spawn
        this.timeSinceLastSpawn += dt;

        if (this.timeSinceLastSpawn >= Math.max(this.spawnInterval , minInterval)) {
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
