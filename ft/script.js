
const TAU = 6.283185;
let w = window.innerWidth;
let h = window.innerHeight;
window.addEventListener("resize", resize);
function resize() {
    w = window.innerWidth;
    h = window.innerHeight;  
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
import * as THREE from './three.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js'; 
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(1,1,1);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.y = 40;
camera.position.z = 40;
camera.lookAt(0,0,0);

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set(0, 0, 0);
controls.update();

// const am=20;
const am2=10;
let cubes =[];
const geometry = new THREE.SphereGeometry(1,101,101);
let offset=0;
for (let j = 0; j < am2; j++) {
    let am=8+j*6;
    for (let i = 0; i < am; i++) {
        offset=i/am*TAU*2+j/am2*TAU;
        // const geometry = new THREE.BoxGeometry();
        // const material = new THREE.MeshBasicMaterial( { color: 0xffffff*Math.random() } );   
        // const geometry = new THREE.ConeGeometry(.3,Math.random()*2);
        let c;
        if(i%2==0){
            c = new THREE.Color(0,0,0);
        }
        else{
            c = new THREE.Color(1,1,1);

        }
        const material = new THREE.MeshPhongMaterial( { color: c, shininess:200 } ); 
        // const material = new THREE.MeshBasicMaterial( { color: c } );   
        // material.flatShading=true;
        const cube = new THREE.Mesh(geometry, material);
        cube.offset = offset;//i/am*TAU*4;
        cube.position.x=Math.cos(i/am*TAU)*(j/am2*20+3);//Math.random()*10-5;
        cube.position.z=Math.sin(i/am*TAU)*(j/am2*20+3);//Math.random()*10-5;
        cube.position.y=-j*2;//Math.random()*10-5;
        // cube.rotation.z = Math.random()*TAU;
        // cube.rotation.x = Math.random()*TAU;
        // cube.rotation.y = Math.random()*TAU;
        cubes.push(cube)
        scene.add(cube);
    }
}

const p_light = new THREE.PointLight(0x00ffff, 2, 200);
const p_light2 = new THREE.PointLight(0xff0000, 2, 200);
const a_light = new THREE.AmbientLight(0x404040,1);;
p_light.position.set(-30, 20, 20);
p_light2.position.set(30, 20, 20);
scene.add(p_light);
scene.add(p_light2);
// scene.add(a_light);
function animate() {
	requestAnimationFrame(animate);
    let t = Date.now()*.0001
    // light.position.x = Math.cos(t*TAU)*5;
    // light.position.z = Math.sin(t*TAU)*5;
    for (let i = 0; i < cubes.length; i++) {
        const c = cubes[i];
        
        // c.rotation.x += 0.102221;
        c.scale.y = c.scale.x=c.scale.z=(1.5+Math.sin(t*21+c.offset)*1.5);
        console.log(i);
    }
    // controls.update();
	renderer.render( scene, camera );
}
animate();