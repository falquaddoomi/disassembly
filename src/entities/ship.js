import Two from 'two.js';
import p2 from 'p2';
import Entity from "./entity";

export default class Ship extends Entity {
    constructor() {
        const graphic = new Two.Polygon(0, 0, 15, 3);
        // ship.name = 'player';
        graphic.fill = '#ff8000';

        // Create an empty dynamic body
        const body = new p2.Body({
            mass: 10,
            angle: 0,
            position: [0, 0],
            velocity: [0, 0]
        });

        body.fromPolygon(graphic.vertices.map((p) => [p.x, p.y]), true, false);
        // shipBody.addShape(new p2.Circle({ radius: 30 }));

        super(graphic, body);
    }
}
