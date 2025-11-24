    export class PlayerSound {
        constructor() {
            // Son quand le joueur se fait frapper
            this.hitSound = new Audio('sounds/hit.mp3   ');
            this.hitSound.volume = 0.5;

            // Son quand le joueur tire
            this.shootSound = new Audio('sounds/shoot.mp3');
            this.shootSound.volume = 0.3;

            // Son quand le joueur monte de niveau
            this.levelUpSound = new Audio('sounds/levelup.mp3');
            this.levelUpSound.volume = 0.5;

            // Son quand le joueur meurt
            this.deathSound = new Audio('sounds/death.mp3');
            this.deathSound.volume = 0.5;

            // Son quand le joueur saute
            this.jumpSound = new Audio('sounds/jump.mp3');
            this.jumpSound.volume = 0.4;

            // Son quand un ennemi est gelé
            this.freezeSound = new Audio('sounds/freeze.mp3');
            this.freezeSound.volume = 0.5;

            // Son d'explosion
            this.explosionSound = new Audio('sounds/explosion.mp3');
            this.explosionSound.volume = 0.6;
        }

        playHit() {
            this._play(this.hitSound);
        }

        playShoot() {
            this._play(this.shootSound);
        }

        playLevelUp() {
            this._play(this.levelUpSound);
        }

        playDeath() {
            this._play(this.deathSound);
        }

        playJump() {
            this._play(this.jumpSound);
        }

        playFreeze() {
            this._play(this.freezeSound);
        }

        playExplosion() {
            this._play(this.explosionSound);
        }

        // Petite fonction pour éviter de répéter le code
        _play(sound) {
            if (!sound) return;
            sound.currentTime = 0;
            sound.play();
        }
    }
