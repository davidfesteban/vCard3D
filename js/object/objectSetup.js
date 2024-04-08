import {Animation} from "../animation/animation.js";
import {SceneSetup} from "../sceneSetup.js";

export class ObjectSetup {
    constructor(renderer) {
        if (this.constructor === ObjectSetup) {
            throw new Error("Base is an abstract class and cannot be instantiated directly.");
        }
        this.renderer = renderer;
    }

    startAnimation(animation, sceneSetup, camera) {
        if (!(animation instanceof Animation)) {
            throw new TypeError("Expected scene to be an instance of Animation");
        }
        if (!(sceneSetup instanceof SceneSetup)) {
            throw new TypeError("Expected scene to be an instance of SceneSetup");
        }
        this.animation = animation;
        this.scene = sceneSetup.scene;
        this.camera = sceneSetup.camera;
        this.#animate();
    }

    #animate() {
        requestAnimationFrame(() => this.#animate());
        this.animation.animate(this);
        this.renderer.render(this.scene, this.camera);
    }
}