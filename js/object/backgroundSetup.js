import {Animation} from "../animation/animation.js";
import {ObjectSetup} from "./objectSetup.js";
import {SceneSetup} from "../sceneSetup.js";

export class BackgroundSetup extends ObjectSetup {

    constructor(renderer) {
        super();
        if (!(renderer instanceof THREE.WebGLRenderer)) {
            throw new TypeError("Expected scene to be an instance of WebGLRenderer");
        }
        this.renderer = renderer;
        this.texture = new THREE.TextureLoader().load( '../../asset/star.png' );
        this.animation = null;
        this.scene = null;
        this.camera = null;
        this.background = null;
        this.#init();
    }

    #init() {
        this.texture.anisotropy = this.renderer.getMaxAnisotropy();
        this.texture.minFilter = THREE.LinearFilter;

        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1.5,
            map: this.texture,
            transparent: true,
            opacity: 0
        });

        // Create an array to hold positions of each star
        const starsVertices = [];
        for (let i = 0; i < 10000; i++) {
            const x = THREE.MathUtils.randFloatSpread(2000); // random value between -2000 and 2000
            const y = THREE.MathUtils.randFloatSpread(2000);
            const z = THREE.MathUtils.randFloat(-2000, -500); // start far away and move towards the camera
            starsVertices.push(x, y, z);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));

        this.background = new THREE.Points(starGeometry, starMaterial);
    }

}