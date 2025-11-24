import * as THREE from "three/webgpu";

export class LightManager {
    constructor(scene) {
        this.scene = scene;
        this.sun = null;
        this.addAmbient();
        this.addSun();
    }

    addAmbient() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambient);
    }

    addSun() {
        this.sun = new THREE.DirectionalLight(0xffffff, 2.0);
        this.sun.position.set(20, 100, 0);
        this.sun.castShadow = true;

        this.sun.shadow.mapSize.set(2048, 2048);

        this.sun.shadow.camera.left = -100;
        this.sun.shadow.camera.right = 100;
        this.sun.shadow.camera.top = 100;
        this.sun.shadow.camera.bottom = -100;
        this.sun.shadow.camera.far = 300;

        this.scene.add(this.sun);
    }

    update(params) {
        if (!this.sun) return;

        if (params.intensity) this.sun.intensity = params.intensity;
        if (params.x) this.sun.position.x = params.x;
        if (params.z) this.sun.position.z = params.z;
        if (params.color) this.sun.color.set(params.color);
    }
}
