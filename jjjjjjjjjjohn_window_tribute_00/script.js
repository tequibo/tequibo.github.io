import * as THREE from 'three';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import {TrackballControls} from './node_modules/three/examples/jsm/controls/TrackballControls.js';
import * as dat from 'dat.gui';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';
import { Vector3 } from 'three';
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
    controls.handleResize();
}

function rr(min, max){
    return min+Math.random()*(max-min);
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
camera.position.z = 25;
camera.position.y = 0;
camera.position.x = 0;
// camera.lookAt(0,0,-10.5);

const controls = new OrbitControls(camera, renderer.domElement);
// const controls = new TrackballControls(camera, renderer.domElement);
// controls.target.set(0, 0, 0);
controls.enableDamping=true;
controls.dampingFactor=0.03;
controls.enablePan=false;
// controls.rotateSpeed = 1.0;
// controls.zoomSpeed = 2.2;
// controls.panSpeed = 0.8;
// controls.update();

const clock = new THREE.Clock();

let cubes =[];
const s_geometry = new THREE.SphereGeometry(.5,50,50);
const c_geometry = new THREE.BoxBufferGeometry(.1,.1,.1);
let color1 = new THREE.Color("red");
let color2 = new THREE.Color("cyan");
function addParticle(position, color){
    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            u_time: { value: 0 },
            u_scale: {value: .5},
        //   u_color1: new THREE.Vector3(1,1,1)
        //   uTexture: { value: texture },
        },
        transparent: true,
        // side: THREE.DoubleSide
      });
    // const black = new THREE.MeshBasicMaterial({color: color});
    const p = new THREE.Mesh(c_geometry, material);
    p.mat = material;
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

let am=18
let space=1;
let groups  = [];
for (let i = 0; i < am; i++) {
    const group = new THREE.Group();
    groups.push(group);
    scene.add(group);
}
for (let i = 0; i < am; i++) {
    for (let j = 0; j < am; j++) {
        for (let k = 0; k < am; k++) {
            if(k<9)
                continue;
            if(i<2 || i>am-3 || j<2 || j>am-3 || (k==9 && (i<3 || i>am-4 || j<3 || j>am-4))){
            let pos = new THREE.Vector3(i*space-am*space/2+space/2,j*space-am*space/2+space/2,k*space-am*space/2+space/2-5);    
            // pos.x+=rr(-11,11);
            // pos.y+=rr(-11,11);
            // pos.z+=rr(-11,11);
            let color = new THREE.Color('grey');
            let p = addParticle(pos,color);
            p.mat.color=color;
            p.pos = pos.clone();
            p.l=pos.length();
            p.x = pos.x;
            p.y = pos.y;
            p.z = pos.z;
            p.go=false;
            p.r=rr(0,.3);
            groups[k].add(p);
            }
            
        }
    }    
}
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
function onMouseMove(event) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

}
window.addEventListener('mousemove', onMouseMove, false);
let counter=1;

function animate() {
    // let t = Date.now()*0.01*settings.timescale;  
    let t = clock.getElapsedTime()*settings.timescale;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects( scene.children );

	for ( let i = 0; i < intersects.length; i ++ ) {
        let p = intersects[i].object;
        p.go=true;     
	}
    for (let i = 0; i < cubes.length; i++) {
        const p = cubes[i];
        let m =.005;
        //let s = 10;Math.abs(noise.simplex3(c.x*m+Math.sin(t*settings.rot_speed)*.2,c.y*m-t,c.z*m+Math.cos(t*settings.rot_speed)*.2))*32;
        let s = 10;//*1.1-Math.sin(p.position.z*settings.scale_mod-t)*settings.cube_size;
        p.mat.uniforms.u_time.value = t-p.position.z*settings.scale_mod+p.r;
        // p.mat.uniforms.u_scale.value = .8+(Math.sin(-t+p.position.z*settings.scale_mod+p.r))*.1;
        p.scale.set(s,s,s);
        // p.rotation.x+=rr(0,TAU/110);

        if(p.go){
            // p.mat.color.setHSL(1, .8, Math.sin(p.l+t*.1))
            // p.mat.uniforms.u_scale.value = .5+(Math.sin(t+p.position.z*settings.scale_mod+p.r))/2;

        }
        const forward = new THREE.Vector3(0,0,1);
        // p.position.applyAxisAngle(forward,Math.sin(t+p.position.z*.5)*0.001);
        // c.position.set(c.start_pos);
        
          
        
    }
    for (let i = 0; i < am; i++) {
        const group = groups[i];
        group.rotation.z = Math.sin(-t*settings.angle_speed+i*settings.angle_scale)*settings.angle_ampl;
    }
    // camera.lookAt(0,0,5.);
    requestAnimationFrame(animate);
    controls.update();
	renderer.render(scene, camera);
    // stats.update();

}

let settings = {
    timescale:1.,
    scale_mod:.1,
    angle_ampl:TAU/128,
    angle_scale:.5,
    angle_speed:3
};
let gui = new dat.GUI();

gui.add(settings, 'timescale', 0.1, 12.5)
gui.add(settings, 'scale_mod', 0.01, 2.2)
gui.add(settings, 'angle_ampl', TAU/128, TAU/4)
gui.add(settings, 'angle_scale', .1, 2)
gui.add(settings, 'angle_speed',.1, 10)


animate();

