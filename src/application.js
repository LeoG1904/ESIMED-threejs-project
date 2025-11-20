import * as THREE from 'three/webgpu'
import {Scene} from "./class/scene.js";
import {Camera} from "./class/camera.js";
import {Ui} from "./class/ui.js";
import {Player} from "./class/player.js";
import {Enemy} from "./class/enemy.js";
import {EnemyManager} from "./class/enemyManager.js";

export class Application {
    
    constructor() {
        this.renderer = new THREE.WebGPURenderer({antialias: true})
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.shadowMap.enabled = true
        document.body.appendChild(this.renderer.domElement)

        this.clock = new THREE.Clock(); // <-- pour le delta
        this.startTime = Date.now(); // au début de la partie


        this.initParams()

        this.UI = new Ui()
        this.UI.addSessionTimer()
        this.UI.addEnemy()

        this.scene = new Scene()
        // this.scene.addCube()
        // this.scene.loadScene('/scenes/scene_1.json')
        this.scene.addAmbiantLight()
        this.scene.addDirectionalLight()
        this.scene.addGround(this.groundParams.texture,this.groundParams.repeats)
        this.scene.addSkybox(this.skyParams.file)


        this.enemyManager = new EnemyManager(this.scene.scene, null); // temporairement null pour player
        this.player = new Player(this.scene.scene, this.enemyManager,this.UI);
        this.enemyManager.player = this.player;


        this.UI.addLevel(this.player)
        this.UI.addPlayerStats(this.player)

        this.camera = new Camera()
        this.camera.setOrbitControls(this.renderer.domElement)

        this.renderer.setAnimationLoop(this.render.bind(this))
    }

    render() {

        this.UI.updateKills(this.enemyManager.kills)
        this.UI.updateAliveEnemies(this.enemyManager.enemies.length)
        this.UI.updateLevel(this.player)
        this.UI.updatePlayerStats(this.player)

        const now = Date.now();
        const elapsed = (now - this.startTime) / 1000; // en secondes
        const minutes = Math.floor(elapsed / 60);
        const seconds = Math.floor(elapsed % 60);

        this.UI.timerData.time = `${minutes}:${seconds.toString().padStart(2, '0')}`;


        const dt = this.clock.getDelta() // <-- calcul du delta
        this.player.update(dt)
        this.player.updateHealthBar();  // mettre à jour la barre de vie

        this.enemyManager.update(dt);

        // Exemple simple : faire suivre la caméra derrière le joueur
        this.camera.camera.position.lerp(
            new THREE.Vector3(
                this.player.mesh.position.x,
                this.player.mesh.position.y + 10,
                this.player.mesh.position.z + 15
            ),
            0.1
        )
        this.camera.camera.lookAt(this.player.mesh.position)


        this.renderer.render(this.scene.scene, this.camera.camera)
    }

    initParams(){
        this.groundTextures = [
            'aerial_grass_rock',
            'brown_mud_leaves_01',
            'forest_floor',
            'forrest_ground_01',
            'gravelly_sand'
        ]

        this.groundParams = {
            texture: this.groundTextures[0],
            repeats: 1000
        }

        this.skyboxFiles = [
            'DaySkyHDRI019A_2K-TONEMAPPED',
            'DaySkyHDRI050A_2K-TONEMAPPED',
            'NightSkyHDRI009_2K-TONEMAPPED'
        ]

        this.skyParams = {
            file: this.skyboxFiles[0]
        }

        this.sunParams = {
            intensity: 2.0,
            x: 3,
            z: 0,
            color: "#ffffff"
        };

        // Créer les paramètres globaux à exporter
        this.exportParams = {
            ground: {
                texture: this.groundParams.texture,
                repeats: this.groundParams.repeats
            },
            skybox: {
                file: this.skyParams.file
            }
        };

    }

    onClick(event) {
        // Normaliser la position de la souris (-1 à 1)
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        // Mettre à jour le raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera.camera);

        // Récupérer tous les objets de la scène
        const intersects = this.raycaster.intersectObjects(this.scene.scene.children, true);

        if (intersects.length > 0) {
            // Chercher le premier mesh "sélectable"
            const hit = intersects.find(i => i.object.userData.isSelectable);

            if (hit) {
                const mesh = hit.object;

                // Restaurer l'ancien matériau si nécessaire
                if (this.selectedMesh && this.selectedMeshMaterial) {
                    this.selectedMesh.material = this.selectedMeshMaterial;
                }

                // Sauvegarder le mesh et son matériau original
                this.selectedObject = mesh.userData.object;
                this.selectedMesh = mesh;
                this.selectedMeshMaterial = mesh.material;

                // Changer le matériau du mesh sélectionné (exemple : jaune)
                mesh.material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
                this.ui.updateSelection(this.selectedObject);
            }else {
                // Si rien n'est sélectionné
                if (this.selectedMesh && this.selectedMeshMaterial) {
                    this.selectedMesh.material = this.selectedMeshMaterial;
                }
                this.selectedObject = null;
                this.selectedMesh = null;
                this.selectedMeshMaterial = null;

                this.ui.updateSelection(null);
            }
        }
    }
}
