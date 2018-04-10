import * as THREE from 'three';

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
            if (this.keyDownListener && this.keyUpListener) {
                console.log("Detaching keyboard...");
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

export function makeObjectPicker(camera, target) {
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    return {
        start() {
            console.log("Attaching mouse picker...");
            this.mouseMoveListener = window.addEventListener( 'mousemove', this.onMouseMove, false );
        },
        stop() {
            if (this.mouseMoveListener) {
                console.log("Detaching mouse picker...");
                window.removeEventListener('mousemove', this.mouseMoveListener);
                this.mouseMoveListener = null;
            }
        },
        check() {
            // update the picking ray with the camera and mouse position
            raycaster.setFromCamera(mouse, camera);

            // calculate objects intersecting the picking ray
            return raycaster.intersectObject(target, true);
        },
        onMouseMove(event) {
            // calculate mouse position in normalized device coordinates
            // (-1 to +1) for both components

            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        }
    }
}
