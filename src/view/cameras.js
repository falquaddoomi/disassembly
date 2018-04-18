import Two from "two.js";

export const makeCamera = (scene) => ({
    position: new Two.Vector(),
    target: scene,
    lerpFactor: 0.05,

    translate(x, y) {
        this.position.set(x, y);
    },
    track(body) {
        this.tracking = body;
    },
    update() {
        if (this.tracking) {
            const pos = this.tracking.interpolatedPosition;
            this.position.set(-pos[0], -pos[1]);
        }

        if (
            Math.abs(this.target.translation.x - this.position.x) > 0.01 ||
            Math.abs(this.target.translation.y - this.position.y) > 0.01) {

            // perhaps we'll animate camera movement later on
            const lerper = this.target.translation.lerp(this.position, this.lerpFactor);
            this.target.translation.set(lerper.x, lerper.y);
        }
        else {
            // we're close enough, snap it
            this.target.translation.set(this.position.x, this.position.y);
        }
    }
});
