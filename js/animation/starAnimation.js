import {Animation} from "./animation.js";
import {BackgroundSetup} from "../object/backgroundSetup.js";

export class StarAnimation extends Animation {
    constructor() {
        super();
        this.stars = null;
        this.stop = false;
        this.multiplier = 1.00;
    }

    animate(objectSetup) {
        if (!(objectSetup instanceof BackgroundSetup)) {
            throw new TypeError("Expected objectSetup to be an instance of BackgroundSetup");
        }
        this.stars = objectSetup.background;

        const positions = this.stars.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {

            positions[i + 2] += (4*this.multiplier);

            // Reset star position if too close and set opacity based on z-position
            if (positions[i + 2] > 1) {
                positions[i] = THREE.MathUtils.randFloatSpread(2000);
                positions[i + 1] = THREE.MathUtils.randFloatSpread(2000);
                positions[i + 2] = THREE.MathUtils.randFloat(-2000, -500);
            }
        }

        this.stars.geometry.attributes.position.needsUpdate = true;

        // Adjust overall material opacity based on the average z-position of all stars (simplified approach)
        //const averageZ = positions.reduce((acc, _, index) => index % 3 === 2 ? acc + positions[index] : acc, 0) / (positions.length / 3);
        //const normalizedZ = (averageZ - minOpacityZ) / (maxOpacityZ - minOpacityZ);


        if(!this.stop) {
            this.stars.material.opacity += 0.01
        } else {
            this.stars.material.opacity -= 0.01;
            this.multiplier -= 0.001;
        }

    }

    deanimate() {
        this.stop = true;
    }

}
