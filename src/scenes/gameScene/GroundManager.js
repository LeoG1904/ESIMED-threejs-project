import * as THREE from "three/webgpu";
import { createStandardMaterial } from "../../tools.js";

export class GroundManager {
    constructor(scene, params) {
        this.scene = scene;
        this.ground = null;
        this.addGround(params.texture, params.repeats);
    }

    addGround(texture, repeats) {
        const geometry = new THREE.PlaneGeometry(5000, 5000);
        const material = createStandardMaterial(texture, repeats);

        this.ground = new THREE.Mesh(geometry, material);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;

        this.scene.add(this.ground);
    }

    update(texture, repeats) {
        if (!this.ground) return;
        this.ground.material = createStandardMaterial(texture, repeats);
    }
}
