import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';
// import * as dat from 'dat.gui';

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

// var stats = new Stats();
// stats.showPanel(1);
// document.body.appendChild(stats.dom)

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 10000);
camera.position.z = 40;
camera.position.y = 40;
camera.position.x = 40;
camera.lookAt(0,0,0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping=true;
controls.dampingFactor=0.06;
controls.enablePan=false;
controls.update();
let cubes =[];
const s_geometry = new THREE.SphereGeometry(.5,50,50);
const c_geometry = new THREE.BoxGeometry(.1,.1,.1);

function addParticle(position, color){
    const black = new THREE.MeshBasicMaterial({color: color});
    const p = new THREE.Mesh(c_geometry, black);
    p.mat = black;
    // p.castShadow = p.receiveShadow = true;
    p.position.z=position.z;
    p.position.x=position.x;
    p.position.y=position.y;
    p.target_pos = new THREE.Vector3(0,1,0);//p.position;
    p.start_pos = new THREE.Vector3(0,1,0);//p.position;
    const up = new THREE.Vector3(0,1,0);
    // p.target_pos.applyAxisAngle(up,TAU/4);
    cubes.push(p)
    scene.add(p);
    return p;
}

let am=8
let space=2;
for (let i = 0; i < am; i++) {
    for (let j = 0; j < am; j++) {
        for (let k = 0; k < am; k++) {
            let pos = new THREE.Vector3(i*space-am*space/2+space/2,j*space-am*space/2+space/2,k*space-am*space/2+space/2);    
            // pos.x+=rr(-11,11);
            // pos.y+=rr(-11,11);
            // pos.z+=rr(-11,11);
            let color = new THREE.Color().setHSL(.4, .7, 1-pos.length()*.007);
            let p = addParticle(pos,color);
            p.pos = pos.clone();
            p.l=pos.length();
            p.x = pos.x;
            p.y = pos.y;
            p.z = pos.z;
            p.sc = new THREE.Vector3();
            p.sc.random();
            // p.rotation.z=rr(0,TAU);
            // p.rotation.x=rr(0,TAU);
            // p.rotation.y=rr(0,TAU);//noise.simplex3(c.x,c.y*m,c.z)*TAU;
        }
    }    
}

let counter=1;
let color1 = new THREE.Color("red");
let color2 = new THREE.Color("cyan");

function animate() {
	requestAnimationFrame(animate);
    let t = Date.now()*0.01*settings.timescale;  

    for (let i = 0; i < cubes.length; i++) {
        const c = cubes[i];
        let m =.005;
        //let s = 10;Math.abs(noise.simplex3(c.x*m+Math.sin(t*settings.rot_speed)*.2,c.y*m-t,c.z*m+Math.cos(t*settings.rot_speed)*.2))*32;
        let s = settings.cube_size*1.1-Math.sin(c.l*settings.scale_mod-t)*settings.cube_size;
        // let s = EasingFunctions.easeOutQuad((c.l*settings.scale_mod-t)%1)*settings.cube_size;
        // s=Math.abs(s);
        // c.scale.set(1+s*c.sc.x,1+s*c.sc.y,1+s*c.sc.z)
        c.mat.color.setHSL(.3+Math.sin(c.l*settings.scale_mod-t)*.3, .8, .6)
        c.mat.color.setHSL(t*.1, .8, .3+Math.sin(c.l*settings.scale_mod-t)*.3)
        // let temp_color = new THREE.Color(color1);
        // temp_color.lerpHSL(color1,color2,.5+Math.sin((1-c.l)*settings.scale_mod-t)*.5)
        // c.mat.color = temp_color;
        c.scale.set(s,s,s);
        const up = new THREE.Vector3(0,1,0);
        // c.position.applyAxisAngle(up,0.01);
        // c.position.set(c.start_pos);
        
        // c.userData.velocity.multiplyScalar(.98);   

    }
    controls.update();
	renderer.render(scene, camera);
    // stats.update();

}

let settings = {timescale:.2,scale_mod:.3,cube_size:10., color:new THREE.Color()};
// let gui = new dat.GUI();

// gui.add(settings, 'timescale', 0.1, 1.5)
// gui.add(settings, 'scale_mod', 0.01, 1.2)
// gui.add(settings, 'cube_size', 1, 20)


animate();

