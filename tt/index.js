// Option 1: Import the entire three.js core library.
import * as THREE from 'three';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { Color } from 'three';
// import * as SimplexNoise from 'simplex-noise';
var SimplexNoise = require('simplex-noise');
 
const gui = new dat.GUI();
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
scene.background = new THREE.Color(0x24001d);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 4000);
camera.position.z = 530;
camera.position.y = 0;
camera.position.x = 0;
camera.lookAt(0,0,0);
const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(0, 0, 0);
// controls.update();
const s_geometry = new THREE.SphereGeometry(1.,1,1);
const c_geometry = new THREE.BoxGeometry(1,1,1);
let tentacles = [];
let am = 25;
let am2 = 25;
for (let j = 0; j < am2; j++) {
    let particles = [];
    for (let i = 0; i < am; i++) {
        const black = new THREE.MeshBasicMaterial({color: 0xff0000});
        // black.color.setHSL(j/am2,.95,.51);
        const p = new THREE.Mesh(c_geometry, black);
        p.mat=black;
        particles.push(p);
        // p.rotation.x=simplex.noise2D(0,y)*TAU;
        // p.rotation.y=simplex.noise2D(1,y)*TAU;
        scene.add(p);
    }
    tentacles.push(particles);
}
let sett={
    timescale:1,
    scale1:1,
    scale2:1,
    angle:1
}
gui.add(sett, 'timescale', 0.1, 1.5)
gui.add(sett, 'scale1', 0.01, 11.5)
gui.add(sett, 'scale2', 0.1, 11.5)
gui.add(sett, 'angle', 0.1, 1.5)
const color1 = new Color(0xFF1E00);
const color2 = new Color(0xFF8E00);
function animate() {
	requestAnimationFrame(animate);
    let t = Date.now()*0.0001*sett.timescale;  
    for (let j = 0; j < am2; j++) {

        let pos = new THREE.Vector3(0,0,0);
        let dir = new THREE.Vector3(0,10,0);
        let ax = new THREE.Vector3(0,1,0);
        let w =0.1+t+j*.01*sett.scale1*(2+Math.sin(t*50)*.1);
        let particles=tentacles[j];
        for (let i = 0; i < am; i++) {
            var p = particles[i];
            
            w+=.01*sett.scale2;
            let c = new Color(color1);
            c.lerpHSL(color2, j/am2);
            // p.mat.color.setHSL(0.+j/am2*.1,.5+i/am*.5,.1+j/am2*.7);
            // p.mat.color.lerpColors(color1, color2,j/am2);
            p.mat.color=c;
            // p.scale.x=10-simplex.noise2D(0,w*10)*10
            // p.scale.z=5-simplex.noise2D(0,w*10)*5
            // p.scale.setScalar(10-simplex.noise2D(0,w*15)*10);
            let s = .005;
            p.scale.x=25-simplex.noise3D(p.position.x*s,p.position.y*s-t*12.2,p.position.z*s)*25;
            p.scale.y=25-simplex.noise3D(p.position.x*s,p.position.y*s-t*12.2,p.position.z*s)*25;
            p.scale.setScalar(25-simplex.noise3D(p.position.x*s,p.position.y*s-t*12.2,p.position.z*s)*25);
        // p.black.color.setHSL((1+simplex.noise2D(0,i*.05))*.5,1,i/am);
            let f=i/am;
            ax.x=simplex.noise2D(0,w);
            ax.y=simplex.noise2D(1,w);
            ax.z=simplex.noise2D(2,w);
            dir.applyAxisAngle(ax, simplex.noise2D(3,w*.1)*TAU*.05*sett.angle)
            let pos_l = pos.clone();
            pos_l.sub(dir);
            p.lookAt(pos_l)
            pos.add(dir);
            
            p.position.set(pos.x,pos.y,pos.z);
            // p.rotateOnAxis(new THREE.Vector3(0,0,1), simplex.noise2D(3,w*.001)*TAU*.01);
            // p.position.set(0,f*50,0);
            }
    }
	renderer.render(scene, camera);
}
animate();