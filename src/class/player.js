import * as THREE from "three"
import {RARITIES, UPGRADES} from "./upgrade.js"

export class Player {

    constructor(scene, enemyManager,ui) {

        this.isPaused = false
        this.isLevelUp = false

        this.scene = scene
        this.enemyManager = enemyManager
        this.ui = ui

        // Mouvement
        this.speed = 6
        this.speedPerc = 1
        this.direction = { forward: false, backward: false, left: false, right: false }

        // Saut & gravité
        this.velocityY = 0
        this.gravity = -20
        this.jumpPower = 8
        this.jumpPowerPerc = 1
        this.isGrounded = true

        // Vie
        this.maxHealth = 100
        this.health = this.maxHealth

        // Projectiles
        this.projectiles = []
        this.projectilesPerShot = 1
        this.projectileSpeed = 20
        this.projectileDamage = 25
        this.projectileDamagePerc = 1
        this.fireRate = 0.5
        this.fireRatePerc = 1
        this.timeSinceLastShot = 0

        this.freezeChance = 0;

        this.deathExplosionChance = 0
        this.explosionSizePerc = 1


        // EXP / Level
        this.level = 1;
        this.exp = 0;
        this.expToNextLevel = 50   // exp nécessaire pour passer au niveau suivant


        this.createMesh()
        this.initControls()
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
        this.level++;
        this.exp -= this.expToNextLevel;
        this.expToNextLevel = Math.floor(this.expToNextLevel * 1.05); // croissance exp

        // Prendre 3 upgrades au hasard

        const choices = [...UPGRADES]
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(up => {
                const rarity = RARITIES[Math.floor(Math.random() * RARITIES.length)];
                return { ...up, rarity };
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

    initControls() {
        window.addEventListener("keydown", e => this.handleKey(e, true));
        window.addEventListener("keyup", e => this.handleKey(e, false));
    }

    handleKey(e, isDown) {
        switch (e.key.toLowerCase()) {
            case "z":
            case "w": this.direction.forward = isDown; break;
            case "s": this.direction.backward = isDown; break;
            case "q":
            case "a": this.direction.left = isDown; break;
            case "d": this.direction.right = isDown; break;
            case " ":
                if (isDown && this.isGrounded) {
                    this.velocityY = this.jumpPower * this.jumpPowerPerc;
                    this.isGrounded = false;
                }
                break;
            case "escape":
                if (isDown && !this.isLevelUp) {
                    this.isPaused = !this.isPaused
                    document.getElementById("pause-screen").style.display =
                        this.isPaused ? "flex" : "none";
                }
                break
        }
    }

    update(dt) {
        if (!dt) return;

        const move = this.speed * dt * this.speedPerc;

        // Déplacement horizontal
        if (this.direction.forward) this.mesh.position.z -= move;
        if (this.direction.backward) this.mesh.position.z += move;
        if (this.direction.left) this.mesh.position.x -= move;
        if (this.direction.right) this.mesh.position.x += move;

        // Gravité & saut
        this.velocityY += this.gravity * dt;
        this.mesh.position.y += this.velocityY * dt;

        if (this.mesh.position.y <= 0.5) {
            this.mesh.position.y = 0.5;
            this.velocityY = 0;
            this.isGrounded = true;
        }

        // Tir automatique
        this.timeSinceLastShot += dt;
        if (this.timeSinceLastShot >= this.fireRate / this.fireRatePerc) {
            this.shootAtClosestEnemy();
            this.timeSinceLastShot = 0;
        }

        // Déplacer les projectiles
        this.updateProjectiles(dt);

        // Mettre à jour la barre de vie
        this.updateHealthBar();
        if (this.health <= 0) {
            this.health = 0;
            this.updateHealthBar();
            this.die();
        }

    }

    shootAtClosestEnemy() {
        if (!this.enemyManager || this.enemyManager.enemies.length === 0) return;

        // Trouver l'ennemi le plus proche
        let closest = null;
        let minDist = Infinity;
        this.enemyManager.enemies.forEach(enemy => {
            const dist = this.mesh.position.distanceTo(enemy.mesh.position);
            if (dist < minDist) {
                minDist = dist;
                closest = enemy;
            }
        });

        if (!closest) return;

        for (let i = 0; i < this.projectilesPerShot; i++) {
            const geometry = new THREE.SphereGeometry(0.2, 8, 8);
            const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
            const projectile = new THREE.Mesh(geometry, material);

            projectile.position.copy(this.mesh.position);

            // Légère variation d'angle pour les projectiles multiples
            const spreadAngle = (i - (this.projectilesPerShot - 1) / 2) * 0.1; // ±0.1 rad
            const direction = new THREE.Vector3().subVectors(closest.mesh.position, this.mesh.position).normalize();
            direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), spreadAngle);

            projectile.userData.direction = direction;

            this.scene.add(projectile);
            this.projectiles.push(projectile);
        }
    }

    updateProjectiles(dt) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            // Déplacer le projectile
            p.position.add(p.userData.direction.clone().multiplyScalar(this.projectileSpeed * dt));

            // Vérifier collision avec les ennemis
            for (let j = this.enemyManager.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemyManager.enemies[j];
                if (p.position.distanceTo(enemy.mesh.position) < 0.7) { // 0.7 = seuil de collision
                    // Infliger dégâts
                    enemy.health -= ( this.projectileDamage * this.projectileDamagePerc ) / this.projectilesPerShot ;

                    // Supprimer le projectile
                    this.scene.remove(p);
                    this.projectiles.splice(i, 1);

                    // Si l'ennemi meurt
                    if (enemy.health <= 0) {
                        this.scene.remove(enemy.mesh);
                        this.enemyManager.enemies.splice(j, 1);
                        this.enemyManager.kills += 1;             // incrémenter le compteur
                        this.gainExp(10)

                        if (Math.random() * 100 < this.deathExplosionChance) {
                            this.createExplosion(enemy.mesh.position);
                        }

                    }else{
                        if (Math.random() < this.freezeChance / 100) {
                            enemy.freeze(3); // gel pour 3 secondes
                        }
                    }
                    break; // sortir de la boucle ennemis
                }
            }

            // Supprimer si trop loin
            if (p.position.length() > 200) {
                this.scene.remove(p);
                this.projectiles.splice(i, 1);
            }
        }
    }

    createExplosion(position) {
        const geometry = new THREE.SphereGeometry(this.explosionSizePerc, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xff5500 });
        const explosion = new THREE.Mesh(geometry, material);
        explosion.position.copy(position);
        this.scene.add(explosion);

        // dégâts aux ennemis proches
        for (let i = this.enemyManager.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemyManager.enemies[i];
            if (enemy.mesh.position.distanceTo(position) < 3 * this.explosionSizePerc) {
                enemy.health -= 20;
                if (enemy.health <= 0) {
                    this.scene.remove(enemy.mesh);
                    this.enemyManager.enemies.splice(i, 1);
                    this.enemyManager.kills += 1;
                    this.gainExp(10);

                }
            }
        }


        // disparition rapide
        setTimeout(() => this.scene.remove(explosion), 300);
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
        const screen = document.getElementById("death-screen")
        const killsLabel = document.getElementById("death-kills")
        const timeLabel = document.getElementById("death-time")

        // Affiche les infos
        killsLabel.textContent = `Enemies killed: ${this.ui.killsData.kills}`
        timeLabel.textContent = `Survived: ${this.ui.timerData.time}`

        screen.style.display = "flex";

        // Freeze le joueur
        this.speed = 0
        this.fireRate = 99999
    }

}
