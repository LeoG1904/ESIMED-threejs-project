export const UPGRADES = [
    {
        name: "Damage +20%",
        apply: (player) => player.projectileDamagePerc += 0.2
    },
    {
        name: "Jump power +20%",
        apply: (player) => player.jumpPowerPerc += 0.2
    },
    {
        name: "Fire Rate +25%",
        apply: (player) => player.fireRatePerc += 0.25  // tirer plus vite
    },
    {
        name: "Max Health +20",
        apply: (player) => {
            player.maxHealth += 20;
            player.health += 20;
            player.updateHealthBar();
        }
    },
    {
        name: "Move Speed +15%",
        apply: (player) => player.speedPerc += 0.15
    },
    { name: "Freeze Chance +5%", apply: (player) => player.freezeChance += 5
    }, // +5% chance

    {name: "Multi-shot +1",
        description: "Tire plusieurs projectiles en même temps",
        apply: (player) => {
            player.projectilesPerShot += 1;
        }
    },
    {
        name: "Explosion Chance +10%",
        description: "Chance qu'un ennemi explose à sa mort",
        apply: (player) => {
            player.deathExplosionChance += 10; // augmente de 10% chaque fois
        }
    },
    {
        name: "Explosion Size +10%",
        description: "Taille de l'explosion",
        apply: (player) => {
            player.explosionSizePerc += 0.1;
        }
    }

];