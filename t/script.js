/**
 * NOTE:
 * Please read the README.md file provided in this template.
 */

// If you want to create OBJKT's with different seeds, you can access the creator and viewer wallet ids. This values will only be injected once the piece has been minted
// they will not work locally.
// if the user is not sync, the viewer comes in as false
// const creator = new URLSearchParams(window.location.search).get('creator')
// const viewer = new URLSearchParams(window.location.search).get('viewer')

// console.log('NFT created by', creator)
// console.log('NFT viewed by', viewer)

// Dont forget to add your own resize handler. hicetnunc expects to get content in the whole width and heght
// const resize = () => {
//     console.log('resize')
// }
// window.addEventListener('resize', resize);

/*
Simple 2D JavaScript Vector Class
Hacked from evanw's lightgl.js
https://github.com/evanw/lightgl.js/blob/master/src/vector.js
*/
function rr(min, max){
  return min+Math.random()*(max-min);
}

function Vector(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

/* INSTANCE METHODS */

Vector.prototype = {
	negative: function() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	},
	add: function(v) {
		if (v instanceof Vector) {
			this.x += v.x;
			this.y += v.y;
		} else {
			this.x += v;
			this.y += v;
		}
		return this;
	},
	subtract: function(v) {
		if (v instanceof Vector) {
			this.x -= v.x;
			this.y -= v.y;
		} else {
			this.x -= v;
			this.y -= v;
		}
		return this;
	},
	multiply: function(v) {
		if (v instanceof Vector) {
			this.x *= v.x;
			this.y *= v.y;
		} else {
			this.x *= v;
			this.y *= v;
		}
		return this;
	},
	divide: function(v) {
		if (v instanceof Vector) {
			if(v.x != 0) this.x /= v.x;
			if(v.y != 0) this.y /= v.y;
		} else {
			if(v != 0) {
				this.x /= v;
				this.y /= v;
			}
		}
		return this;
	},
	equals: function(v) {
		return this.x == v.x && this.y == v.y;
	},
	dot: function(v) {
		return this.x * v.x + this.y * v.y;
	},
	cross: function(v) {
		return this.x * v.y - this.y * v.x
	},
	length: function() {
		return Math.sqrt(this.dot(this));
	},
	normalize: function() {
		return this.divide(this.length());
	},
	min: function() {
		return Math.min(this.x, this.y);
	},
	max: function() {
		return Math.max(this.x, this.y);
	},
	toAngles: function() {
		return -Math.atan2(-this.y, this.x);
	},
	angleTo: function(a) {
		return Math.acos(this.dot(a) / (this.length() * a.length()));
	},
	toArray: function(n) {
		return [this.x, this.y].slice(0, n || 2);
	},
	clone: function() {
		return new Vector(this.x, this.y);
	},
	set: function(x, y) {
		this.x = x; this.y = y;
		return this;
	}
};

/* STATIC METHODS */
Vector.negative = function(v) {
	return new Vector(-v.x, -v.y);
};
Vector.add = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x + b.x, a.y + b.y);
	else return new Vector(a.x + b, a.y + b);
};
Vector.subtract = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x - b.x, a.y - b.y);
	else return new Vector(a.x - b, a.y - b);
};
Vector.multiply = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x * b.x, a.y * b.y);
	else return new Vector(a.x * b, a.y * b);
};
Vector.divide = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x / b.x, a.y / b.y);
	else return new Vector(a.x / b, a.y / b);
};
Vector.equals = function(a, b) {
	return a.x == b.x && a.y == b.y;
};
Vector.dot = function(a, b) {
	return a.x * b.x + a.y * b.y;
};
Vector.cross = function(a, b) {
	return a.x * b.y - a.y * b.x;
};
/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
/* accepts parameters
 * r  Object = {r:x, g:y, b:z}
 * OR 
 * r, g, b
*/
function RGBtoHSV(r, g, b) {
    if (arguments.length === 1) {
        g = r.g, b = r.b, r = r.r;
    }
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return {
        h: h,
        s: s,
        v: v
    };
}

function rotate2d(x, y, angle){
    let s = Math.sin(angle);
    let c = Math.cos(angle);
    let newx = x*c-y*s;
    let newy = x*s+y*c;
    return {x:newx,y:newy};
}


class Particle {
    constructor(position, size_vel, hue, parent) {
        this.position = new Vector(position.x,position.y); 
        this.acceleration = new Vector(0,0); 
        this.velocity = new Vector(0,0); 
        // if(parent!=null){
        //   this.velocity = Vector.subtract(parent.position, this.position)
        //   this.velocity.multiply(-.05);
        //   // this.velocity.add(parent.velocity);
        // }
        this.life=0;     
        this.size = 0;
        this.size_vel = size_vel;
        this.spawned=0;
        this.parent = parent;
        let rgb = HSVtoRGB(hue,1,1);
        this.hue = hue;
        this.color = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
        // console.log(this.original_position);
        this.max_spawn = rr(0,5);
        this.rotation = rr(0,TAU);
        this.rot_vel = rr(-.1,1)
        this.special = rr(0,1)>.9?true:false;
        // this.attract = rr(0,1)>.7?true:false;
    }

    run() {
        if(this.parent!=undefined){
        }
        else{
          // console.log(this.head_position);            
        }
        
        this.velocity.multiply(.97);
        this.position.add(this.velocity);
        

    }
    render(){

    }
}
let TAU = 6.2831853;
// const start = Date.now();
class ParticleSystem{
  constructor(origin){   
    this.particles = [];    
    this.draw=false;   
  }

  addParticle() {    
    this.new_part = new Particle(new Vector(mousePosPrev.x, mousePosPrev.y), rr(.1,.5), color_hue, this.prev_part);    
    this.particles.push(this.new_part);
    this.prev_part = this.new_part;
  }
  addParticleSpawn(parent_particle) {    
    this.new_part = new Particle(new Vector(parent_particle.position.x, parent_particle.position.y), rr(.1,.5), parent_particle.hue+.001%1, parent_particle);
    let v = Vector.subtract(parent_particle.position, parent_particle.parent.position); 
    v = rotate2d(v.x,v.y,rr(-.5,.5));
    this.new_part.spawned=parent_particle.spawned;
    this.new_part.life=parent_particle.life;
    this.new_part.velocity.x = v.x; 
    this.new_part.velocity.y = v.y; 
    this.new_part.velocity.normalize();
    this.new_part.velocity.multiply(rr(1.1,3));
    this.new_part.special=true;
    this.new_part.attract=true;
    this.particles.push(this.new_part);
  }
  run() {
    let p; 
    let len = this.particles.length;    
    for (let i = 0; i<this.particles.length; i++) {
      p = this.particles[i];
      
      // if (this.state != "creation") {
      //   p.run();      
      // } 
      let rgb = HSVtoRGB(p.hue,1,1-p.life/5);
      let v = new Vector(0,0);
      for (let i = 0; i<this.particles.length; i++) {
        let p2 = this.particles[i];
        if(p==p2 || p2==p.parent || !p.attract){
          continue;
        }
        v = Vector.subtract(p.position, p2.position);
        if(v.length()<20){
          // console.log(v)
          v.multiply(.001);
          if(false){
            p2.velocity.add(v);
            p.velocity.subtract(v);
          }
          else{
            p.velocity.add(v);
            // p2.velocity.subtract(v);
          }
        }
      }
      p.run();
      if(p.special){
        if(rr(0,1)>.9 && p.parent!=null && p.spawned<p.max_spawn){
          p.spawned++;
          this.addParticleSpawn(p);
        }
      ctx.save();
      ctx.translate(p.position.x,p.position.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
      ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);
      ctx.restore();
      }
      p.size_vel*=.95;
      p.size+=p.size_vel;
      p.rot_vel*=.97
      p.rotation+=p.rot_vel;
      p.render();
      ctx.beginPath(); 
      
      ctx.strokeStyle = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
      if(p.parent!=null){     
        ctx.moveTo(p.position.x, p.position.y);
        ctx.lineTo(p.parent.position.x, p.parent.position.y);       
      }      
      ctx.lineWidth = 1;//4-3*i/len;
      ctx.stroke(); 
      
      
      p.life+=dt*.001;
      if(p.life>5){
        this.particles.splice(i,1);
      }
    }
    // console.log(this.state);
    
     
}  
}  

let mousePos;  
let mousePosPrev;
let mousePosMM
let lines = [];
let currentLine;
let mouseIsPressed=false;
let color_hue=0;
function setup() {     
  // canvas = document.querySelector("canvas");
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  canvas2 = document.getElementById("canvas2");
  ctx2 = canvas2.getContext("2d");
  // ctx2.fillStyle='rgb(10,10,10)';
  // ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
  resize();
  window.addEventListener("resize", resize); 
  canvas.addEventListener("touchstart", handleStart, false);
  // canvas.addEventListener("touchend", handleEnd, false);
  // canvas.addEventListener("touchcancel", handleCancel, false);
  // canvas.addEventListener("touchmove", handleMove, false);
}
function resize() {
  w= canvas.width = window.innerWidth;
  h= canvas.height = window.innerHeight;

  w = canvas2.width = window.innerWidth;
  h = canvas2.height =window.innerHeight;
  //ctx.translate(w / 2, h / 2);
}
function handleStart(evt) {  
  evt.preventDefault();
  var touches = evt.changedTouches;
  touched(new Vector(touches[0].pageX,touches[0].pageY));
}
function handleMove(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;
  mousePosMM.x = touches[0].pageX;
  mousePosMM.y = touches[0].pageY;
}

function handleEnd(evt) {
  evt.preventDefault();
  mouseIsPressed = false;
}
function touched(pos){
  mouseIsPressed=true;
  show_tip=false;
  // console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
  let l = new ParticleSystem(pos);
  lines.push(l);
  currentLine=l; 
}
canvas.onmousemove = function(e){
  // mousePosPrev = mousePos;
  mousePosMM = getMousePos(canvas, e);
  if(mouseIsPressed){
      color_hue+=.0005;
      if(color_hue>1){
          color_hue=0;
      }
  }
  
}
canvas.onmousedown = function(e){
  touched(mousePos); 
}
canvas.onmouseup = function(e){
  // console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
  currentLine.state="finished";
  mouseIsPressed = false;
}


function getMousePos(canvas, e) {
  var rect = canvas.getBoundingClientRect();
  return {
  x: e.clientX - rect.left,
  y: e.clientY - rect.top
  };
}
let time_old;
let show_tip=true;
let dt=0;
function draw(e) {
  dt = e-time_old;
  time_old = e;
  requestAnimationFrame(draw);
  mousePosPrev = mousePos;
    mousePos=mousePosMM;
    if (mouseIsPressed) { 
        currentLine.addParticle();    
      }
    //   ctx2.fillStyle='rgba(0,0,0,.01)';
//   ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if(show_tip){
    color_hue+=.001;
    if(color_hue>1){
      color_hue=0;
    }
  
    let rgb = HSVtoRGB(color_hue,.7,1);
    ctx.fillStyle = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
    // ctx.fillStyle='rgb(155,155,155)';
    ctx.textAlign = "center";
    ctx.font = '28px monospace';
    ctx.fillText('draw', w/2, h/2);
  }
  
  if(lines.length>0){
    for (let i = 0; i <lines.length; i++) {
      let l = lines[i];
      if(l.particles.length==0 && l.anim){
        lines.splice(i,1);
      }
      l.run();      
    }
  }
}
setup();

draw(1);
