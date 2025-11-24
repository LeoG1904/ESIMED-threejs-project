import * as THREE from "three/webgpu";
import { loadGltf } from "../../tools.js";

import { LightManager } from "./LightManager.js";
import { SkyboxManager } from "./SkyboxManager.js";
import { GroundManager } from "./GroundManager.js";
import { SceneExporter } from "./SceneExporter.js";
import { SceneImporter } from "./SceneImporter.js";

export class GameScene {
    constructor(params) {
        this.scene = new THREE.Scene();
        this.params = params;

        this.loadedModels = {};

        this.lights = new LightManager(this.scene);
        this.skybox = new SkyboxManager(this.scene);
        this.ground = new GroundManager(this.scene, params.ground);
        this.importer = new SceneImporter(this);

        this.skybox.setSkybox(params.skybox.file);
    }

    async loadNodes(nodes) {
        if (!nodes) return;

        for (const obj of nodes) {
            const name = obj.name;

            if (!this.loadedModels[name]) {
                this.loadedModels[name] = await loadGltf(name);
            }

            const instance = this.loadedModels[name].clone(true);

            if (obj.position) instance.position.fromArray(obj.position.split(',').map(Number));
            if (obj.rotation) instance.quaternion.fromArray(obj.rotation.split(',').map(Number));
            if (obj.scale)    instance.scale.fromArray(obj.scale.split(',').map(Number));

            instance.traverse(o => {
                if (o.isMesh) {
                    o.userData = { isSelectable: true, object: instance };
                }
            });

            this.scene.add(instance);
        }
    }

    async clearModels() {
        const toRemove = new Set();
        this.scene.traverse(obj => {
            if (obj.isMesh && obj.userData.isSelectable) {
                toRemove.add(obj.userData.object);
            }
        });

        [...toRemove].forEach(obj => this.scene.remove(obj));
    }

    export(params) {
        SceneExporter.export(this.scene, params);
    }
}
