export function makePlayerController(actions, entity) {
    // reads mapped actions from 'actions' and exerts those actions on the targeted entity
    const body = entity.body;

    return {
        processInput() {
            if (actions.check('left')) {
                body.angularVelocity = -2;
            }
            else if (actions.check('right')) {
                body.angularVelocity = 2;
            }
            else {
                body.angularVelocity = 0;
            }

            if (actions.check('forward') || actions.check('reverse')) {
                const thrust = ((actions.check('reverse')) ? -2.0 : 2.0);
                // body.applyForceLocal([0, thrust]);
                body.velocity[0] += Math.sin(-body.angle) * thrust;
                body.velocity[1] += Math.cos(body.angle) * thrust;
            }

            if (actions.check('brake')) {
                // immedately stop if we're braking
                body.velocity = [body.velocity[0] * 0.9, body.velocity[1] * 0.9];
            }
        }
    };
}
