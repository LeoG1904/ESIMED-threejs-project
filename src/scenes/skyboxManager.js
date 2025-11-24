import * as THREE from "three/webgpu";
import { textureloader } from "../tools.js";

export class SkyboxManager {
    constructor(scene) {
        this.scene = scene;
    }

    setSkybox(name) {
        const path = `/skybox/${name}.jpg`;

        textureloader.load(
            path,
            (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                this.scene.background = texture;
            },
            undefined,
            (err) => console.error("Skybox error:", err)
        );
    }
}
