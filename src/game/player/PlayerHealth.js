export class PlayerHealth {
    constructor(player) {
        this.player = player;
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.autoHealth = 0;
    }

    gain(amount) {
        this.health = Math.min(this.health + amount, this.maxHealth);
    }

    takeDamage(amount) {
        this.player.sounds.playHit()
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.player.die();
        }
    }

    update(dt) {
        this.gain(this.autoHealth * dt);
    }

    updateUI() {
        const bar = document.getElementById("health-bar");
        if (!bar) return;
        const percent = (this.health / this.maxHealth) * 100;
        bar.style.width = percent + "%";
        bar.style.backgroundColor = percent > 50 ? "#0f0" : percent > 20 ? "#ff0" : "#f00";
    }
}
