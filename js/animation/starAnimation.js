import {Animation} from "./animation.js";
import {BackgroundSetup} from "../object/backgroundSetup.js";

export class StarAnimation extends Animation {
    constructor() {
        super();
        this.stars = null;
    }

    animate(objectSetup) {
        if (!(objectSetup instanceof BackgroundSetup)) {
            throw new TypeError("Expected scene to be an instance of BackgroundSetup");
        }
        this.stars = objectSetup.background;

        // Move each star towards the camera and reset if too close
        const positions = this.stars.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 2] += 2; // Move stars along the z-axis towards the camera

            if (positions[i + 2] > 1) {
                positions[i] = THREE.MathUtils.randFloatSpread(2000);
                positions[i + 1] = THREE.MathUtils.randFloatSpread(2000);
                positions[i + 2] = THREE.MathUtils.randFloat(-2000, -500);
            }
        }

        this.stars.geometry.attributes.position.needsUpdate = true;
    }
}
