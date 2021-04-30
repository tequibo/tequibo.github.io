import * as THREE from './three.module.js';
// import { OrbitControls } from '/OrbitControls.js';

const TAU = 6.283185;

window.addEventListener("resize", resize);
let w = window.innerWidth-30;
let h = 500;//window.innerHeight;
function resize() {
    w = window.innerWidth-30;
    h = window.innerWidth-30;//window.innerHeight;  
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
}

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);



const scene = new THREE.Scene();
scene.background = new THREE.Color(0,1,1);

const camera = new THREE.PerspectiveCamera(95, w/h, 0.1, 2000);
camera.position.y = 0;
camera.position.z = 20;
camera.lookAt(0,0,0);



const dir_light1 = new THREE.DirectionalLight( 0xffffff, 1 );
dir_light1.position.set( 1, 1, 1 ).normalize();
dir_light1.lookAt(0,0,0);
const dir_light2= new THREE.DirectionalLight( 0xffff00, .5 );
dir_light2.position.set( -1, 1, 1 ).normalize();
dir_light2.lookAt(0,0,0);
const dir_light3= new THREE.DirectionalLight( 0xffffff, 1. );
dir_light3.position.set( 0, 0, -1 ).normalize();
dir_light3.lookAt(0,0,0);
scene.add(dir_light1);
scene.add(dir_light2);
scene.add(dir_light3);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(0, 0, 0);
// controls.update();

let cubes =[];
const s_geometry = new THREE.SphereGeometry(.5,50,50);
const c_geometry = new THREE.BoxGeometry();
const mat1=new THREE.MeshBasicMaterial({color: 0x00})
const mat2=new THREE.MeshBasicMaterial({color: 0xffffff})
const diffuseColor = new THREE.Color().setHSL( 1, 0.5, 0.25 );
const material3 = new THREE.MeshPhysicalMaterial( {
    color: 0xff0000,
    metalness: 0,
    roughness: .5,
    clearcoat: 1.0,
    clearcoatRoughness: 0 

} );
const material4 = new THREE.MeshPhysicalMaterial( {
    color: 0x00ffff,
    metalness: 0,
    roughness: .5,
    clearcoat: 1.0,
    clearcoatRoughness: 0 
} );

function addParticle(){
    let mat = Math.random()>.5?mat1:mat2;
    const cube = new THREE.Mesh(c_geometry, mat);
    // const cube2 = new THREE.Mesh(s_geometry, mat);
    cube.life=1;
    cube.lifedecay=rr(.0005,.005);
    cube.scale.y = cube.scale.x=cube.scale.z=0;
    cube.userData.velocity=new THREE.Vector3();
    cube.userData.s_velocity=new THREE.Vector3(.1,.1,.1);
    let rs = .01;
    cube.userData.r_velocity=new THREE.Vector3(rr(-rs,rs),rr(-rs,rs),rr(-rs,rs));

    cube.seed = Math.random();
    cubes.push(cube)
    scene.add(cube);
    // cube2.position.set(1,0,0);
    // cube.add(cube2);
}

// scene.add(a_light);
let counter=0;
function animate() {
	requestAnimationFrame(animate);
    let t = Date.now()*0.01;
    if(counter<1100 &&rr(0,1)>.92){
        addParticle();
        counter++;
    }
    // stats.begin();
    for (let i = 0; i < cubes.length; i++) {
        const c = cubes[i];
        if(c.life>-1110){
        // c.scale.y = c.scale.x=c.scale.z=c.life*5+1.5+Math.sin(t*4*c.seed+c.seed)*1.5;
        c.position.add(c.userData.velocity);
        c.scale.add(c.userData.s_velocity);
        // c.rotation.add(c.userData.r_velocity);
        c.userData.velocity.multiplyScalar(.95);
        c.userData.s_velocity.multiplyScalar(.95);
        c.userData.r_velocity.multiplyScalar(.95);
        // c.rotateX(c.userData.r_velocity.x);
        // c.rotateY(c.userData.r_velocity.y);
        // c.rotateZ(c.userData.r_velocity.z);
        c.life-=c.lifedecay;
        if(Math.random()>.99){
            var s = .1;
            let r = rr(0,.99);
            if(r>.66){
                c.userData.velocity.add(new THREE.Vector3(rr(-s,s),0,0));
            }
            else if(r>.33){
                c.userData.velocity.add(new THREE.Vector3(0,rr(-s,s),0));
            }
            else {
                c.userData.velocity.add(new THREE.Vector3(0,0,rr(-s,s)));
            }
        }
    }
    else{
            // c.dispose();
            // cubes.splice(i,1);
            c.life=1;
            c.position.set(0,0,0);
            c.scale.set(0,0,0);
            c.userData.velocity.set(0,0,0);
            c.userData.s_velocity.set(0,0,0);
        }
    }
    counter++;
    // controls.update();
	renderer.render( scene, camera );
    // stats.update();
    // stats.end();
}


animate();
function rr(min, max){
    return min+Math.random()*(max-min);
}