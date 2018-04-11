import p2 from 'p2';

import {Ship, Block} from './entities';
import {KeyboardController, KeyboardMapper} from './controller/input.js';
import {makePlayerController} from './controller/player';

function crand() {
    return Math.random() * 2.0 - 1.0;
}

export class World {
    constructor(two) {
        // creates all the game assets in the world (e.g. not related to the view)
        const world = new Two.Group();
        this.group = world;

        // create a separate set in which to store entities that need to be synced
        this.ents = new Set();

        // origin dot
        const c = new Two.Circle(0, 0, 12);
        c.fill = 'rgba(255, 0, 0, 0.25)';
        world.add(c);

        const keyboard = new KeyboardController();
        keyboard.start();
        // keyboard.addEventListener('keyup', ({ message: k }) => { console.log(`${k} pressed`); });

        // make a physics world that we'll simulate
        this.physworld = new p2.World({ gravity: [0, 0] });

        // make our player's ship
        this.ship = new Ship();
        this.add(this.ship);
        this.player = this.ship;

        // make a block, too
        for (let i = 0; i < 10; i++) {
            this.add(new Block(crand() * 100, 150 + (crand() * 30)));
        }

        // maps key events to actions for a given device, then exerts them on the player object
        const actions = new KeyboardMapper(keyboard);
        this.playerController = makePlayerController(actions, this.player);

        keyboard.addEventListener('keyup', (event) => {
            if (event.message === 82) {
                this.ship.body.position = [0,0];
                this.ship.body.velocity = [0,0];
                this.ship.body.angle = 0;
            }
        });
    }

    begin() {
        this.physworld.on('postStep', this.postStep.bind(this));
    }

    add(obj) {
        this.ents.add(obj);
        this.group.add(obj.graphic);
        this.physworld.addBody(obj.body);
    }

    remove(obj) {
        this.ents.delete(obj);
        this.group.add(obj.graphic);
        this.physworld.addBody(obj.body);
    }

    update(delta) {
        this.physworld.step(1/60, delta/1000, 10); // fixed ts, delta, max substeps

        // matches ship's rendered position to physics position
        this.ents.forEach(x => x.sync());
    }

    postStep(event) {
        this.playerController.processInput();
    }
}
