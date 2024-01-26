import * as THREE from 'three';

import { OBJLoader } from '../external_tools/OBJLoader';
import { OrbitControls } from '../external_tools/OrbitControls';

function parseMatrix(value: number[][]): THREE.Matrix4 {
  const m = new THREE.Matrix4();
  m.set(
    value[0][0], value[0][1], value[0][2], value[0][3],
    value[1][0], value[1][1], value[1][2], value[1][3],
    value[2][0], value[2][1], value[2][2], value[2][3],
    value[3][0], value[3][1], value[3][2], value[3][3]);
  return m;
}

export class SceneManager {
  container: HTMLDivElement;
  viewSlider: HTMLDivElement;
  animationFrameId?: number;
  sceneL: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  baseFootRoot = { left: new THREE.Group(), right: new THREE.Group() };
  controls?: OrbitControls;
  footMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color(1, 1, 1) });

  sceneR: THREE.Scene = new THREE.Scene();
  footMaterialAlternative = new THREE.MeshStandardMaterial({
    color: new THREE.Color(1, 1, 1),
    emissive: new THREE.Color(0x385E77),
    roughness: 0.5,
  });

  constructor(
    container:  HTMLDivElement,
    viewSlider: HTMLDivElement,
    cameraPosition: {
      x: number;
      y: number;
      z: number;
    },
    sceneLBackground: THREE.Color,
    sceneRBackground: THREE.Color,
  ) {
    this.container = container;
    this.viewSlider = viewSlider;

    // Init scenes
    const aspect = (this.container.clientWidth / this.container.clientHeight) || 1;
    this.sceneL = new THREE.Scene();
    this.sceneL.background = sceneLBackground;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 10);
    this.camera.position.set(
      cameraPosition.x,
      cameraPosition.y,
      cameraPosition.z,
    );
    this.camera.up.set( 0, 0, 1 );
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
    });
    this.container.appendChild(this.renderer.domElement);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.updateRendererSize();
    window.addEventListener('resize', () => this.updateRendererSize());
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.sceneL.add(this.baseFootRoot.left);
    this.sceneL.add(this.baseFootRoot.right);
    this.addLights();
    this.loadAllFeet().then(() => {
      this.initAlternativeScene(sceneRBackground);
      this.animate();
    });
  }

  initAlternativeScene = (bgColor) => {
    /**
     * Alternative Scene
     * --------------------------
     * Bonus: experiment with the scene
     */
    this.sceneR.copy(
      this.sceneL,
      true,
    );
    this.sceneR.traverse(object => {
      if (object.name === 'foot' && object instanceof THREE.Mesh) {
        object.material = this.footMaterialAlternative;
        object.material.wireframe = true;
      }
    });
    this.sceneR.background = new THREE.Color(bgColor);
  }

  addLights = () => {
    const lights = {
      ambient: 0x444444,
      directional: {
        z: 0.6,
        intensity: 0.22,
        color: 0xffffff,
      },
    };
    this.sceneL.add(new THREE.AmbientLight(lights.ambient));

    // spotlights
    const z:         number = lights.directional.z;
    const intensity: number = lights.directional.intensity;
    const color:     number = lights.directional.color;

    const createDirectionalLight = (color: number, intensity: number, x: number, y: number, z: number) => {
      const directionalLight = new THREE.DirectionalLight(color, intensity);
      directionalLight.position.set(x, y, z);
      return directionalLight;
    }

    this.sceneL.add(createDirectionalLight(color, intensity, -0.3, -0.3, z));
    this.sceneL.add(createDirectionalLight(color, intensity,  0.3, -0.3, z));
    this.sceneL.add(createDirectionalLight(color, intensity, -0.3,  0.3, z));
    this.sceneL.add(createDirectionalLight(color, intensity,  0.3,  0.3, z));
  }

  loadAllFeet = async () => {
    await Promise.all([
      this.loadFootMesh('left'),
      this.loadFootMesh('right'),
    ]);
    await this.loadScene();
  }

  loadFootMesh = async (side: 'left' | 'right') => {
    const blobUrl = `./models/${side}.obj`;
    const loader = new OBJLoader();
    try {
      const object: THREE.Object3D = await new Promise(resolve =>
        (loader as any).load(blobUrl, object => resolve(object)));
      object.traverse(mesh => {
        if (mesh instanceof THREE.Mesh) {
          mesh.name = 'foot';
          mesh.userData = { side };
          mesh.material = this.footMaterial;
          mesh.material.opacity = 1.0;
          mesh.material.transparent = true;
        }
      });
      object.userData = { side };
      this.baseFootRoot[side].add(object);
    } catch (error) {
      console.error('load foot mesh failed', error);
    }
  }

  loadScene = async () => {
    const blobUrl = `./models/scene.json`;
    try {
      const response = await fetch(blobUrl);
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const data = await response.json();
      const matrixL = parseMatrix(data.world_from_foot.left);
      this.baseFootRoot.left.children.forEach(foot => {
        foot.matrix = matrixL;
        foot.matrixAutoUpdate = false;
      });
      const matrixR = parseMatrix(data.world_from_foot.right);
      this.baseFootRoot.right.children.forEach(foot => {
        foot.matrix = matrixR;
        foot.matrixAutoUpdate = false;
      });
    } catch (error) {
      console.error('load scene json failed', error);
    }
  }

  updateRendererSize() {
    const container = this.container;
    if (!container) {
      console.warn('Update renderer size failed: canvas not found');
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!width || !height) {
      console.log(`bad dimensions: ${width}x${height}`);
    } else {
      this.camera['aspect'] = width / height;
      this.renderer.setSize(width, height);
      this.camera.updateProjectionMatrix();
    }
  }

  animate = () => {
    if (!this.container) { return; }
    const sliderPos = this.viewSlider.getBoundingClientRect().x + 20;
    this.renderer.setScissor(
      0,
      0,
      sliderPos,
      window.innerHeight,
    );
    this.renderer.render(this.sceneL, this.camera);
    this.renderer.setScissor(
      sliderPos,
      0,
      window.innerWidth,
      window.innerHeight,
    );
    this.renderer.setScissorTest(true);
    this.renderer.render(this.sceneR, this.camera);
    if (this.controls) {
      this.controls.update();
    }
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
};
