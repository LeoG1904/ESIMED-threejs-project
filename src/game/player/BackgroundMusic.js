export class BackgroundMusic {
    constructor() {
        this.music = new Audio("sounds/music.mp3");
        this.state = false

        this.music.loop = true;
        this.music.volume = 0.35;    // volume par défaut
        this.music.preload = "auto";

        this.isEnabled = false;      // Pour éviter les blocages navigateur

        // Le navigateur bloque l'autoplay → on attend un clic du joueur
        window.addEventListener("click", () => this.enableMusic(), { once: true });
    }

    enableMusic() {
        if (this.isEnabled) return;
        this.isEnabled = true;

        this.music.currentTime = 0;
        this.music.play().catch(() => {
            console.warn("Impossible de lancer la musique (autoplay bloqué).");
        });
    }

    play() {
        if (!this.isEnabled) return;
        this.music.play();
        this.state = true
    }

    pause() {
        this.music.pause();
        this.state = false
    }

    setVolume(value) {
        this.music.volume = value;
    }
}
