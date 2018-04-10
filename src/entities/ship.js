import * as THREE from 'three';
import p2 from 'p2';

const SHIP_RAD = 0.25;

const ship_plan = {
    body: {
        geom: (() => {
            const geom = new THREE.Geometry();
            geom.vertices.push(
                new THREE.Vector3(-0.5 * SHIP_RAD,  0, -0.5 * SHIP_RAD), // 0) left corner
                new THREE.Vector3( 0,               0,  0.5 * SHIP_RAD), // 1) tip
                new THREE.Vector3( 0,               0, -0.3 * SHIP_RAD), // 2) aft-of-tip
                new THREE.Vector3( 0.5 * SHIP_RAD,  0, -0.5 * SHIP_RAD)  // 3) right corner
            );
            geom.faces.push(new THREE.Face3( 0, 1, 2 ));
            geom.faces.push(new THREE.Face3( 1, 3, 2 ));

            geom.computeBoundingBox();

            return geom;
        })(),
        // mat: new THREE.MeshLambertMaterial({ color: 0xaaaaaa })
        mat: (() => {
            const mat = new THREE.MeshBasicMaterial();
            mat.wireframe = true;
            return mat;
        })()
    }
};

function objToGeometry(node) {
    let newObj;

    if (node.hasOwnProperty('geom')) {
        // if the head has both a geom and mat attribute, it's a mesh
        newObj = new THREE.Mesh(node.geom, node.mat || new THREE.MeshLambertMaterial({ color: 0xff0000 }));

        if (node.hasOwnProperty('position')) {
            Object.assign(newObj.position, node.position);
        }
    }
    else {
        // otherwise, it's a group into which we must recurse
        // create a group with the contents being the elements in the array
        newObj = new THREE.Group();

        // if node's an array, we just add each element to the group
        if (Array.isArray(node)) {
            node.forEach((cur) => {
                newObj.add(objToGeometry(cur));
            });
        }
        else {
            // we create subgroups for each key so that we can name them
            Object.entries(node).forEach(([n,v]) => {
                // create a series of named groups
                const innerGroup = new THREE.Group();
                innerGroup.name = n;
                innerGroup.add(objToGeometry(v));
                newObj.add(innerGroup);
            });
        }
    }

    // post-creation transforms

    if (node.hasOwnProperty('position')) {
        // noinspection JSUnresolvedVariable
        Object.assign(newObj.position, node.position);
    }
    if (node.hasOwnProperty('scale')) {
        // noinspection JSUnresolvedVariable
        Object.assign(newObj.scale, node.scale);
    }

    return newObj;
}

export function makeShip() {
    const ship = new THREE.Object3D();
    ship.name = 'player';

    // traverse the ship geometry definition and create groups + geometries as needed
    // ship.add(new THREE.Mesh(ship_plan.geom, ship_plan.mat));
    ship.add(objToGeometry(ship_plan));


    // Create an empty dynamic body
    const shipBody = new p2.Body({
        mass: 5,
        angle: Math.PI,
        position: [0, 0]
    });
    // shipBody.fromPolygon(ship_plan.body.geom.vertices.map((p) => [p.x, p.z]), true, false);
    shipBody.addShape(new p2.Circle({ radius: 1 }));

    return {
        object: ship,
        body: shipBody
    };
}
