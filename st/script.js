// Option 1: Import the entire three.js core library.
import * as THREE from './node_modules/three/build/three.module.js';
// import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';

const TAU = 6.283185;

window.addEventListener("resize", resize);
let w = window.innerWidth;
let h = window.innerHeight;
function resize() {
    w = window.innerWidth;
    h = window.innerHeight;  
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
}
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 2000);
camera.position.z = 100;
camera.position.y = 100;
camera.position.x = -100;
camera.lookAt(0,0,0);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(0, 0, 0);
// controls.update();
const s_geometry = new THREE.SphereGeometry(11.5,50,50);
const c_geometry = new THREE.BoxGeometry(11,11,11);
const black = new THREE.MeshBasicMaterial({color: 0xff0000});

let cubes = [];
let am = 101;
for (let i = 0; i < cubes.length; i++) {
    // const element = cubes[i];    
    const p = new THREE.Mesh(c_geometry, black);
    // p.position.set
}
scene.add(p);
function animate() {
	requestAnimationFrame(animate);
    let t = Date.now()*0.01;  

    
	renderer.render(scene, camera);
}
animate();