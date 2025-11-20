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
        this.enemyFolder = this.GUI.addFolder("Kills");
        this.killsField = this.enemyFolder.add(this.killsData, "kills").name("Enemies Killed").listen();
        this.aliveField = this.enemyFolder.add(this.aliveData, "alive").name("Enemies Alive").listen();
        this.enemyFolder.open();
    }
    updateKills(count) {
        this.killsData.kills = count;
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

}