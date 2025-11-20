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
            btn.textContent = up.name;
            btn.style.padding = "15px";
            btn.style.fontSize = "18px";

            btn.onclick = () => {
                popup.style.display = "none";
                onSelect(up);
            };

            container.appendChild(btn);
        });

        popup.style.display = "flex";
    }

    addPlayerStats(player) {
        this.playerStats = {
            maxHealth: player.maxHealth,
            projectileDamagePerc: player.projectileDamagePerc,
            speedPerc: player.speedPerc,
            fireRatePerc: player.fireRatePerc
        };

        this.playerFolder = this.GUI.addFolder("Player Stats");

        this.playerFolder.add(this.playerStats, "maxHealth")
            .name("Max Health")
            .listen();

        this.playerFolder.add(this.playerStats, "projectileDamagePerc")
            .name("Damage x")
            .listen();

        this.playerFolder.add(this.playerStats, "speedPerc")
            .name("Move Speed")
            .listen();

        this.playerFolder.add(this.playerStats, "fireRatePerc")
            .name("Fire Rate")
            .listen();

        this.playerFolder.open();
    }
    updatePlayerStats(player) {
        this.playerStats.maxHealth = player.maxHealth;
        this.playerStats.projectileDamagePerc = Number(player.projectileDamagePerc.toFixed(2));
        this.playerStats.speedPerc = Number(player.speedPerc.toFixed(2));
        this.playerStats.fireRatePerc = Number(player.fireRatePerc.toFixed(3));
    }


}