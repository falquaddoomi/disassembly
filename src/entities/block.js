import Two from 'two.js';
import p2 from 'p2';
import Entity from "./entity";
import {makeThrustController} from "../controller/thruster";
import {KeyboardMapper} from "../controller/input";

export default class Block extends Entity {
    constructor(x, y, keyboard) {
        const graphic = new Two.Rectangle(0, 0, 30, 15);
        graphic.fill = '#73dbff';

        // Create an empty dynamic body
        const body = new p2.Body({
            mass: 5,
            angle: 0,
            position: [x, y],
            velocity: [0, 0]
        });

        body.fromPolygon(graphic.vertices.map((p) => [p.x, p.y]), true, false);

        super(graphic, body);

        // let's also have a controller, for fun
        // maps key events to actions for a given device, then exerts them on the player object
        const actions = new KeyboardMapper(keyboard);
        this.controller = makeThrustController(actions, this);
    }
}
