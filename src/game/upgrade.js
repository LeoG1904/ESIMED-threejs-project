export const RARITIES = [
    { name: "Commun",      color: "#b0b0b0", multiplier: 0.5, weight: 60 },
    { name: "Rare",        color: "#4fa3ff", multiplier: 1,   weight: 25 },
    { name: "Épique",      color: "#c14fff", multiplier: 1.5, weight: 12 },
    { name: "Légendaire",  color: "#ffb300", multiplier: 2,   weight: 3 }
];
export function getRandomRarity() {
    const totalWeight = RARITIES.reduce((sum, r) => sum + r.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const rarity of RARITIES) {
        if (roll < rarity.weight) return rarity;
        roll -= rarity.weight;
    }

    return RARITIES[0]; // fallback
}
export const UPGRADES = [
    {
        name: "Damage",
        base: 0.2,
        apply: (player, mult) => player.projectileDamagePerc += 0.2 * mult
    },
    {
        name: "Jump Power",
        base: 0.2,
        apply: (player, mult) => player.jumpPowerPerc += 0.2 * mult
    },
    {
        name: "Fire Rate",
        base: 0.25,
        apply: (player, mult) => player.fireRatePerc += 0.25 * mult
    },
    {
        name: "Max Health",
        base: 20,
        apply: (player, mult) => {
            const bonus = 20 * mult;
            player.maxHealth += bonus;
            player.health += bonus;
            player.updateHealthBar();
        }
    },
    {
        name: "Auto Health",
        base: 0.25,
        apply: (player, mult) => player.autoHealth += 0.1 * mult
    },
    {
        name: "Move Speed",
        base: 0.15,
        apply: (player, mult) => player.speedPerc += 0.15 * mult
    },
    {
        name: "Freeze Chance",
        base: 5,
        apply: (player, mult) => player.freezeChance += 5 * mult
    },
    {
        name: "Multi-shot",
        base: 1,
        apply: (player, mult) => player.projectilesPerShot += Math.round(1 * mult)
    },
    {
        name: "Explosion Chance",
        base: 10,
        apply: (player, mult) => player.deathExplosionChance += 10 * mult
    },
    {
        name: "Explosion Size",
        base: 0.1,
        apply: (player, mult) => player.explosionSizePerc += 0.1 * mult
    }
];
