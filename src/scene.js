import * as THREE from 'three';

import {makeWorld} from './game.js';
import {makeHUD} from "./hud";
import {makeObjectPicker} from "./controller/input";

const scene = new THREE.Scene();
const isOrtho = true;
const frustumSize = 4;
const aspect = window.innerWidth / window.innerHeight;
const camera = (isOrtho)
    ? new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 2000 )
    : new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

// make the camera above the field, looking down
const CAM_HEIGHT = 10;
camera.position.set(0, CAM_HEIGHT, 0);
camera.lookAt(0, 0, 0);

// axes helper
const axesHelper = new THREE.AxesHelper(1);
scene.add( axesHelper );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0x000000);
renderer.autoClear = false;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

const light = new THREE.PointLight( 0xffffff, 1, 100 );
light.position.set(0, 10, 0);
scene.add(light);

// create a HUD
const HUD = makeHUD(window.innerWidth, window.innerHeight);
HUD.addUiElement({
    id: 'bottom-center',
    width: 300,
    height: 50,
    color: 0xdddddd,
    align: 'center',
    valign: 'bottom'
});
HUD.addUiElement({
    id: 'top-left',
    width: 100,
    height: 100,
    color: 0xff0000,
    align: 'left',
    valign: 'top'
});
HUD.onResize(window.innerWidth, window.innerHeight);

// create the world and add it to the scene
const world = makeWorld(camera);
scene.add(world.group);

// ensure the viewport is always the same size as the window
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // const aspect = window.innerWidth / window.innerHeight;
    const aspect = width / height;

    if (isOrtho) {
        camera.left = frustumSize * aspect / -2;
        camera.right = frustumSize * aspect / 2;
        /*
        // we may decide to update the frustumSize dynamically later, so the below are left commented
        camera.top = frustumSize / 2;
        camera.bottom = frustumSize / -2;
        */
        camera.updateProjectionMatrix();
    }
    else {
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
    }

    // update the HUD
    HUD.onResize(width, height);

    renderer.setSize(width, height);
}, false );

// specify what to do each frame...
let lastTime = performance.now();
function animate(time) {
    requestAnimationFrame(animate);

    // move the camera to the player
    camera.position.set(world.player.position.x, CAM_HEIGHT, world.player.position.z);
    camera.updateMatrixWorld();

    // animation
    world.update(time - lastTime);

    // drawing
    renderer.clear();
    renderer.render(scene, camera);
    // draw the UI on top
    HUD.render(renderer);

    // update for next delta
    lastTime = time;
}

// start the world (e.g. associate physics/input/etc. handlers)
world.begin();

// ...and then kick it off
animate();
