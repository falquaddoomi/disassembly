import Two from 'two.js';

import {World} from './game.js';
import {makeCamera} from './view/cameras';

const elem = document.getElementById('draw-animation');
const two = new Two({
    width: elem.clientWidth, height: elem.clientHeight,
    // type: Two.Types.webgl
}).appendTo(elem);

// create the world, which adds itself to two
const world = new World(two);

// set the center of the scene to 0, 0
two.scene.translation.set(two.width/2, two.height/2);

two.add(world.group);

// the camera transforms the world objects
const camera = makeCamera(world.group);

two.bind('update', () => {
    // focus the camera on the player
    const playerPos = world.player.body.interpolatedPosition;
    camera.translate(-playerPos[0], -playerPos[1]);

    // run the world
    world.update(two.timeDelta);

    // update the camera (e.g. to have it catch up to the current position)
    camera.update();

}).play();
