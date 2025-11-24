import * as THREE from "three";

export class PlayerCombat {
    constructor(player) {
        this.player = player;

        // Projectiles
        this.projectiles = [];
        this.projectilesPerShot = 1;
        this.projectileSpeed = 20;
        this.projectileDamage = 25;
        this.projectileDamagePerc = 1;
        this.fireRate = 0.5;
        this.fireRatePerc = 1;
        this.timeSinceLastShot = 0;

        // Chances spéciales
        this.freezeChance = 0;
        this.deathExplosionChance = 0;
        this.explosionSizePerc = 1;
    }

    update(dt) {
        if (!dt) return;

        this.timeSinceLastShot += dt;
        if (this.timeSinceLastShot >= this.fireRate / this.fireRatePerc) {
            this.shootAtClosestEnemy();
            this.timeSinceLastShot = 0;
        }

        this.updateProjectiles(dt);
    }

    shootAtClosestEnemy() {
        const enemies = this.player.enemyManager?.enemies;
        if (!enemies || enemies.length === 0) return;

        let closest = null;
        let minDist = Infinity;

        enemies.forEach(enemy => {
            const dist = this.player.mesh.position.distanceTo(enemy.mesh.position);
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

            projectile.position.copy(this.player.mesh.position);

            const spreadAngle = (i - (this.projectilesPerShot - 1) / 2) * 0.1;
            const direction = new THREE.Vector3().subVectors(closest.mesh.position, this.player.mesh.position).normalize();
            direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), spreadAngle);

            projectile.userData.direction = direction;

            this.player.scene.add(projectile);
            this.projectiles.push(projectile);
        }
    }

    updateProjectiles(dt) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.position.add(p.userData.direction.clone().multiplyScalar(this.projectileSpeed * dt));

            const enemies = this.player.enemyManager?.enemies;
            if (!enemies) continue;

            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                if (p.position.distanceTo(enemy.mesh.position) < 0.7) {
                    enemy.health -= (this.projectileDamage * this.projectileDamagePerc) / this.projectilesPerShot;

                    this.player.scene.remove(p);
                    this.projectiles.splice(i, 1);

                    if (enemy.health <= 0) {
                        this.player.scene.remove(enemy.mesh);
                        enemies.splice(j, 1);
                        this.player.enemyManager.kills++;
                        this.player.gainExp(10);

                        if (Math.random() * 100 < this.deathExplosionChance) {
                            this.createExplosion(enemy.mesh.position);
                        }
                    } else if (Math.random() * 100 < this.freezeChance) {
                        enemy.freeze?.(3);
                    }
                    break;
                }
            }

            if (p.position.distanceTo(this.player.mesh.position) > 25) {
                this.player.scene.remove(p);
                this.projectiles.splice(i, 1);
            }
        }
    }

    createExplosion(position) {
        const geometry = new THREE.SphereGeometry(this.explosionSizePerc, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xff5500 });
        const explosion = new THREE.Mesh(geometry, material);
        explosion.position.copy(position);
        this.player.scene.add(explosion);

        const enemies = this.player.enemyManager?.enemies;
        if (enemies) {
            for (let i = enemies.length - 1; i >= 0; i--) {
                const enemy = enemies[i];
                if (enemy.mesh.position.distanceTo(position) < 3 * this.explosionSizePerc) {
                    enemy.health -= 20;
                    if (enemy.health <= 0) {
                        this.player.scene.remove(enemy.mesh);
                        enemies.splice(i, 1);
                        this.player.enemyManager.kills++;
                        this.player.gainExp(10);
                    }
                }
            }
        }

        setTimeout(() => this.player.scene.remove(explosion), 300);
    }
}
