import {getRandomRarity, UPGRADES} from "../Upgrade.js";

export class PlayerXP {
    constructor(player) {
        this.player = player;
        this.level = 1;
        this.exp = 0;
        this.expToNextLevel = 50;
    }

    gainExp(amount) {
        this.exp += amount;
        if (this.exp >= this.expToNextLevel) this.levelUp();
        this.updateUI();
    }

    levelUp() {
        this.player.isLevelUp = true;
        this.player.isPaused = true;
        this.level++;
        this.exp -= this.expToNextLevel;
        this.expToNextLevel = Math.floor(this.expToNextLevel * 1.05);

        this.player.ui.showUpgradesPopup(
            [...UPGRADES].sort(() => Math.random() - 0.5).slice(0, 3)
                .map(up => ({ ...up, rarity: getRandomRarity() })),
            (upgrade) => {
                upgrade.apply(this.player, upgrade.rarity.multiplier);
                this.player.isPaused = false;
                this.player.isLevelUp = false;
            }
        );
        this.player.sounds.playLevelUp()
    }

    updateUI() {
        const bar = document.getElementById("exp-bar");
        if (!bar) return;
        const percent = (this.exp / this.expToNextLevel) * 100;
        bar.style.width = percent + "%";
    }
}
