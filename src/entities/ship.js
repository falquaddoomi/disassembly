import Two from 'two.js';
import p2 from 'p2';
import Entity from "./entity";
import {makeThrustController} from "../controller/thruster";
import {KeyboardMapper} from "../controller/input";

export default class Ship extends Entity {
    constructor(two, keyboard) {
        const graphic = new Two.Group();

        const tri = new Two.Polygon(0, 0, 15, 3);
        // ship.name = 'player';
        tri.fill = '#ff8000';

        const caret = new Two.Polygon(0, -15, 7, 3);
        caret.fill = 'black';
        caret.stroke = 'none';

        graphic.add(tri);
        graphic.add(caret);

        graphic.rotation = Math.PI * 0.5;

        // Create an empty dynamic body
        const body = new p2.Body({
            mass: 10,
            angle: 0,
            position: [0, 0],
            velocity: [0, 0]
        });

        body.fromPolygon(tri.vertices.map((p) => [p.x, p.y]), true, false);
        // shipBody.addShape(new p2.Circle({ radius: 30 }));

        super(graphic, body);

        this.facing = Math.PI;

        // maps key events to actions for a given device, then exerts them on the player object
        const actions = new KeyboardMapper(keyboard);
        this.controller = makeThrustController(actions, this);
    }
}
