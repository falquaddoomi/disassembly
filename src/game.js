import p2 from 'p2';

import {Ship, Block} from './entities';
import {KeyboardController, KeyboardMapper} from './controller/input.js';
import {makePlayerController} from './controller/player';

function crand() {
    return Math.random() * 2.0 - 1.0;
}

function pmod(x,v) { while(x < 0) { x += v; } return x % v; }

function product(a, b) {
    return a.map(av => b.map(bv => [av, bv]))
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
        this.physworld = new p2.World({
            gravity: [0, 0],
            islandSplit: true
        });

        this.makeEntities(two);

        // maps key events to actions for a given device, then exerts them on the player object
        this.actions = new KeyboardMapper(keyboard);
        this.playerController = makePlayerController(this.actions, this.player);

        keyboard.addEventListener('keyup', (event) => {
            if (event.message === 82) {
                this.ship.body.position = [0,0];
                this.ship.body.velocity = [0,0];
                this.ship.body.angle = 0;
            }
        });

        // allow us to process user input after every physics step
        this.physworld.on('postStep', this.postStep.bind(this));
    }

    makeEntities(two) {
        // make our player's ship
        this.ship = new Ship();
        this.add(this.ship);
        this.player = this.ship;

        // make some blocks, too
        for (let i = 0; i < 10; i++) {
            this.add(new Block(crand() * 100, 150 + (crand() * 30)));
        }

        this.makeWalls(two);
    }

    makeWalls(two) {
        // add immovable walls around the playfield (for now)
        const walls = [
            [-two.width/2, 0], // left
            [0, -two.height/2], // top
            [two.width/2, 0], // right
            [0, two.height/2], // bottom
        ];
        walls.forEach(([x,y]) => {
            const wallBody = new p2.Body({ mass: 0 });
            wallBody.addShape(new p2.Plane());
            wallBody.position.set([x, y]);

            // the plane's facing +Y (not +X as you'd expect), hence this weird call
            wallBody.angle = pmod(Math.atan2(x, -y), Math.PI * 2.0);

            this.physworld.addBody(wallBody);
        });

        // add drawable representation, too
        const wallGraphics = new Two.Path([
            [-two.width/2, -two.height/2],
            [two.width/2,  -two.height/2],
            [two.width/2,   two.height/2],
            [-two.width/2,   two.height/2]
        ].map((pt) => new Two.Anchor(pt[0], pt[1], pt[0], pt[1], pt[0], pt[1], null)), true, false);
        wallGraphics.stroke = 'black';
        wallGraphics.fill = 'transparent';
        this.group.add(wallGraphics);
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
        // args: (fixed ts, delta, max substeps)
        this.physworld.step(1/60, delta/1000, 10);

        // snaps entity's rendered position to physics position
        this.ents.forEach(x => x.sync());
    }

    postStep(event) {
        this.playerController.processInput();
    }
}
