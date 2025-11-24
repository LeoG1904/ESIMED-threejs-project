import * as THREE from "three"
import {getRandomRarity, RARITIES, UPGRADES} from "../upgrade.js"
import {addScore} from "../leaderBoard.js";
import {PlayerMovement} from "./PlayerMovement.js";
import {PlayerCombat} from "./PlayerCombat.js";

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


        // Vie
        this.maxHealth = 100
        this.health = this.maxHealth
        this.autoHealth = 0

        // EXP / Level
        this.level = 1;
        this.exp = 0;
        this.expToNextLevel = 50   // exp nécessaire pour passer au niveau suivant


        this.createMesh()
    }

    updateExpBar() {
        const bar = document.getElementById("exp-bar")
        if (!bar) return
        const percent = (this.exp / this.expToNextLevel) * 100
        bar.style.width = percent + "%"
    }
    gainExp(amount) {
        this.exp += amount
        if (this.exp >= this.expToNextLevel) {
            this.levelUp()
        }
        this.updateExpBar()
    }



    levelUp() {
        this.isLevelUp = true
        this.isPaused = true;

        this.movement.resetDirection();

        this.level++;
        this.exp -= this.expToNextLevel;
        this.expToNextLevel = Math.floor(this.expToNextLevel * 1.05); // croissance exp

        // Prendre 3 upgrades au hasard

        const choices = [...UPGRADES]
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(up => {
                return { ...up, rarity:getRandomRarity() };
            });

        // Demander à l’UI d’afficher le popup
        this.ui.showUpgradesPopup(choices, (upgrade) => {
            upgrade.apply(this, upgrade.rarity.multiplier);   // appliquer l'amélioration
            this.isPaused = false
            this.isLevelUp = false
        });
    }
    createMesh() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ffcc, flatShading: true });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 0.5, 0);

        this.scene.add(this.mesh);
    }

    update(dt) {
        if (!dt || this.isPaused) return;

        // Déplacement géré par PlayerMovement
        this.movement.update(dt);

        // Gestion du combat
        this.combat.update(dt);

        this.health += this.autoHealth * dt
        if (this.health>this.maxHealth) this.health = this.maxHealth

        // Mettre à jour la barre de vie
        this.updateHealthBar();
        if (this.health <= 1 && !this.isDead) {
            this.health = 0;
            this.updateHealthBar();
            this.die();
        }

    }


    updateHealthBar() {
        const bar = document.getElementById("health-bar");
        if (!bar) return;
        const percent = (this.health / this.maxHealth) * 100;
        bar.style.width = percent + "%";

        if (percent > 50) bar.style.backgroundColor = "#0f0";
        else if (percent > 20) bar.style.backgroundColor = "#ff0";
        else bar.style.backgroundColor = "#f00";
    }
    die() {
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
