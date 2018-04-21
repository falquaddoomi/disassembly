export default class Entity {
    constructor(graphic, body) {
        this.graphic = graphic;
        this.body = body;
        this.facing = 0; // in radians, allows us to offset which direction we're facing regardless of our geometry

        // sync initially
        graphic.translation.set(body.position[0], body.position[1]);
        graphic.rotation = body.angle;
    }

    sync() {
        // update the ship's visible properties
        // Object.assign(ship.position, ship_meta.body.position);
        this.graphic.translation.set(this.body.interpolatedPosition[0], this.body.interpolatedPosition[1]);
        this.graphic.rotation = this.body.interpolatedAngle;
    }

    attachHandler(world) {
        document.getElementById(this.graphic.id).addEventListener("click", (event) => {
            console.log("clicked!");
            event.stopPropagation();

            // tell the world that we're selected
            world.selectEntity(this);
        });
    }
}
