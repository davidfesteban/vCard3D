export class SceneSetup {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true, powerPreference: "high-performance"});
        this.camera = new THREE.PerspectiveCamera(60, this.container.offsetWidth / this.container.offsetHeight, 0.1, 1900);
        this.#init();
    }

    #init() {
        this.#initRenderer();
        this.#initLights();
        this.#initCameraPosition();
    }

    #initCameraPosition() {
        if(this.container.offsetWidth < 500) {
            this.camera.position.z = 6;
        } else {
            this.camera.position.z = 4;
        }
    }

    #initRenderer() {
        //Background transparent
        this.renderer.setClearColor(0x000000, 0);

        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.container.appendChild(this.renderer.domElement);
    }

    #initLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 1, 1);
        this.scene.add(directionalLight);
    }

    onWindowResize = () => {
        this.#initCameraPosition();
        this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
    }
}

