import * as THREE from 'three';
import p2 from 'p2';

import {makeShip} from './entities/ship.js';
import {makeKeyboardController, makeKeyboardMapper} from './controller/input.js';
import {makePlayerController} from './controller/player';

export function makeWorld() {
    // creates all the game assets in the world (e.g. not related to the view)
    const world = new THREE.Group();

    const keyboard = makeKeyboardController();
    keyboard.start();
    // keyboard.attach((k, pressed) => { if (!pressed) { console.log(`${k} ${pressed ? 'pressed' : 'released'}`); } });

    // make a physics world that we'll simulate
    const physworld = new p2.World({ gravity: [0, 0] });

    // make our player's ship
    const ship_meta = makeShip();
    const ship = ship_meta.object;
    const shipBody = ship_meta.body;

    world.add(ship);
    physworld.addBody(shipBody);

    // maps key events to actions for a given device, then exerts them on the player object
    const actions = makeKeyboardMapper(keyboard);
    const playerController = makePlayerController(actions, ship_meta);

    keyboard.attach((k, pressed) => {
        if (k === 82) {
            shipBody.position = [0,0];
            shipBody.velocity = [0,0];
            shipBody.angle = 0;
        }
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
        },
        postStep(event) {
            playerController.processInput();
        }
    };
}