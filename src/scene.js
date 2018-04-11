import {World} from './game.js';
import Two from 'two.js';

const elem = document.getElementById('draw-animation');
const two = new Two({
    width: elem.innerWidth, height: elem.innerHeight,
    type: Two.Types.webgl
}).appendTo(elem);

const makeCamera = (scene) => ({
    position: new Two.Vector(),
    translate: (x, y) => {
        this.position.set(two.width/2 + x, two.height/2 + y);
        scene.translation.set(this.position);
    },
    update: () => {
        // perhaps we'll animate camera movement later on
    }
});

// create the world, which adds itself to two
const world = new World(two);

two.scene.translation.set(two.width/2, two.height/2);
two.scene.scale = 1;

two.add(world.group);

// the camera transforms the world objects
const camera = makeCamera(world.group);

// start the physics sim
world.begin();

two.bind('update', () => {
    // update the camera to focus on the player
    // const playerPos = world.player.body.interpolatedPosition;
    // camera.translate(playerPos.x, playerPos.y);

    // run the world
    world.update(two.timeDelta);
}).play();
