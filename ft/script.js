/**
 * NOTE:
 * Please read the README.md file provided in this template.
 */

// If you want to create OBJKT's with different seeds, you can access the creator and viewer wallet ids. This values will only be injected once the piece has been minted
// they will not work locally.
// if the user is not sync, the viewer comes in as false
const creator = new URLSearchParams(window.location.search).get('creator')
const viewer = new URLSearchParams(window.location.search).get('viewer')

// console.log('NFT created by', creator)
// console.log('NFT viewed by', viewer)

w = window.innerWidth;
h = window.innerHeight;

window.addEventListener("resize", resize);

function resize() {
    w = window.innerWidth;
    h = window.innerHeight;  
renderer.setSize(window.innerWidth, window.innerHeight);

}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
// const controls = new OrbitControls( camera, renderer.domElement );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
cubes =[];
for (let i = 0; i < 30; i++) {
    // const geometry = new THREE.BoxGeometry();
    const geometry = new THREE.ConeGeometry(.1,Math.random()*2);
    const material = new THREE.MeshBasicMaterial( { color: 0x00ffff*Math.random() } );
    
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x=Math.random()*10-5;
    cube.position.z=Math.random()*-5;
    cubes.push(cube)
    scene.add(cube);
}

camera.position.z = 5;
// camera.position.set( 0, 20, 100 );
// controls.update();
function animate() {
	requestAnimationFrame(animate);
    for (let i = 0; i < cubes.length; i++) {
        const c = cubes[i];
    
        // c.rotation.x += 0.102221;
        c.rotation.y += 0.00121*i;
        console.log(i);
    }
    // controls.update();
	renderer.render( scene, camera );
}
animate();