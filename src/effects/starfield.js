import * as THREE from "three";

function crandom() {
    return Math.random()*2 - 1;
}

export function makeStarfield(density=40, spread=5) {
    const starGroup = new THREE.Object3D();

    // we probably need a list to track star objects
    Array.from({ length: density }).forEach(_ => {
        const obj = new THREE.Object3D();
        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(1),
            new THREE.MeshBasicMaterial( {color: 0xffffff} )
        );
        obj.add(sphere);
        obj.scale.set(0.01, 0.01, 0.01);
        obj.position.set(crandom() * spread, -1, crandom() * spread);

        /*
        sphere.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
            // obj.position.setX(obj.position.x += Math.random() * 0.1);
            // obj.position.setZ(obj.position.z += Math.random() * 0.05);

            if (obj.position.x > camera.position.x + camera.right) {
                obj.position.x = camera.left + camera.position.x;
            }
            else if (obj.position.x < camera.position.x + camera.left) {
                obj.position.x = camera.right + camera.position.x;
            }

            if (obj.position.z > camera.position.z + camera.top) {
                obj.position.z = camera.bottom + camera.position.z;
            }
            else if (obj.position.z < camera.position.z + camera.bottom) {
                obj.position.z = camera.top + camera.position.z;
            }
        };
        */

        starGroup.add(obj);
    });

    return starGroup;
}
