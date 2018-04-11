import Two from 'two.js';
import p2 from 'p2';
import Entity from "./entity";

export default class Block extends Entity {
    constructor(x, y) {
        const graphic = new Two.Rectangle(0, 0, 15, 5);
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
    }
}
