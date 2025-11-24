import * as THREE from "three"
import {getRandomRarity, RARITIES, UPGRADES} from "../Upgrade.js"
import {addScore} from "../leaderBoard.js";
import {PlayerMovement} from "./PlayerMovement.js";
import {PlayerCombat} from "./PlayerCombat.js";
import {PlayerHealth} from "./PlayerHealth.js";
import {PlayerXP} from "./PlayerXP.js";
import {PlayerSound} from "./PlayerSound.js";

export class Player {

    constructor(scene, enemyManager,ui) {
        this.isDead = false
        this.isPaused = false
        this.isLevelUp = false

        this.scene = scene
        this.enemyManager = enemyManager
        this.ui = ui

        this.movement = new PlayerMovement(this);
        this.combat = new PlayerCombat(this);
        this.healthManager = new PlayerHealth(this);
        this.xp = new PlayerXP(this);
        this.sounds = new PlayerSound();

        this.createMesh()
    }

    update(dt) {
        if (!dt || this.isPaused) return;

        this.movement.update(dt);
        this.combat.update(dt);
        this.healthManager.update(dt);
        this.healthManager.updateUI();
        this.xp.updateUI();
    }

    createMesh() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ffcc, flatShading: true });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 0.5, 0);

        this.mesh.castShadow = true

        this.scene.add(this.mesh);
    }

    die() {
        this.sounds.playDeath()
        this.isDead = true
        this.isPaused = true;
        const screen = document.getElementById("death-screen")
        const killsLabel = document.getElementById("death-kills")
        const timeLabel = document.getElementById("death-time")

        // Affiche les infos
        killsLabel.textContent = `Enemies killed: ${this.ui.killsData.kills}`
        timeLabel.textContent = `Survived: ${this.ui.timerData.time}`

        screen.style.display = "flex";
        const name = prompt("Enter your name for the leaderboard:", "Player");

        addScore(name, this.enemyManager.kills, this.ui.timerData.time);


        // Freeze le joueur
        this.speed = 0
        this.fireRate = 99999
    }
    showDamageFlash() {
        const flash = document.getElementById("damage-flash");
        flash.style.opacity = 1;

        // Retour à transparent rapidement
        setTimeout(() => {
            flash.style.opacity = 0;
        }, 100); // flash 0.1s
    }

}
