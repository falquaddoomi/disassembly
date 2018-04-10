import * as THREE from 'three';

export class KeyboardController extends THREE.EventDispatcher {
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
    }

    // key-to-action mapping
    actions = {
        'right': 39,
        'left': 37,
        'forward': 38,
        'reverse': 40,
        'brake': 32,
    };

    check(action) {
        // check if the requested action is being performed right now
        return this.device.isPressed(this.actions[action]);
    }
}

export class ObjectPicker extends THREE.EventDispatcher {
    constructor(camera, target) {
        super();
        this.camera = camera;
        this.target = target;
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
    }

    start() {
        console.log("Attaching mouse picker...");
        this.mouseMoveListener = window.addEventListener('mousemove', this._onMouseMove.bind(this), false);
        this.mouseUpListener = window.addEventListener('mouseup', this._onMouseUp.bind(this), false);
    }

    stop() {
        if (this.mouseMoveListener && this.mouseUpListener) {
            console.log("Detaching mouse picker...");
            window.removeEventListener('mousemove', this.mouseMoveListener);
        }
    }

    check() {
        // update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // calculate objects intersecting the picking ray
        return this.raycaster.intersectObject(this.target, true);
    }

    _onMouseMove(event) {
        // calculate this.mouse position in normalized device coordinates
        // (-1 to +1) for both components

        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    _onMouseUp(event) {
        // TODO: trigger any attached listeners that care about mouseups
        const pickedSet = this.check();
        if (pickedSet.length > 0) {
            this.dispatchEvent({ type: 'picked', picked: pickedSet });
        }
    }
}
