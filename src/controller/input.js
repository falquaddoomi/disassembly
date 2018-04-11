import EventDispatcher from '../utils/EventDispatcher';

export class KeyboardController extends EventDispatcher {
    constructor() {
        super();
        this.keysDown = new Set();
    }

    start() {
        console.log("Attaching keyboard...");
        this.keyDownListener = document.addEventListener("keydown", this._onKeyDown.bind(this), false);
        this.keyUpListener = document.addEventListener("keyup", this._onKeyUp.bind(this), false);
    }

    stop() {
        if (this.keyDownListener && this.keyUpListener) {
            console.log("Detaching keyboard...");
            document.removeEventListener('keydown', this.keyDownListener);
            document.removeEventListener('keyup', this.keyUpListener);
        }
    }

    _onKeyDown(event) {
        this.keysDown.add(event.which);
        this.dispatchEvent({ type: 'keydown', message: event.which });
    }

    _onKeyUp(event) {
        this.keysDown.delete(event.which);
        this.dispatchEvent({ type: 'keyup', message: event.which });
    }

    isPressed(whichKey) {
        return this.keysDown.has(whichKey);
    }
}

export class KeyboardMapper {
    constructor(device) {
        this.device = device;

        // key-to-action mapping
        this.actions = {
            'right': 39,
            'left': 37,
            'forward': 38,
            'reverse': 40,
            'brake': 32,
        };
    }

    check(action) {
        // check if the requested action is being performed right now
        return this.device.isPressed(this.actions[action]);
    }
}
