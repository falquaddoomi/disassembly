import p2 from 'p2';

import {Ship, Block} from './entities';
import {KeyboardController, KeyboardMapper} from './controller/input.js';

function crand() {
    return Math.random() * 2.0 - 1.0;
}

function pmod(x,v) { while(x < 0) { x += v; } return x % v; }

function product(a, b) {
    return a.map(av => b.map(bv => [av, bv]))
}

export class World {
    constructor(two, camera) {
        // creates all the game assets in the world (e.g. not related to the view)
        const world = new Two.Group();
        this.camera = camera;
        this.group = world;
        this.bgGroup = new Two.Group();
        this.group.add(this.bgGroup);
        this.mode = 'thrust'; // the select mode, editable via changeSelectMode();

        // create a separate set in which to store entities that need to be synced
        this.ents = new Set();

        // origin dot
        const c = new Two.Circle(0, 0, 12);
        c.fill = 'rgba(255, 0, 0, 0.25)';
        c.stroke = 'none';
        world.add(c);

        const keyboard = new KeyboardController();
        keyboard.start();

        // keyboard.addEventListener('keyup', ({ message: k }) => { console.log(`${k} pressed`); });

        // make a physics world that we'll simulate
        this.physworld = new p2.World({
            gravity: [0, 0],
            islandSplit: true
        });

        this.makeEntities(two, keyboard);

        // initially select the ship
        this.selectEntity(this.ship);

        // resets the ship's position for debugging purposes
        // (it's not in the player controller because the player shouldn't have that kind of authority)
        keyboard.addEventListener('keyup', (event) => {
            if (event.message === 82) {
                this.ship.body.position = [0,0];
                this.ship.body.velocity = [0,0];
                this.ship.body.angle = 0;
            }
        });

        // allow us to process input (wherever it comes from) after every physics step
        this.physworld.on('postStep', this.postStep.bind(this));
    }

    makeEntities(two, keyboard) {
        // make our player's ship
        this.ship = new Ship(two, keyboard);
        this.add(this.ship);
        this.player = this.ship;

        // make some blocks, too
        for (let i = 0; i < 10; i++) {
            this.add(
                new Block(crand() * 100, 150 + (crand() * 30), keyboard)
            );
        }

        this.makeWalls(two);
    }

    makeWalls(two) {
        const WALL_SCALE = 2;

        // add immovable walls around the playfield (for now)
        const walls = [
            [-two.width/2 * WALL_SCALE, 0], // left
            [0, -two.height/2 * WALL_SCALE], // top
            [two.width/2 * WALL_SCALE, 0], // right
            [0, two.height/2 * WALL_SCALE], // bottom
        ];
        walls.forEach(([x,y]) => {
            const wallBody = new p2.Body({ mass: 0 });
            wallBody.addShape(new p2.Plane());
            wallBody.position.set([x, y]);

            // the plane's facing +Y (not +X as you'd expect), hence this weird call
            // noinspection JSSuspiciousNameCombination
            wallBody.angle = pmod(Math.atan2(x, -y), Math.PI * 2.0);

            this.physworld.addBody(wallBody);
        });

        // add drawable representation, too
        const wallGraphics = new Two.Path([
            [-two.width/2 * WALL_SCALE, -two.height/2 * WALL_SCALE],
            [ two.width/2 * WALL_SCALE, -two.height/2 * WALL_SCALE],
            [ two.width/2 * WALL_SCALE,  two.height/2 * WALL_SCALE],
            [-two.width/2 * WALL_SCALE,  two.height/2 * WALL_SCALE]
        ].map((pt) => new Two.Anchor(pt[0], pt[1], pt[0], pt[1], pt[0], pt[1], null)), true, false);
        wallGraphics.stroke = '#ccc';
        wallGraphics.linewidth = 3;
        wallGraphics.fill = 'transparent';
        this.bgGroup.add(wallGraphics);
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
        if (this.focused && this.focused.controller) {
            this.focused.controller.processInput(this.mode);
        }
    }

    attachHandlers() {
        if (!this.attached) {
            this.attached = true;

            setTimeout(() => {
                console.log("Attaching entity handlers...");

                this.ents.forEach(x => {
                    if (x.attachHandler) {
                        x.attachHandler(this);
                    }
                });
            }, 500);
        }
    }

    selectEntity(ent) {
        if (this.focused) {
            const oldGraphic = this.focused.graphic;
            oldGraphic.stroke = this.focused.oldStroke.stroke;
            oldGraphic.linewidth = this.focused.oldStroke.width;
        }

        const newGraphic = ent.graphic;
        ent.oldStroke = { stroke: ent.graphic.stroke, width: ent.graphic.linewidth };
        newGraphic.stroke = this.mode === 'thrust' ? '#c00' : '#5397cc';
        newGraphic.linewidth = 3;

        this.focused = ent;
        this.camera.track(this.focused.body);
    }

    selectCanvas() {
        console.log("Entity deselected");

        if (this.focused) {
            const oldGraphic = this.focused.graphic;
            oldGraphic.stroke = this.focused.oldStroke.stroke;
            oldGraphic.linewidth = this.focused.oldStroke.width;
        }
        this.focused = null;

        // make the camera track nothing
        this.camera.track(null);
    }

    changeSelecMode(newMode) {
        this.mode = newMode;
        if (this.focused) {
            // reselect entity with the new mode
            this.selectEntity(this.focused);
        }
    }
}
