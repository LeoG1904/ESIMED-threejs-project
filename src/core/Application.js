import * as THREE from "three/webgpu";
import { GameScene } from "../scenes/gameScene/GameScene.js";
import { Camera } from "./Camera.js";
import { Ui } from "./Ui.js";
import { Player } from "../game/player/Player.js";
import { EnemyManager } from "../game/enemy/EnemyManager.js";

// DOM
const deathScreen = document.getElementById("death-screen");
const homePage = document.getElementById("homepage");

export class Application {
    constructor() {

        // ------------------------------
        // Renderer
        // ------------------------------
        this.renderer = new THREE.WebGPURenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        document.querySelectorAll(".menu-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                homePage.style.display = "block";
                location.reload();
            });
        });

        // ------------------------------
        // Time
        // ------------------------------
        this.clock = new THREE.Clock();
        this.startTime = Date.now();

        // ------------------------------
        // Params loading (ground/skybox)
        // ------------------------------
        this.initParams();

        // ------------------------------
        // Interface
        // ------------------------------
        this.UI = new Ui();
        this.UI.addSessionTimer();
        this.UI.addEnemy();

        // ------------------------------
        // Scene (auto-build via params)
        // ------------------------------
        this.scene = new GameScene(this.exportParams);

        // ------------------------------
        // Game Logic
        // ------------------------------
        this.enemyManager = new EnemyManager(this.scene.scene, null);
        this.player = new Player(this.scene.scene, this.enemyManager, this.UI);

        this.player.isDead = false;
        this.enemyManager.player = this.player;

        this.UI.addLevel(this.player);
        this.UI.addPlayerStats(this.player);

        // ------------------------------
        // Camera
        // ------------------------------
        this.camera = new Camera();
        this.player.addCamera(this.camera.camera)

        // ------------------------------
        // Render loop
        // ------------------------------
        this.renderer.setAnimationLoop(this.render.bind(this));
    }

    // ============================================================
    // RENDER LOOP
    // ============================================================
    render() {

        const dt = this.clock.getDelta();
        if (this.player.isPaused) return;


        // ------------------------------
        // UI updates
        // ------------------------------
        this.UI.updateKills(this.enemyManager.kills);
        this.UI.updateAliveEnemies(this.enemyManager.enemies.length);
        this.UI.updateLevel(this.player);
        this.UI.updatePlayerStats(this.player);
        this.UI.updateEnemySpeed(this.enemyManager.enemySpeedMultiplier.toFixed(2));

        // Session Timer
        if (deathScreen.style.display !== "flex") {
            const elapsed = (Date.now() - this.startTime) / 1000;
            const minutes = Math.floor(elapsed / 60);
            const seconds = Math.floor(elapsed % 60);
            this.UI.timerData.time = `${minutes}:${seconds.toString().padStart(2, "0")}`;
        }

        // ------------------------------
        // Game updates
        // ------------------------------
        this.player.update(dt);
        this.player.healthManager.updateUI();
        this.enemyManager.update(dt);

        // ------------------------------
        // Camera follow
        // ------------------------------
        const targetPos = new THREE.Vector3(
            this.player.mesh.position.x,
            this.player.mesh.position.y + 10,
            this.player.mesh.position.z + 15
        );

        this.camera.camera.position.lerp(targetPos, 0.1);
        this.camera.camera.lookAt(this.player.mesh.position);

        // ------------------------------
        // Render scene
        // ------------------------------
        this.renderer.render(this.scene.scene, this.camera.camera);
    }

    // ============================================================
    // PARAMS (ground / skybox / sun)
    // ============================================================
    initParams() {

        this.groundTextures = [
            "aerial_grass_rock",
            "brown_mud_leaves_01",
            "forest_floor",
            "forrest_ground_01",
            "gravelly_sand"
        ];

        this.skyboxFiles = [
            "DaySkyHDRI019A_2K-TONEMAPPED",
            "DaySkyHDRI050A_2K-TONEMAPPED",
            "NightSkyHDRI009_2K-TONEMAPPED"
        ];

        // Defaults
        this.exportParams = {
            ground: {
                texture: this.groundTextures[3],
                repeats: 1000
            },
            skybox: {
                file: this.skyboxFiles[2]
            },
            // prêt à ajouter sun ici
        };
    }
}
