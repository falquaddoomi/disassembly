export function makePlayerController(actions, entity) {
    // reads mapped actions from 'actions' and exerts those actions on the targeted entity
    const body = entity.body;

    return {
        logged: false,
        processInput() {
            if (actions.check('left')) {
                this.logged = false;
                body.angularVelocity = -2;
            }
            else if (actions.check('right')) {
                this.logged = false;
                body.angularVelocity = 2;
            }
            else {
                body.angularVelocity = 0;

                // if we're near a multiple of pi/2, snap to it
                if (!this.logged) {
                    console.log("angle: ", body.angle);
                    this.logged = true;
                }
            }

            if (actions.check('forward') || actions.check('reverse')) {
                const thrust = ((actions.check('reverse')) ? -3.0 : 3.0);
                body.applyForceLocal([0, thrust]);
            }

            if (actions.check('brake')) {
                // immedately stop if we're braking
                body.velocity = [body.velocity[0] * 0.9, body.velocity[1] * 0.9];
            }
        }
    };
}
