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
    const dragTitle = document.querySelector('.drag-title');
    const dragContact = document.querySelector('.drag-contact');
    const dragSubtitle = document.querySelector('.drag-subtitle');
    let stop = false;

    sceneSetup.scene.add(cardSetup.card);
    cardSetup.startAnimation(cardAnimation, sceneSetup);

    sceneSetup.scene.add(backgroundSetup.background);

    //Animation transition starts
    window.addEventListener("click", async function () {
        if (!stop) {
            stop = true;
            //TODO: REFACTOR TO COMPLETED LISTENER
            cardAnimation.deanimate();
            toggleDragVisibility(dragSubtitle);
            backgroundSetup.startAnimation(starAnimation, sceneSetup);

            await toggleDragInAndOutAnimation(dragTitle);
            dragTitle.innerText = "Our Journey";
            await toggleDragInAndOutAnimation(dragTitle);
            dragTitle.innerText = "Together";
            await toggleDragInAndOutAnimation(dragTitle);
            dragTitle.innerText = "Starts!";
            starAnimation.deanimate();
            await toggleDragInAndOutAnimation(dragTitle);


            if(window.innerWidth > 750) {
                document.body.style.backgroundSize = '150%';
            } else {
                document.body.style.backgroundSize = '250%';
            }
            await delay(4500);
            toggleDragVisibility(dragContact);
            dragSubtitle.innerText = "LEADING TRUST TOWARDS SUCCESS"
            toggleDragVisibility(dragSubtitle);
        }

    });

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
    window.addEventListener('touchend', () => cardAnimation.endDrag(), {passive: false});

    //UI Transition (TODO: REFACTOR THIS FILE URGENTLY)
    const contactButton = document.getElementById('contact-button');
    const linkedinButton = document.getElementById('linkedin-button');
    const githubButton = document.getElementById('github-button');
    const dragTitle = document.querySelector('.drag-contact');

    contactButton.addEventListener('click', function() {
        window.location.href = './asset/vCard.vcf';
        //toggleDragVisibility(dragTitle);
    });
    linkedinButton.addEventListener('click', function() {
        window.open('https://linkedin.com/in/davidfesteban', '_blank');
        //toggleDragVisibility(dragTitle);
    });
    githubButton.addEventListener('click', function() {
        window.open('https://github.com/davidfesteban', '_blank');
        //toggleDragVisibility(dragTitle);
    });
}

async function toggleDragInAndOutAnimation(element) {
    toggleDragVisibility(element);
    await delay(1500);
    toggleDragVisibility(element);
    await delay(1500);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function toggleDragVisibility(element) {
    if(element.classList.contains('hide')) {
        element.classList.add('show');
        element.classList.toggle('hide');
    } else if (element.classList.contains('show')) {
        element.classList.add('hide');
        element.classList.toggle('show');
    }
}

//Special case for parallax background
document.addEventListener('pointermove', (e) => {
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