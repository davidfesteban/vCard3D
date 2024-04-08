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

        if (!this.isDragging) {
            // Apply inertia
            this.card.rotation.x += this.rotationSpeedX;
            this.card.rotation.y += this.rotationSpeedY;

            // Gradually reduce rotation speed to simulate inertia
            this.rotationSpeedX *= 0.95;
            this.rotationSpeedY *= 0.95;

            // Return to default slow rotation once the inertia has almost stopped
            if (Math.abs(this.rotationSpeedX) < 0.001 && Math.abs(this.rotationSpeedY) < 0.001) {
                this.card.rotation.y += 0.002; // Default slow rotation
                this.rotationSpeedX = 0; // Stop further rotation adjustments
                this.rotationSpeedY = 0;
            }
        }
    }
}
