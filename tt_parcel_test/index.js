// Option 1: Import the entire three.js core library.
import * as THREE from 'three';
// import CCapture from 'ccapture.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import { Color, OrthographicCamera, Vector3 } from 'three';
// import * as SimplexNoise from 'simplex-noise';
var SimplexNoise = require('simplex-noise');
 
const gui = new dat.GUI();
const simplex = new SimplexNoise(Math.random);
const TAU = 6.283185;

let w = window.innerWidth;
let h = window.innerHeight;
function resize() {
    w = window.innerWidth;
    h = window.innerHeight;  
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
}
window.addEventListener("resize", resize);

const renderer = new THREE.WebGLRenderer({ antialias: true });
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

 const camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 4000);
const camera_o = new OrthographicCamera(w / - 2, w / 2, h / 2, h / - 2, 1, 1000 );
camera.position.z = 5;
camera.position.y = 0;
camera.position.x = 0;
camera.lookAt(0,0,0);
scene.add(camera)
resize();

function rr(min, max){
    return min+Math.random()*(max-min);
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping=true;
controls.dampingFactor=0.06;
// controls.target.set(0, 0, 0);

const s_geometry = new THREE.SphereGeometry(1.,11,11);
const c_geometry = new THREE.BoxGeometry(.1,.1,.03);
let tentacles = [];
let am = 24;
let am2 = 6;

for (let j = 0; j < am2; j++) {
    let particles = [];
    for (let i = 0; i < am; i++) {
        const black = new THREE.MeshBasicMaterial({color: 0xff0000});//,transparent: true, opacity: 0.5,side: THREE.DoubleSide,depthWrite: false,});
        // black.color.setHSL(j/am2,.95,.51);
        const p = new THREE.Mesh(c_geometry, black);
        p.mat=black;
        
        particles.push(p);
        scene.add(p);
    }
    tentacles.push(particles);
}

let sett = {
    timescale:1,
    sin_scale:1,
    sin_speed:11,
    noise_scale:8,
    distance_scaling:.4,
    particle_scaling:2,
    needle_all_scale:1,
    needle_one_scale:4,
    FOV:45
}

gui.add(sett, 'timescale', 0.1, 11.5)
gui.add(sett, 'noise_scale', 0.01, 11.5)
gui.add(sett, 'sin_scale', 0.01, 11.5)
gui.add(sett, 'sin_speed', 0.1, 111.5)
gui.add(sett, 'distance_scaling', 0.1, 1.5)
gui.add(sett, 'needle_all_scale', 0.1, 1.5)
gui.add(sett, 'needle_one_scale', 0.1, 11.5)
gui.add(sett, 'particle_scaling', 0.1, 2.5)
gui.add(sett, 'FOV', 20, 150).onChange(setFOV)
function setFOV(){
    camera.fov=sett.FOV;
    camera.updateProjectionMatrix();
}

const color1 = new Color("black");
const color2 = new Color("cyan");
const color3 = new Color("red");
const directions = [
    new Vector3(0,0,1),
    new Vector3(0,0,-1),
    new Vector3(0,1,0),
    new Vector3(0,-1,0),
    new Vector3(1,0,0),
    new Vector3(-1,0,0),
]
function animate() {
    requestAnimationFrame(animate);
    let t = Date.now()*0.0001*sett.timescale;  

    for (let j = 0; j < am2; j++) {
        let start_pos = directions[j].clone();new Vector3(0,1,0);
        let pos = start_pos.clone();
        let dir = directions[j].clone();
        let ax = new Vector3(0,1,0);
        let needle =0.1+j*0.5*sett.needle_all_scale;//*(2+Math.sin(t*50)*.1);
        let particles = tentacles[j];
        dir.multiplyScalar(sett.distance_scaling*.1);

        for (let i = 0; i < am; i++) {
            var p = particles[i];
            w=needle+t+i*.01*sett.sin_scale+Math.sin(t*10*simplex.noise2D(needle,1))*.025*simplex.noise2D(needle,1);
            //w=w%10;
            let c = new Color(color1);
            c.lerpHSL(color2, simplex.noise2D(w,1));
            p.mat.color.setHSL(j/am2*.2+t,.0,i/am);//(2-simplex.noise2D(w*100,1))*.5*.4);
            // p.mat.color.lerpColors(color1, color3,i/am);
            // if(i%2==0)
            // p.mat.color.lerpColors(color1, color2,i/am);
            // p.mat.color=c;            
            let s = 0.03*sett.noise_scale;
            let new_scale = 25*sett.particle_scaling-simplex.noise3D(p.position.x*s,p.position.y*s,p.position.z*s+t*10)*25*sett.particle_scaling;
            let f=1-i/am;
            p.scale.x=p.scale.y = f*10*sett.particle_scaling;+Math.abs(Math.sin(t*sett.sin_speed+i/am)*5);
            // p.scale.setScalar(f*10*sett.particle_scaling);
            let s2=sett.distance_scaling;
            // dir.x=simplex.noise2D(0,w*sett.needle_one_scale)*s2;
            // dir.y=simplex.noise2D(12,w*sett.needle_one_scale)*s2;
            // dir.z=simplex.noise2D(23,w*sett.needle_one_scale)*s2;
            // let pos_l = pos.clone();
            // pos_l.sub(dir);
             p.lookAt(dir)
            // pos.add(dir);
            
            p.position.set(pos.x,pos.y,pos.z);
            pos.add(dir);
            // s=0.1;
            // p.rotation.x=simplex.noise3D(p.position.x*s,p.position.y*s,p.position.z*s)*TAU;
            // p.rotation.y=simplex.noise3D(p.position.x*s,p.position.y*s,p.position.z*s)*TAU;
            // p.rotation.z=simplex.noise3D(p.position.x*s,p.position.y*s,p.position.z*s)*TAU;
            //  p.rotateOnAxis(new THREE.Vector3(0,0,1), i/am*(Math.sin(i/am*2-t*10))*TAU*((i%2==0)?1:-1))*2;
            let sign = (i%2==0)?-1:1;
            p.rotateOnAxis(new THREE.Vector3(0,0,1), easeCubicInOut((i/am+t*5)%1)*TAU/4*sign);
            // p.rotateOnAxis(new THREE.Vector3(0,0,1),Math.sin((i/am*sett.sin_scale+t*sett.sin_speed))*TAU/2*sign*i/am);
            // p.rotateOnAxis(new THREE.Vector3(0,0,1), (i/am+t*15)*i/am*sign);
            // p.position.set(0,f*50,0);
            }
    }
    controls.update();
	renderer.render(scene, camera);
}
animate();
function easeCubicInOut(t) {
    t = t * 2.0; if (t < 1.0) return 0.5 * t * t * t;
    return 0.5 * ((t -= 2.0) * t * t + 2.0);
}