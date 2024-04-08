import {Animation} from "../animation/animation.js";
import {ObjectSetup} from "./objectSetup.js";
import {SceneSetup} from "../sceneSetup.js";

export class CardSetup extends ObjectSetup {

    constructor(renderer) {
        super();
        if (!(renderer instanceof THREE.WebGLRenderer)) {
            throw new TypeError("Expected scene to be an instance of WebGLRenderer");
        }
        this.renderer = renderer;
        this.frontTexture = new THREE.TextureLoader().load('../../asset/card/front.png');
        this.backTexture = new THREE.TextureLoader().load('../../asset/card/back.png');
        this.cardWidth = 2.625;
        this.cardHeight = 1.5;
        this.cardThickness = 0.05;
        this.card = null;
        this.animation = null;
        this.scene = null;
        this.camera = null;
        this.#init();
    }

    #init() {
        this.frontTexture.anisotropy = this.renderer.getMaxAnisotropy();
        this.backTexture.anisotropy = this.renderer.getMaxAnisotropy();
        this.frontTexture.minFilter = THREE.LinearFilter;
        this.backTexture.minFilter = THREE.LinearFilter;

        // Using BoxGeometry to create a geometry with some thickness
        const geometry = new THREE.BoxGeometry(this.cardWidth, this.cardHeight, this.cardThickness);

        // Since BoxGeometry creates a 3D box, we'll adjust the material application
        const materials = [
            new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}), // side material (optional, can be set to the color of the edge or any preference)
            new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}), // top and bottom material
            new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}), // left and right material
            new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
            new THREE.MeshPhongMaterial({map: this.frontTexture}), // front side
            new THREE.MeshPhongMaterial({map: this.backTexture}),
        ];

        this.card = new THREE.Mesh(geometry, materials);
        this.card.position.set(0, 0, 0);
        this.card.rotation.set(-0.2, -0.2, 0.01);
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