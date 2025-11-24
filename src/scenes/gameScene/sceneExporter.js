import * as THREE from "three/webgpu";

export class SceneExporter {
    static export(scene, params = {}) {
        const exportData = {
            params,
            nodes: []
        };

        scene.traverse(obj => {
            if (obj.isMesh && obj.userData.isSelectable) {
                const pos = new THREE.Vector3();
                const quat = new THREE.Quaternion();
                const scale = new THREE.Vector3();

                obj.userData.object.matrixWorld.decompose(pos, quat, scale);

                exportData.nodes.push({
                    name: obj.userData.object.name,
                    position: `${pos.x},${pos.y},${pos.z}`,
                    rotation: `${quat.x},${quat.y},${quat.z},${quat.w}`,
                    scale: `${scale.x},${scale.y},${scale.z}`
                });
            }
        });

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "scene_export.json";
        a.click();
    }
}
