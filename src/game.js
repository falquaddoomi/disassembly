import * as THREE from 'three';
import p2 from 'p2';

import {makeShip} from './entities/ship.js';
import {makeKeyboardController, makeKeyboardMapper} from './view/input.js';

export function makeWorld() {
    // creates all the game assets in the world (e.g. not related to the view)
    const world = new THREE.Group();

    const keyboard = makeKeyboardController();
    keyboard.start();
    keyboard.attach((k, pressed) => {
        if (!pressed) {
            console.log(`${k} ${pressed ? 'pressed' : 'released'}`);
        }
    });

    // make a physics world that we'll simulate
    const physworld = new p2.World({ gravity: [0, 0] });

    // maps key events to actions for a given device
    const actions = makeKeyboardMapper(keyboard);

    // make our player's ship
    const ship_meta = makeShip();
    const ship = ship_meta.object;
    const shipBody = ship_meta.body;
    world.add(ship);

    // deals with updating the physical world, which is going to be pretty much everything...

    return {
        group: world,
        begin() {
            physworld.on('postStep', this.postStep.bind(this));
        },
        update(delta) {
            physworld.step(1/60, delta/1000, 10); // fixed ts, delta, max substeps

            // update the ship's visible properties
            ship.position = ship_meta.body.interpolatedPosition;
        },
        postStep(event) {
            this.processInput();
        },
        processInput() {
            if (actions.check('left')) {
                ship.angularVelocity = -2;
            }
            if (actions.check('right')) {
                ship.angularVelocity = 2;
            }
            else {
                shipBody.angularVelocity = 0;
            }

            if (actions.check('forward') || actions.check('reverse')) {
                shipBody.applyForceLocal([0, ((actions.check('reverse')) ? -1.0 : 2.0)]);
            }

        }
    };
}
