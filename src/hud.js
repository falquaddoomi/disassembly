import * as THREE from "three";

export function makeHUD(windowWidth, windowHeight) {
    const halfWidth = windowWidth * 0.5;
    const halfHeight = windowHeight * 0.5;

    // create a UI scene and camera
    const uiScene = new THREE.Scene();
    const uiCamera = new THREE.OrthographicCamera(-halfWidth, halfWidth, halfHeight, -halfHeight, 1, 10);
    const uiElements = {};

    uiCamera.position.set(0, 0, 10);

    return {
        scene: uiScene,
        camera: uiCamera,

        onResize(width, height) {
            const halfWidth = 0.5 * width;
            const halfHeight = 0.5 * height;

            uiCamera.left = -halfWidth;
            uiCamera.right = halfWidth;
            uiCamera.top = halfHeight;
            uiCamera.bottom = -halfHeight;
            uiCamera.updateProjectionMatrix();

            // realign relatively-positioned UI elements
            Object.values(uiElements).forEach(element => {
                let x = 0;
                let y = 0;
                switch (element.align) {
                    case 'left':
                        x = -halfWidth + (0.5 * element.width);
                        break;
                    case 'right':
                        x = halfWidth - (0.5 * element.width);
                        break;
                }
                switch (element.valign) {
                    case 'top':
                        y = halfHeight - (0.5 * element.height);
                        break;
                    case 'bottom':
                        y = -halfHeight + (0.5 * element.height);
                        break;
                }
                element.mesh.position.x = x;
                element.mesh.position.y = y;
            });
        },

        addUiElement({id, width, height, color, align, valign}){
            const mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(width, height),
                new THREE.MeshBasicMaterial({color})
            );
            uiScene.add(mesh);
            uiElements[id] = {mesh, width, height, align, valign};
        },

        render(renderer) {
            renderer.clearDepth();
            renderer.render(uiScene, uiCamera);
        }
    };
}
