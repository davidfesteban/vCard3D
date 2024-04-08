import {SceneSetup} from './sceneSetup.js';
import {CardSetup} from "./object/cardSetup.js";
import {CardAnimation} from "./animation/cardAnimation.js";

document.addEventListener('DOMContentLoaded', () => {
    const sceneSetup = new SceneSetup('scene-container');
    const cardSetup = new CardSetup(sceneSetup.renderer);
    const cardAnimation = new CardAnimation();

    sceneSetup.scene.add(cardSetup.card);
    cardSetup.startAnimation(cardAnimation, sceneSetup)

    registerListeners(sceneSetup, cardAnimation);
});

function registerListeners(sceneSetup, cardAnimation) {
    if (!(sceneSetup instanceof SceneSetup)) {
        throw new TypeError("Expected scene to be an instance of SceneSetup");
    }
    if (!(cardAnimation instanceof CardAnimation)) {
        throw new TypeError("Expected scene to be an instance of CardAnimation");
    }

    window.addEventListener('resize', sceneSetup.onWindowResize, false);

    // Mouse event listeners
    sceneSetup.renderer.domElement.addEventListener('mousedown', (e) => cardAnimation.startDrag(e));
    window.addEventListener('mousemove', (e) => cardAnimation.drag(e));
    window.addEventListener('mouseup', () => cardAnimation.endDrag());


    // Touch event listeners for mobile
    sceneSetup.renderer.domElement.addEventListener('touchstart', (e) => cardAnimation.startDrag(e.touches[0]), {passive: false});
    window.addEventListener('touchmove', (e) => cardAnimation.drag(e.touches[0]), {passive: false});
    window.addEventListener('touchend', cardAnimation.endDrag, {passive: false});
}