import {SceneSetup} from './sceneSetup.js';
import {CardSetup} from "./object/cardSetup.js";
import {CardAnimation} from "./animation/cardAnimation.js";
import {BackgroundSetup} from "./object/backgroundSetup.js";
import {StarAnimation} from "./animation/starAnimation.js";

document.addEventListener('DOMContentLoaded', () => {
    const sceneSetup = new SceneSetup('scene-container');
    const cardSetup = new CardSetup(sceneSetup.renderer);
    const cardAnimation = new CardAnimation();
    const backgroundSetup = new BackgroundSetup(sceneSetup.renderer);
    const starAnimation = new StarAnimation();

    sceneSetup.scene.add(cardSetup.card);
    cardSetup.startAnimation(cardAnimation, sceneSetup);

    sceneSetup.scene.add(backgroundSetup.background);
    backgroundSetup.startAnimation(starAnimation, sceneSetup);

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

//Special case for parallax background
document.addEventListener('mousemove', (e) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Calculate the mouse position as a percentage of the viewport size
    const mouseX = e.clientX / width * 100; // 100% is at the far right
    const mouseY = e.clientY / height * 100; // 100% is at the bottom

    // Optionally, adjust these values to change the "sensitivity" or effect intensity
    const bgPositionX = 50 + (mouseX - 50) * 0.01; // 0.2 is the sensitivity factor
    const bgPositionY = 50 + (mouseY - 50) * 0.01;

    // Update the background position; converting percentage to a string
    document.body.style.backgroundPosition = `${bgPositionX}% ${bgPositionY}%`;
});