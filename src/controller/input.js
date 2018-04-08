export function makeKeyboardController() {
    const keysDown = new Set();
    const listeners = new Set();

    return {
        start() {
            console.log("Attaching keyboard...");
            this.keyDownListener = document.addEventListener("keydown", this._onKeyDown, false);
            this.keyUpListener = document.addEventListener("keyup", this._onKeyUp, false);
        },
        stop() {
            console.log("Detaching keyboard...");
            if (this.keyDownListener && this.keyUpListener) {
                document.removeEventListener('keydown', this.keyDownListener);
                document.removeEventListener('keyup', this.keyUpListener);
            }
        },
        _onKeyDown(event) {
            keysDown.add(event.which);
            listeners.forEach(x => x(event.which, true));
        },
        _onKeyUp(event) {
            keysDown.delete(event.which);
            listeners.forEach(x => x(event.which, false));
        },
        isPressed(whichKey) {
            return keysDown.has(whichKey);
        },
        attach(listener) {
            listeners.add(listener);
        },
        detach(listener) {
            return listeners.delete(listener);
        }
    };
}

export function makeKeyboardMapper(device) {
    // key-to-action mapping
    const actions = {
        'right': 39,
        'left': 37,
        'forward': 38,
        'reverse': 40,
        'brake': 32,
    };

    return {
        check(action) {
            // check if the requested action is being performed right now
            return device.isPressed(actions[action]);
        }
    };
}
