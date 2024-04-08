document.addEventListener('DOMContentLoaded', (event) => {
    let scene, camera, renderer, card, frontTexture, backTexture;
    let isDragging = false;
    let previousMouseX = 0, previousMouseY = 0;
    let rotationSpeedX = 0, rotationSpeedY = 0;

    const sceneContainer = document.getElementById('scene-container');

    init();
    animate();

    function init() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, sceneContainer.offsetWidth / sceneContainer.offsetHeight, 0.1, 1900);
        renderer = new THREE.WebGLRenderer({alpha: true, antialias: true, powerPreference: "high-performance"});
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(sceneContainer.offsetWidth, sceneContainer.offsetHeight);
        sceneContainer.appendChild(renderer.domElement);

        frontTexture = new THREE.TextureLoader().load('./asset/front.png');
        backTexture = new THREE.TextureLoader().load('./asset/back.png');
        frontTexture.anisotropy = renderer.getMaxAnisotropy();
        backTexture.anisotropy = renderer.getMaxAnisotropy();
        frontTexture.minFilter = THREE.LinearFilter;
        backTexture.minFilter = THREE.LinearFilter;

        // Adjust these dimensions as needed
        const cardWidth = 2.625;
        const cardHeight = 1.5;
        const cardThickness = 0.05; // Add some thickness to your card

        // Using BoxGeometry to create a geometry with some thickness
        const geometry = new THREE.BoxGeometry(cardWidth, cardHeight, cardThickness);

        // Since BoxGeometry creates a 3D box, we'll adjust the material application
        const materials = [
            new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}), // side material (optional, can be set to the color of the edge or any preference)
            new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}), // top and bottom material
            new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}), // left and right material
            new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide}),
            new THREE.MeshPhongMaterial({map: frontTexture}), // front side
            new THREE.MeshPhongMaterial({map: backTexture}),
        ];

        // Create a mesh with the geometry and materials
        card = new THREE.Mesh(geometry, materials);
        card.position.set(0, 0, 0);
        card.rotation.set(-0.2, -0.2, 0.01);
        scene.add(card);

        // Add some lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 1, 1);
        scene.add(directionalLight);

        camera.position.z = 4;

        window.addEventListener('resize', onWindowResize, false);

        // Mouse event listeners
        renderer.domElement.addEventListener('mousedown', startDrag);
        window.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', endDrag);

        // Touch event listeners for mobile
        renderer.domElement.addEventListener('touchstart', (e) => startDrag(e.touches[0]), {passive: false});
        window.addEventListener('touchmove', (e) => drag(e.touches[0]), {passive: false});
        window.addEventListener('touchend', endDrag, {passive: false});
    }

    function onWindowResize() {
        camera.aspect = sceneContainer.offsetWidth / sceneContainer.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(sceneContainer.offsetWidth, sceneContainer.offsetHeight);
    }

    function startDrag(e) {
        isDragging = true;
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
        // Prevent default action for touch start
        if (e.type === 'touchstart') {
            e.preventDefault();
        }
    }

    function drag(e) {
        if (isDragging) {
            const deltaX = e.clientX - previousMouseX;
            const deltaY = e.clientY - previousMouseY;

            rotationSpeedY = deltaX * 0.005;
            rotationSpeedX = deltaY * 0.005;

            card.rotation.y += rotationSpeedY;
            card.rotation.x += rotationSpeedX;

            previousMouseX = e.clientX;
            previousMouseY = e.clientY;

            // Prevent default action for touch move
            if (e.type === 'mousemove' && e.cancelable) {
                e.preventDefault();
            }
        }
    }

    function endDrag() {
        isDragging = false;
    }


    function animate() {
        requestAnimationFrame(animate);

        if (!isDragging) {
            // Apply inertia
            card.rotation.x += rotationSpeedX;
            card.rotation.y += rotationSpeedY;

            // Gradually reduce rotation speed to simulate inertia
            rotationSpeedX *= 0.95;
            rotationSpeedY *= 0.95;

            // Return to default slow rotation once the inertia has almost stopped
            if (Math.abs(rotationSpeedX) < 0.001 && Math.abs(rotationSpeedY) < 0.001) {
                card.rotation.y += 0.002; // Default slow rotation
                rotationSpeedX = 0; // Stop further rotation adjustments
                rotationSpeedY = 0;
            }
        }

        renderer.render(scene, camera);
    }
});