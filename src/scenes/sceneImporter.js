export class SceneImporter {
    constructor(gameScene) {
        this.gameScene = gameScene;
    }

    async import(event, params) {
        const file = event.target.files[0];
        if (!file) return;

        const text = await file.text();
        const data = JSON.parse(text);

        await this.gameScene.clearModels();
        await this.gameScene.loadNodes(data.nodes);

        if (data.params) this.applyParams(data.params, params);
    }

    applyParams(fromFile, params) {
        if (fromFile.skybox) {
            params.skybox.file = fromFile.skybox.file;
            this.gameScene.skybox.setSkybox(params.skybox.file);
        }

        if (fromFile.ground) {
            params.ground.texture = fromFile.ground.texture;
            params.ground.repeats = fromFile.ground.repeats;
            this.gameScene.ground.update(params.ground.texture, params.ground.repeats);
        }

        if (fromFile.sun) {
            Object.assign(params.sun, fromFile.sun);
            this.gameScene.lights.update(params.sun);
        }
    }
}
