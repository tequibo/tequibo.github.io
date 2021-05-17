// import nomad_shader from './nomad_trippy.frag';
import * as dat from './dat.gui.module.js';

// "use strict";
function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

var canvas = document.querySelector("#glCanvas");
var gl = canvas.getContext("webgl");
if (!gl) {
    // return;
}
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}    
resize();    
window.addEventListener("resize", resize);

// let nomad_shader;
// function reqListener () {
//   //  console.log(this.responseText);
//    console.log(req.responseText);
//    nomad_shader = req.responseText;
// }
// var req = new XMLHttpRequest();
// req.responseType = "text";
// req.addEventListener("load", reqListener);
// req.open("GET", "/nomad_trippy.frag");
// req.send();

var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;
// var fragmentShaderSource = nomad_shader;
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
var program = createProgram(gl, vertexShader, fragmentShader);

var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
var colorUniformLocation = gl.getUniformLocation(program, "u_color");  
var timeUniformLocation = gl.getUniformLocation(program, "u_time");  
var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

var rotation_xUniformLocation = gl.getUniformLocation(program, "u_rotation");
var eyebrow_angleUniformLocation = gl.getUniformLocation(program, "eyebrow_angle");
var eyebrow_weightUniformLocation = gl.getUniformLocation(program, "eyebrow_weight");
var eyebrow_offsetUniformLocation = gl.getUniformLocation(program, "eyebrow_offset");

var eye_spaceUniformLocation = gl.getUniformLocation(program, "eye_space");
var eye_sizeUniformLocation = gl.getUniformLocation(program, "eye_size");
var eye_variantUniformLocation = gl.getUniformLocation(program, "eye_variant");
var iris_scaleUniformLocation = gl.getUniformLocation(program, "iris_scale");

var head_patternUniformLocation = gl.getUniformLocation(program, "head_pattern");
var body_patternUniformLocation = gl.getUniformLocation(program, "body_pattern");

var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.useProgram(program);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,-1, 1, 1, -1, 1,-1,-1,1,1,1,]), gl.STATIC_DRAW); 
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionAttributeLocation);
gl.uniform3f(colorUniformLocation, Math.random(), Math.random(), Math.random());
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);      
var time_old = 0;

var draw=function(time){
    var dt = time-time_old;
    time_old = time;
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(timeUniformLocation, time*.001);
    gl.uniform1f(rotation_xUniformLocation, rotation_hor);//settings.rotation_x);

    gl.uniform1f(eyebrow_angleUniformLocation, settings.eyebrow_angle);
    gl.uniform1f(eyebrow_weightUniformLocation, settings.eyebrow_weight);
    gl.uniform1f(eyebrow_offsetUniformLocation, settings.eyebrow_offset);
    gl.uniform1f(eye_spaceUniformLocation, settings.eye_space);
    gl.uniform1f(eye_sizeUniformLocation, settings.eye_size);
    gl.uniform1f(eye_variantUniformLocation, Math.floor(settings.eye_variant));
    gl.uniform1f(iris_scaleUniformLocation, settings.iris_scale);
    gl.uniform1f(head_patternUniformLocation, Math.floor(settings.head_pattern));
    gl.uniform1f(body_patternUniformLocation, Math.floor(settings.body_pattern));
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    window.requestAnimationFrame(draw);
    if(Math.random()>.9){
        gl.uniform3f(colorUniformLocation, Math.random(), Math.random(), Math.random());
    }
}

const gui = new dat.GUI();
let settings = {
    eyebrow_angle:0,
    eyebrow_weight:1,
    eyebrow_offset:0,
    eye_space:.5,
    eye_size:1, 
    eye_variant:0, 
    iris_scale:1,
    head_pattern:1,
    body_pattern:1,
    randomize: Randomize
  }
function Randomize(){
  settings.eyebrow_angle = rr(-.1,.1);
  settings.eyebrow_weight = rr(0.3, 1.6);
  settings.eyebrow_offset = rr(-0.1, .1);
  settings.eye_space = rr(0.3, .6);
  settings.eye_size = rr(0.2, 1);
  settings.eye_variant = rr(0, 3);
  settings.iris_scale = rr( 0.1, 1);
  settings.head_pattern = rr(0, 3);
  settings.body_pattern = rr(0, 3);
  
}
gui.add(settings, 'eyebrow_angle', -.1, .1).step(.01).listen()
gui.add(settings, 'eyebrow_weight', 0.3, 1.6).listen()
gui.add(settings, 'eyebrow_offset', -0.1, .1).listen()
gui.add(settings, 'eye_space', 0.3, .6).listen()
gui.add(settings, 'eye_size', 0.2, 1).listen()
gui.add(settings, 'eye_variant', 0, 5).listen()
gui.add(settings, 'iris_scale', 0.1, 1).listen()
gui.add(settings, 'head_pattern', 0, 4).listen()
gui.add(settings, 'body_pattern', 0, 4).listen()
gui.add(settings, 'randomize');
// main();


Randomize();
let mouse = {x:0, y:0};
let rotation_hor=0;
let rotation_hor_prev=0;
let mouseHold=false;
let touch_pos=0;
let delta_x = 0;
function onMouseMove(event) {
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  if(mouseHold){
    delta_x = (mouse.x-touch_pos)*4;
    rotation_hor = rotation_hor_prev+delta_x;
  }
}
function onTouch(event){
  touch_pos = mouse.x;
  mouseHold = true;
}
function onTouchUp(event){
  mouseHold = false;  
  rotation_hor_prev = rotation_hor;
}
canvas.addEventListener( 'mousemove', onMouseMove, false );
canvas.addEventListener( 'touchstart', onTouch);
canvas.addEventListener( 'mousedown', onTouch);
canvas.addEventListener( 'mouseup', onTouchUp);
canvas.addEventListener( 'touchend', onTouchUp);
draw(0);

function rr(min, max){
  return min+Math.random()*(max-min);
}