import * as THREE from 'three';
import p2 from 'p2';

import {makeShip} from './entities/ship.js';
import {KeyboardController, KeyboardMapper} from './controller/input.js';
import {makePlayerController} from './controller/player';
import {makeStarfield} from "./effects/starfield";
import {ObjectPicker} from "./controller/input";

function ancestor(node, ancestorType) {
    let current = node;

    while (current.type !== ancestorType) {
        if (!current.parent)
            return null;

        current = current.parent;
    }

    return current;
}

export function makeWorld(camera) {
    // creates all the game assets in the world (e.g. not related to the view)
    const world = new THREE.Group();

    const keyboard = new KeyboardController();
    keyboard.start();
    // keyboard.attach((k, pressed) => { if (!pressed) { console.log(`${k} ${pressed ? 'pressed' : 'released'}`); } });

    // make a physics world that we'll simulate
    const physworld = new p2.World({ gravity: [0, 0] });

    // add a starfield effect in the background
    world.add(makeStarfield(50, 2));

    // make our player's ship
    const ship_meta = makeShip();
    const ship = ship_meta.object;
    const shipBody = ship_meta.body;

    world.add(ship);
    physworld.addBody(shipBody);

    // maps key events to actions for a given device, then exerts them on the player object
    const actions = new KeyboardMapper(keyboard);
    const playerController = makePlayerController(actions, ship_meta);

    keyboard.addEventListener('keyup', (event) => {
        if (event.message === 82) {
            shipBody.position = [0,0];
            shipBody.velocity = [0,0];
            shipBody.angle = 0;
        }
    });


    // also create a picker, so we can click stuff to control it
    const picker = new ObjectPicker(camera, ship);
    picker.start();

    picker.addEventListener('picked', (event) => {
        // find the object for each picked thing
        event.picked.forEach(x => {
            // FIXME: if a compound object has multiple overlapping parts, we may report the same Object3D more than once
            // perhaps we should collapse the results to a set
            const obj = ancestor(x.object, 'Object3D');
            console.log("picked: ", obj);
        });
    });

    return {
        group: world,
        player: ship,
        begin() {
            physworld.on('postStep', this.postStep.bind(this));
        },
        update(delta) {
            physworld.step(1/60, delta/1000, 10); // fixed ts, delta, max substeps

            // update the ship's visible properties
            // Object.assign(ship.position, ship_meta.body.position);
            [ship.position.x, ship.position.z] = shipBody.interpolatedPosition;
            ship.rotation.y = -(shipBody.interpolatedAngle);

            // check if we've picked anything with the picker
            /*
            const pickedSet = picker.check();
            if (pickedSet.length > 0) {
                console.log(pickedSet);
                // pickedSet.forEach(picked => picked.object.material.color.set(0xff0000));
            }
            */
        },
        postStep(event) {
            playerController.processInput();
        }
    };
}
