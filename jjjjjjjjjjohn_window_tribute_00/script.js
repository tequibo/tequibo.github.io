import * as THREE from 'three';
import 'regenerator-runtime/runtime'
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import {GifWriter} from './omggif.js'

import * as dat from 'dat.gui';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';

function generateGIF( element, renderFunction, duration = 1, fps = 30 ) {

    const frames = duration * fps;

    const canvas = document.createElement( 'canvas' );
    canvas.width = element.width;
    canvas.height = element.height;

    const context = canvas.getContext( '2d' );

    const buffer = new Uint8Array( canvas.width * canvas.height * frames * 5 );
    const pixels = new Uint8Array( canvas.width * canvas.height );
    const writer = new GifWriter( buffer, canvas.width, canvas.height, { loop: 0 } );

    let current = 1;

    return new Promise( async function addFrame( resolve ) {

        renderFunction( current / frames );

        context.drawImage( element, 0, 0 );

        const data = context.getImageData( 0, 0, canvas.width, canvas.height ).data;

        const palette = [];

        for ( var j = 0, k = 0, jl = data.length; j < jl; j += 4, k ++ ) {

            const r = Math.floor( data[ j + 0 ] * 0.1 ) * 10;
            const g = Math.floor( data[ j + 1 ] * 0.1 ) * 10;
            const b = Math.floor( data[ j + 2 ] * 0.1 ) * 10;
            const color = r << 16 | g << 8 | b << 0;

            const index = palette.indexOf( color );

            if ( index === -1 ) {

                pixels[ k ] = palette.length;
                palette.push( color );

            } else {

                pixels[ k ] = index;

            }

        }

        // Force palette to be power of 2

        let powof2 = 1;
        while ( powof2 < palette.length ) powof2 <<= 1;
        palette.length = powof2;


        const delay = 100 / fps; // Delay in hundredths of a sec (100 = 1s)
        const options = { palette: new Uint32Array( palette ), delay: delay };
        writer.addFrame( 0, 0, canvas.width, canvas.height, pixels, options );

        current ++;

        progress.value = current / frames;

        if ( current < frames ) {

            await setTimeout( addFrame, 0, resolve );

        } else {

            resolve( buffer.subarray( 0, writer.end() ) );

        }

    } );
    

}
const canvas = document.getElementById( 'canvas' );
const button = document.getElementById( 'button' );
const progress = document.getElementById( 'progress' );

button.addEventListener( 'click', async function () {

    button.style.display = 'none';
    progress.style.display = '';

    // Generate

    const buffer = await generateGIF( canvas, render, 3.3, 50 );

    button.style.display = '';
    progress.style.display = 'none';

    // Download

    const blob = new Blob( [ buffer ], { type: 'image/gif' } );

    const link = document.createElement( 'a' );
    link.href = URL.createObjectURL( blob );
    link.download = 'animation.gif';
    link.dispatchEvent( new MouseEvent( 'click' ) );

} );

const TAU = 6.283185;

window.addEventListener("resize", resize);
let w = window.innerWidth;
let h = window.innerHeight;
function resize() {
    // w = window.innerWidth;
    // h = window.innerHeight;  
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
}

function rr(min, max){
    return min+Math.random()*(max-min);
}

const renderer = new THREE.WebGLRenderer({ antialias: true,canvas: canvas });
renderer.setSize(w, h);
renderer.setPixelRatio( window.devicePixelRatio );
// document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(95, window.innerWidth/window.innerHeight, 0.1, 10000);
camera.position.z = 17;
camera.position.y = 0;
camera.position.x = 0;
            resize()    
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping=true;
controls.dampingFactor=0.03;
controls.enablePan=false;
controls.zoomSpeed=.1;


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
        },
      });
    const p = new THREE.Mesh(c_geometry, material);
    p.mat = material;
    p.position.z=position.z;
    p.position.x=position.x;
    p.position.y=position.y;
    p.target_pos = new THREE.Vector3(0,1,0);//p.position;
    p.start_pos = new THREE.Vector3(0,1,0);//p.position;
    p.scale.set(10,10,10);

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
            let color = new THREE.Color('grey');
            let p = addParticle(pos,color);
            p.r=rr(0,.2);
            p.mat.uniforms.u_scale.value = (k-9)/9;
            // p.mat.uniforms.u_scale.value = rr(0,1);
            
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
const element = document.getElementById("p1");
function animate(time) {
    element.innerHTML = clock.getElapsedTime();
    if (progress.style.display === 'none') {
        render((clock.getElapsedTime()*settings.angle_speed)%1);
    }
    requestAnimationFrame(animate);
    controls.update();
    
}
function render(progress){
    let t = clock.getElapsedTime();
    t=progress
    for (let i = 0; i < cubes.length; i++) {
        const p = cubes[i];
        p.mat.uniforms.u_time.value = t*2-p.position.z*settings.scale_mod;
        p.mat.uniforms.u_scale.value = .5+Math.sin(t*TAU-p.position.z*settings.scale_mod)*.5;
        
    }
    for (let i = 0; i < am; i++) {
        const group = groups[i];
        let scale=.06;
        let offset = i*scale;
        if((t+offset)%1<.5){
            group.rotation.z = easeCubicInOut(((t+offset)*2)%1)*TAU/4;
            
        }
         if((t+i*scale)%1>.5){
            group.rotation.z = -easeCubicInOut(((t+offset-0.5)*2)%1)*TAU/4+TAU/4;


         }
        // sign=-1;
        // group.rotation.z = Math.sin(-t*settings.angle_speed+i*settings.angle_scale)*settings.angle_ampl;
    }
    renderer.render(scene, camera);
}
function easeCubicInOut(t) {
    t = t * 2.0; if (t < 1.0) return 0.5 * t * t * t;
    return 0.5 * ((t -= 2.0) * t * t + 2.0);
}
let settings = {
    timescale:1.,
    scale_mod:.1,
    angle_ampl:TAU/128,
    angle_scale:.05,
    angle_speed:.25
};
// let gui = new dat.GUI();

// gui.add(settings, 'timescale', 0.1, 12.5)
// gui.add(settings, 'scale_mod', 0.01, 2.2)
// gui.add(settings, 'angle_ampl', TAU/128, TAU/4)
// gui.add(settings, 'angle_scale', .01, .2).step(.01)
// gui.add(settings, 'angle_speed',.1, 10)


animate();
