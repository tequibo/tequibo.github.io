
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
scene.background = new THREE.Color(1,1,1);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.y = 40;
camera.position.z = 40;
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
const geoFloor = new THREE.BoxGeometry( 120, 2.1, 120 );
// geoFloor.position.set( 0 , 0, 0 );
// const matStdFloor = new THREE.MeshStandardMaterial( { color: 0x808080, roughness: 0.1, metalness: 0 } );
// const mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
// scene.add( mshStdFloor );
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// const am=20;
const am2=10;
let cubes =[];
const geometry = new THREE.SphereGeometry(1,10,10);

let offset=0;
for (let j = 0; j < am2; j++) {
    let am=1+j*4;
    for (let i = 0; i < am; i++) {
        offset=i/am*TAU*4;//+j/am2*TAU*2;
        // const geometry = new THREE.BoxGeometry();
        // const material = new THREE.MeshBasicMaterial( { color: 0xffffff*Math.random() } );   
        // const geometry = new THREE.ConeGeometry(.3,Math.random()*2);
        let c;
        if(i%2==0){
            c = new THREE.Color(0x00ffff);
        }
        else{
            c = new THREE.Color(0x000000);
            
        }
        // const material = new THREE.MeshPhongMaterial( { color: c, shininess:200 } ); 
        // const material = new THREE.MeshBasicMaterial( { color: c } );  
        const material = new THREE.MeshPhysicalMaterial( { color: c, roughness: 1.1, metalness: 0 } );

        // material.flatShading=true;
        const cube = new THREE.Mesh(geometry, material);
        cube.offset = offset;//i/am*TAU*4;
        cube.s=j/am2;
        // cube.position.x=Math.cos(i/am*TAU)*(j/am2*20);//*(j/am2*20+3);//Math.random()*10-5;
        // cube.position.z=Math.sin(i/am*TAU)*(j/am2*20);//Math.random()*10-5;
        let sc=30;
        cube.position.y=sc/2-j/am2*sc;//Math.random()*10-5;
        // cube.rotation.z = Math.random()*TAU;
        // cube.rotation.x = Math.random()*TAU;
        // cube.rotation.y = Math.random()*TAU;
        cube.scale.y = cube.scale.x=cube.scale.z=noise.simplex2(i,i*2)*10;//c.s*3.5+Math.sin(t*21+c.offset)*1.5;

        cubes.push(cube)
        scene.add(cube);
    }
}


// scene.add(a_light);
function animate() {
	requestAnimationFrame(animate);
    let t = Date.now()*1
    // light.position.x = Math.cos(t*TAU)*5;
    // light.position.z = Math.sin(t*TAU)*5;
    for (let i = 0; i < cubes.length; i++) {
        const c = cubes[i];
        c.position.x+=noise.simplex2(c.position.x+t,c.position.z+i);
        c.position.y+=noise.simplex2(c.position.y+t,c.position.z+i);
        c.position.z+=noise.simplex2(c.position.y+t,c.position.z+i);
        // c.rotation.x += 0.102221;
        // c.scale.y = c.scale.x=c.scale.z=noise.simplex2(c.position.x+t,c.position.y);//c.s*3.5+Math.sin(t*21+c.offset)*1.5;
        // console.log(i);
    }
    // controls.update();
	renderer.render( scene, camera );
    // stats.update();
}
animate();