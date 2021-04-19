
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
// import { Stats } from './node_modules/three/examples/jsm/libs/stats.module.js'; 
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js'; 
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// container = document.createElement( 'div' );
// document.body.appendChild( container );

let container, stats;
// stats = new Stats();
// container.appendChild( stats.dom );
const scene = new THREE.Scene();
scene.background = new THREE.Color(0,0,0);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.y = 140;
camera.position.z = 140;
camera.lookAt(0,0,0);
const p_light = new THREE.PointLight(0x00ffff, 2, 200);
const p_light2 = new THREE.PointLight(0xff0000, 2, 200);
const a_light = new THREE.AmbientLight(0xffffff,1);;
p_light.position.set(-30, 20, 20);
p_light2.position.set(30, 20, 20);
// scene.add(p_light);
// scene.add(p_light2);
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xff00ff, 1 );
// hemiLight.color.setHSL( 0.6, 1, 0.6 );
// hemiLight.groundColor.setHSL( 0.195, 1, 0.75 );
hemiLight.position.set( 0, 50, 0 );
scene.add( a_light );

const rectLight1 = new THREE.DirectionalLight( 0xff0000, 1 );
rectLight1.position.set( -30 , 0, 0 );
rectLight1.lookAt(0,0,0);

// scene.add(rectLight1);
const rectLight2 = new THREE.DirectionalLight( 0x00ffff, 2 );
rectLight2.position.set( 30 , 0, 0 );
rectLight2.lookAt(0,0,0);
// scene.add(rectLight2);
// geoFloor.position.set( 0 , 0, 0 );
// const matStdFloor = new THREE.MeshStandardMaterial( { color: 0x808080, roughness: 0.1, metalness: 0 } );
// const mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
// scene.add( mshStdFloor );
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

let cubes =[];
const geometry = new THREE.SphereGeometry(1,20,20);
// const geometry = new THREE.BoxGeometry();        


function addParticle(){
    let c;
    if(Math.random()>.5){
        c = new THREE.Color(0x00ffff);
    }
    else{
        c = new THREE.Color(0xff0000);
        
    }
    const material = new THREE.MeshBasicMaterial( { color: c } );  
// material.flatShading=true;
    const cube = new THREE.Mesh(geometry, material);
    cube.life=1;
    cube.rotateX(rr(-TAU,TAU));
    cube.rotateY(rr(-TAU,TAU));
    cube.rotateZ(rr(-TAU,TAU));
    cube.lifedecay=.001+Math.random()*.005;
    cube.userData.velocity=new THREE.Vector3(Math.random()-.5,Math.random()-.5,Math.random()-.5);
    // cube.rotation.z = Math.random()*TAU;
    // cube.rotation.x = Math.random()*TAU;
    // cube.rotation.y = Math.random()*TAU;
    cube.scale.y = cube.scale.x=cube.scale.z=1;
    cube.seed = Math.random();
    cubes.push(cube)
    scene.add(cube);
}

// scene.add(a_light);
let counter=0;
function animate() {
	requestAnimationFrame(animate);
    let t = Date.now()*0.01
    if(counter<1100){
        addParticle();
        counter++;
    }
    for (let i = 0; i < cubes.length; i++) {
        const c = cubes[i];
        if(c.life>0){
        c.scale.y = c.scale.x=c.scale.z=c.life*5+1.5+Math.sin(t*4*c.seed+c.seed)*1.5;
        c.position.add(c.userData.velocity);
        c.userData.velocity.multiplyScalar(.99);
        c.life-=c.lifedecay;
        if(Math.random()>.9){
            var s = .5;
            c.userData.velocity.add(new THREE.Vector3(rr(-s,s),rr(-s,s),rr(-s,s)));
        }
    }
    else{
            // c.dispose();
            // cubes.splice(i,1);
            c.life=1;
            c.position.set(0,0,0);
            c.userData.velocity.set(Math.random()-.5,Math.random()-.5,Math.random()-.5);
        }
        // c.rotation.x += 0.102221;
        // console.log(c.offset);
    }
    counter++;
    // controls.update();
	renderer.render( scene, camera );
    // stats.update();
}
animate();
function rr(min, max){
    return min+Math.random()*(max-min);
}