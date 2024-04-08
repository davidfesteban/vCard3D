export class Animation {
    constructor() {
        if (this.constructor === Animation) {
            throw new Error("Base is an abstract class and cannot be instantiated directly.");
        }

        if (this.animate === Animation.prototype.animate) {
            throw new Error("You must override animate in " + this.constructor.name);
        }
    }

    animate(object3D) {
        throw new Error("Method 'animate' must be implemented.");
    }
}