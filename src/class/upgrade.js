export const UPGRADES = [
    {
        name: "Damage +20%",
        apply: (player) => player.projectileDamagePerc += 0.2
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
    } // +5% chance

];