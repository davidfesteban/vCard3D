export class ObjectSetup {
    constructor() {
        if (this.constructor === ObjectSetup) {
            throw new Error("Base is an abstract class and cannot be instantiated directly.");
        }
    }
}