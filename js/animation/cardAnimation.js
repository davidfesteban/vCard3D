import {Animation} from "./animation.js";
import {CardSetup} from "../object/cardSetup.js";

export class CardAnimation extends Animation {
    constructor() {
        super();
        this.isDragging = false;
        this.previousMouseX = 0;
        this.previousMouseY = 0;
        this.rotationSpeedX = 0;
        this.rotationSpeedY = 0;
        this.card = null;
        this.stop = false;
        this.multiplier = 1.00;
    }

    startDrag = (e) => {
        this.isDragging = true;
        this.previousMouseX = e.clientX;
        this.previousMouseY = e.clientY;
    }

    drag = (e) => {
        if (!this.isDragging) return;

        const deltaX = e.clientX - this.previousMouseX;
        const deltaY = e.clientY - this.previousMouseY;

        this.rotationSpeedY = deltaX * 0.005;
        this.rotationSpeedX = deltaY * 0.005;

        this.card.rotation.y += this.rotationSpeedY;
        this.card.rotation.x += this.rotationSpeedX;

        this.previousMouseX = e.clientX;
        this.previousMouseY = e.clientY;
    }

    endDrag = () => {
        this.isDragging = false;
    }

    animate(objectSetup) {
        if (!(objectSetup instanceof CardSetup)) {
            throw new TypeError("Expected scene to be an instance of CardSetup");
        }
        this.card = objectSetup.card;

        if(this.stop) {
            let targetRotation = Math.PI / 2;
            let rotationStep = 0.02; // The amount you adjust the rotation per frame

            // Normalize current rotation to [0, 2*Math.PI]
            let currentRotationY = this.card.rotation.y % (2 * Math.PI);
            if (currentRotationY < 0) currentRotationY += 2 * Math.PI;

            // Calculate the shortest rotation direction
            let diff = targetRotation - currentRotationY;
            if (diff > Math.PI) diff -= 2 * Math.PI;
            else if (diff < -Math.PI) diff += 2 * Math.PI;

            // Apply rotation in the correct direction
            this.card.rotation.y += (diff > 0 ? rotationStep : -rotationStep);

            // Calculate steps needed to reach the target rotation assuming a fixed step
            const stepsToTarget = Math.abs(diff) / rotationStep;

            // Calculate opacity decrement so that opacity reaches 0 at the last step
            const opacityDecrement = this.card.material[0].opacity / stepsToTarget; // Assuming all materials have the same initial opacity

            // Decrease opacity
            this.card.material.forEach(material => {
                material.opacity = Math.max(0, material.opacity - opacityDecrement); // Ensure opacity doesn't go below 0
                if(material.opacity === 0) {
                    // If you need to perform some cleanup after opacity reaches 0, do it here
                    // Note: The 'delete' method might not be what you want unless you defined it for your specific use case
                }
            });

            // Check if rotation has reached or passed the target and correct it if necessary
            let newRotationY = this.card.rotation.y % (2 * Math.PI);
            if (newRotationY < 0) newRotationY += 2 * Math.PI;
            if ((diff > 0 && newRotationY >= targetRotation) || (diff < 0 && newRotationY <= targetRotation)) {
                this.card.rotation.y = targetRotation;
            }


        } else {
            if (!this.isDragging) {
                // Apply inertia
                this.card.rotation.x += this.rotationSpeedX;
                this.card.rotation.y += this.rotationSpeedY;

                // Gradually reduce rotation speed to simulate inertia
                this.rotationSpeedX *= 0.95;
                this.rotationSpeedY *= 0.95;

                // Return to default slow rotation once the inertia has almost stopped
                if (Math.abs(this.rotationSpeedX) < 0.001 && Math.abs(this.rotationSpeedY) < 0.001) {
                    this.card.rotation.y += 0.005; // Default slow rotation
                    this.rotationSpeedX = 0;
                    this.rotationSpeedY = 0;
                }
            }
        }
    }

    deanimate() {
        this.stop = true;
    }
}
