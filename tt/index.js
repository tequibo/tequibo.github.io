// Option 1: Import the entire three.js core library.
import * as THREE from 'three';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
var SimplexNoise = require('simplex-noise');
const simplex = new SimplexNoise(Math.random);
// let value2d = simplex.noise2D(x, y);

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
camera.position.x = 0;
camera.lookAt(0,0,0);
const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(0, 0, 0);
// controls.update();
const s_geometry = new THREE.SphereGeometry(11.5,50,50);
const c_geometry = new THREE.BoxGeometry(21,1,21);
let cubes = [];
let am = 21;
for (let i = 0; i < am; i++) {
    const black = new THREE.MeshBasicMaterial({color: 0xff0000});
    black.color.setHSL((1+simplex.noise2D(0,i*.05))*.5,1,i/am);
    // console.log((1+simplex.noise2D(0,i*.0001))*.5)
    // const element = cubes[i];    
    const p = new THREE.Mesh(c_geometry, black);
    p.scale.setScalar(1-i/am)
    p.position.set(0,i*2.,0);
    let y=i*.001;
    // p.rotation.x=simplex.noise2D(0,y)*TAU;
    p.rotation.y=simplex.noise2D(1,y)*TAU;
    // p.rotation.z=simplex.noise2D(2,y)*TAU;    
    scene.add(p);
}
function animate() {
	requestAnimationFrame(animate);
    let t = Date.now()*0.01;  

    
	renderer.render(scene, camera);
}
animate();