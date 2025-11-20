import * as THREE from "three";

export class Player {

    constructor(scene, enemyManager) {
        this.scene = scene;
        this.enemyManager = enemyManager;

        // Mouvement
        this.speed = 6;
        this.direction = { forward: false, backward: false, left: false, right: false };

        // Saut & gravité
        this.velocityY = 0;
        this.gravity = -20;
        this.jumpPower = 8;
        this.isGrounded = true;

        // Vie
        this.maxHealth = 100;
        this.health = this.maxHealth;

        // Projectiles
        this.projectiles = [];
        this.projectileSpeed = 20;
        this.projectileDamage = 25;
        this.fireRate = 0.5; // tirer toutes les 0.5s
        this.timeSinceLastShot = 0;

        this.createMesh();
        this.initControls();
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
                    this.velocityY = this.jumpPower;
                    this.isGrounded = false;
                }
                break;
        }
    }

    update(dt) {
        if (!dt) return;

        const move = this.speed * dt;

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
        if (this.timeSinceLastShot >= this.fireRate) {
            this.shootAtClosestEnemy();
            this.timeSinceLastShot = 0;
        }

        // Déplacer les projectiles
        this.updateProjectiles(dt);

        // Mettre à jour la barre de vie
        this.updateHealthBar();
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

        const geometry = new THREE.SphereGeometry(0.2, 8, 8);
        const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
        const projectile = new THREE.Mesh(geometry, material);
        projectile.position.copy(this.mesh.position);

        const direction = new THREE.Vector3().subVectors(closest.mesh.position, this.mesh.position).normalize();
        projectile.userData.direction = direction;

        this.scene.add(projectile);
        this.projectiles.push(projectile);
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
                    enemy.health -= this.projectileDamage;

                    // Supprimer le projectile
                    this.scene.remove(p);
                    this.projectiles.splice(i, 1);

                    // Si l'ennemi meurt
                    if (enemy.health <= 0) {
                        this.scene.remove(enemy.mesh);
                        this.enemyManager.enemies.splice(j, 1);
                        this.enemyManager.kills += 1;             // incrémenter le compteur

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


    updateHealthBar() {
        const bar = document.getElementById("health-bar");
        if (!bar) return;
        const percent = (this.health / this.maxHealth) * 100;
        bar.style.width = percent + "%";

        if (percent > 50) bar.style.backgroundColor = "#0f0";
        else if (percent > 20) bar.style.backgroundColor = "#ff0";
        else bar.style.backgroundColor = "#f00";
    }
}
