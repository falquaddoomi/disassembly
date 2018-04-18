import Two from 'two.js';

import {World} from './game.js';
import {makeCamera} from './view/cameras';

const elem = document.getElementById('draw-animation');
const two = new Two({
    width: elem.clientWidth, height: elem.clientHeight,
    autostart: true,
    type: Two.Types.svg
}).appendTo(elem);

// the camera transforms the 'camspace', the visible stuff that includes the world
const camspace = two.makeGroup();
const camera = makeCamera(camspace);

// create the world, which adds itself to two
const world = new World(two, camera);

// set the center of the scene to 0, 0
two.scene.translation.set(two.width/2, two.height/2);

// put the world in the camera's space
camspace.add(world.group);

document.addEventListener("DOMContentLoaded", () => {
    console.log("loaded!");
    world.attachHandlers();
});

elem.addEventListener('click', () => {
    world.selectCanvas()
}, false);

two.bind('update', () => {
    // run the world
    world.update(two.timeDelta);

    // update the camera (e.g. to have it catch up to the current position)
    camera.update();
});
