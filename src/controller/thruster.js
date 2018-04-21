export function makeThrustController(actions, entity) {
    // reads mapped actions from 'actions' and exerts those actions on the targeted entity
    const body = entity.body;

    return {
        processInput(selectMode) {
            // only thrust in thrust mode
            if (selectMode !== 'thrust') {
                return;
            }

            if (actions.check('left')) {
                body.angularVelocity = -3;
            }
            else if (actions.check('right')) {
                body.angularVelocity = 3;
            }
            else {
                body.angularVelocity = 0;
            }

            if (actions.check('forward') || actions.check('reverse')) {
                const thrust = ((actions.check('reverse')) ? -2.0 : 4.0);
                body.applyForceLocal([
                    thrust * 500.0 * Math.sin(entity.facing),
                    thrust * 500.0 * Math.cos(entity.facing)
                ]);
                // body.velocity[0] += Math.sin(-body.angle + entity.facing) * thrust;
                // body.velocity[1] += Math.cos(body.angle + entity.facing) * thrust;
            }

            if (actions.check('brake')) {
                // immedately stop if we're braking
                body.velocity = [body.velocity[0] * 0.9, body.velocity[1] * 0.9];
            }
        }
    };
}
