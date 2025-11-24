import GUI from "lil-gui";

export class Ui{
    constructor() {
        this.GUI = new GUI();
    }
    addSessionTimer() {
        this.timerData = { time: "0:00" }; // format mm:ss
        this.timerFolder = this.GUI.addFolder("Session Timer");
        this.timerField = this.timerFolder.add(this.timerData, "time").name("Time").listen();
        this.timerFolder.open();
    }
    addEnemy() {
        this.killsData = { kills: 0 }; // compteur initial
        this.aliveData = { alive: 0 }; // nombre d'ennemis vivants
        this.speedData = { speed: 0 }; // nombre d'ennemis vivants
        this.enemyFolder = this.GUI.addFolder("Enemy");
        this.killsField = this.enemyFolder.add(this.killsData, "kills").name("Enemies Killed").listen();
        this.aliveField = this.enemyFolder.add(this.aliveData, "alive").name("Enemies Alive").listen();
        this.speedBoostField = this.enemyFolder.add(this.speedData, "speed").name("Enemies speed").listen();

        this.enemyFolder.open();
    }
    updateKills(count) {
        this.killsData.kills = count;
    }

    updateEnemySpeed(count) {
        this.speedData.speed = count;
    }
    updateAliveEnemies(count) {
        this.aliveData.alive = count;
    }

    addLevel(player) {
        this.levelData = { level: player.level }; // initialisé avec le niveau du joueur
        this.levelFolder = this.GUI.addFolder("Player Level");
        this.levelField = this.levelFolder.add(this.levelData, "level").name("Level").listen();
        this.levelFolder.open();
    }

    updateLevel(player) {
        this.levelData.level = player.level;
    }

    showUpgradesPopup(upgrades, onSelect) {
        const popup = document.getElementById("upgrade-popup");
        const container = document.getElementById("upgrade-buttons");

        container.innerHTML = "";

        upgrades.forEach(up => {
            const btn = document.createElement("button");

            // Style visuel
            btn.style.padding = "15px";
            btn.style.fontSize = "18px";
            btn.style.margin = "10px";
            btn.style.border = `3px solid ${up.rarity.color}`;
            btn.style.color = up.rarity.color;
            btn.style.background = "#222";
            btn.style.cursor = "pointer";
            btn.style.borderRadius = "10px";

            // Texte : nom + rareté + bonus réel calculé
            const value = (up.base * up.rarity.multiplier).toFixed(2);

            btn.innerHTML = `
            <strong style="color:${up.rarity.color}">
                ${up.rarity.name} • ${up.name}
            </strong><br>
            <span style="font-size:14px; color:#ddd">
                Bonus : +${value}
            </span>
        `;

            btn.onclick = () => {
                popup.style.display = "none";
                onSelect(up);  // le onSelect doit déjà appeler apply(player, mult)
            };

            container.appendChild(btn);
        });

        popup.style.display = "flex";
    }

    addPlayerStats(player) {
        this.playerStats = {
            // Movement
            speedPerc: player.movement.speedPerc,
            jumpPowerPerc: player.movement.jumpPowerPerc,

            // Combat (hors maxHealth / autoHealth)
            projectileDamagePerc: player.combat.projectileDamagePerc,
            fireRatePerc: player.combat.fireRatePerc,
            freezeChance: player.combat.freezeChance,
            deathExplosionChance: player.combat.deathExplosionChance,
            explosionSizePerc: player.combat.explosionSizePerc,

            // Life
            maxHealth: player.maxHealth,
            autoHealth: player.autoHealth
        };

        this.playerFolder = this.GUI.addFolder("Player Stats");

        // --- Movement Stats ---
        this.playerFolder.add(this.playerStats, "speedPerc").name("Move Speed").listen();
        this.playerFolder.add(this.playerStats, "jumpPowerPerc").name("Jump Power").listen();

        // --- Life Stats ---
        this.playerFolder.add(this.playerStats, "maxHealth").name("Max Health").listen();
        this.playerFolder.add(this.playerStats, "autoHealth").name("Health per sec").listen();

        // --- Combat Stats ---
        this.playerFolder.add(this.playerStats, "projectileDamagePerc").name("Damage per bullet").listen();
        this.playerFolder.add(this.playerStats, "fireRatePerc").name("Fire Rate").listen();
        this.playerFolder.add(this.playerStats, "freezeChance").name("Freeze Chance").listen();
        this.playerFolder.add(this.playerStats, "deathExplosionChance").name("Explosion Chance").listen();
        this.playerFolder.add(this.playerStats, "explosionSizePerc").name("Explosion Size").listen();

        this.playerFolder.open();
    }

    updatePlayerStats(player) {
        // --- Movement Stats ---
        this.playerStats.speedPerc = Number(player.movement.speedPerc.toFixed(2));
        this.playerStats.jumpPowerPerc = Number(player.movement.jumpPowerPerc.toFixed(2));

        // --- Life Stats ---
        this.playerStats.maxHealth = player.maxHealth;
        this.playerStats.autoHealth = player.autoHealth;

        // --- Combat Stats ---
        this.playerStats.projectileDamagePerc = Number((player.combat.projectileDamagePerc / player.combat.projectilesPerShot).toFixed(2));
        this.playerStats.fireRatePerc = Number(player.combat.fireRatePerc.toFixed(3));
        this.playerStats.freezeChance = Number(player.combat.freezeChance.toFixed(2));
        this.playerStats.deathExplosionChance = Number(player.combat.deathExplosionChance.toFixed(2));
        this.playerStats.explosionSizePerc = Number(player.combat.explosionSizePerc.toFixed(2));
    }



}