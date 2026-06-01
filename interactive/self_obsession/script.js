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
    constructor(head_position, tail_position, origin, parent) {
        this.parent=parent;
        this.head_position = new Vector(head_position.x,head_position.y); 

        this.original_position = new Vector(head_position.x-origin.x,head_position.y-origin.y);
        this.mod_position = new Vector();
        this.tail_position = new Vector(tail_position.x, tail_position.y);
        this.dir=new Vector();
        this.target = new Vector(head_position.x, head_position.y);
        // if(this.parent!=undefined){
        this.delta = Vector.subtract(tail_position, head_position);
        this.delta_or = Vector.subtract(tail_position, head_position);
        this.len = Math.sqrt(this.delta.x*this.delta.x+this.delta.y*this.delta.y);
        this.dist=this.len;
        this.dx=0;
        this.dy=0;
        // this.angle=Math.atan2(delta.y,delta.x);
        this.h = color_hue;
        let rgb = HSVtoRGB(this.h,1,1);
        this.color = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
        this.s=Math.random()*.6+.2
    }

    run() {
        if(this.parent!=undefined){
            this.head_position = this.parent.tail_position;
        }
        else{
          // console.log(this.head_position);            
        }
        this.delta = Vector.subtract(this.head_position,this.tail_position);
        this.dx = this.head_position.x+this.delta_or.x-this.tail_position.x;
        this.dy = this.head_position.y+this.delta_or.y-this.tail_position.y;
        this.dist = Math.sqrt(this.dx*this.dx+this.dy*this.dy);
        this.tail_position.x+=this.dx*this.s;
        this.tail_position.y+=this.dy*this.s;
       
        

    }
    render(){

    }
}
let TAU = 6.2831853;
// const start = Date.now();
class ParticleSystem{
  constructor(origin){
    this.velocity = new Vector();
    this.acceleration = new Vector();
    this.target_draw = new Vector();
    this.state="creation";
    this.start_drawing_point = new Vector();
    this.counter=0;
    this.ii=0;
    this.anim=false;
    this.origin=origin;
    this.particles = [];
    // this.sway=Math.random(0.005,0.01);
    this.h = Math.random();
    this.sway=Math.random()*0.02+0.002;
    this.currentSegment;
    this.freq=.9+Math.random()*.09;
    this.draw=false;
    this.v=1;
    this.sat=.6+Math.random()*.4;
    this.thic=1;
    this.draw_fr = Math.random()*.009;
    this.dist=0;
  }

  addParticle() {
    
    this.currentSegment = new Particle(new Vector(mousePosPrev.x, mousePosPrev.y),new Vector(mousePos.x, mousePos.y), this.origin, this.currentSegment,);
    
    this.particles.push(this.currentSegment);
  }
  run() {
    let head = this.particles[0];
    let p; 
    let len = this.particles.length;    
    for (let i = 0; i<this.particles.length; i++) {
      p = this.particles[i];
      if (this.state != "creation") {
        p.run();      
      } 
      p.render();
      ctx.beginPath(); 
      let rgb = HSVtoRGB(p.h,1,.7);
      ctx.strokeStyle = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
      // if(p.parent!=null){     
        ctx.moveTo(p.head_position.x, p.head_position.y);
        ctx.lineTo(p.tail_position.x, p.tail_position.y);        
        // ctx.lineTo(p.parent.position.x, p.parent.position.y);        
      // }      
      ctx.lineWidth = 1+Math.abs(Math.sin(i/len*TAU/2))*2;//4-3*i/len;
      ctx.stroke(); 
    }
    switch(this.state){
      case "fly":
        // if(Math.random()>this.freq){
        //   let a = Math.random()*TAU;
        //   let s = Math.random()*.2;
        //   this.acceleration.x = Math.cos(a)*s;
        //   this.acceleration.y = Math.sin(a)*s;
        //     // console.log(this.velocity);
        // }
        // if(Math.random()>.990+this.draw_fr){
        //     // this.state = "drawing"
        //     // this.start_drawing_point = p.head_position;
        //     this.v=.7+Math.random()*.3;
        //     this.sat=.5+Math.random()*.5;
        //     this.thic=1+Math.random()*1;
        // }
        this.delta = Vector.subtract(this.start_drawing_point, head.head_position);
        this.dist = this.delta.length();

        if(this.dist<2){
          this.state="drawing";
          head.head_position=this.start_drawing_point;
        }
        // this.delta = this.delta.multiply(.0001);     
        this.acceleration = Vector.add(this.delta.multiply(.0001), this.acceleration);
        this.velocity = Vector.add(this.velocity, this.acceleration);
        this.acceleration=this.acceleration.multiply(.95);
        this.velocity = this.velocity.multiply(.9);
        head.head_position=Vector.add(head.head_position, this.velocity);
        
        // head.head_position.x+=(this.start_drawing_point.x-head.head_position.x)*.5;
        // head.head_position.y+=(this.start_drawing_point.x-head.head_position.y)*.5;
        break;
      case "drawing":
        this.target_draw = Vector.add(this.start_drawing_point, this.particles[this.ii].mod_position);
        this.delta = Vector.subtract(this.target_draw, head.head_position);
        this.dist = this.delta.length();
        if(this.dist<2){
          this.ii++;
          // this.state="drawing";
        }
        // this.delta = this.delta.multiply(.01);     
        // this.acceleration = Vector.add(this.delta, this.acceleration);
        this.velocity = Vector.add(this.delta, this.acceleration);
        this.velocity = this.velocity.multiply(.8);
        // this.acceleration=this.acceleration.multiply(.95);
        head.head_position=Vector.add(head.head_position, this.velocity);
        
        if(this.ii>=this.particles.length){
          this.state ="finished";  
          this.ii=0;
        }     
        // head.head_position.x+=(this.start_drawing_point.x+this.particles[this.ii].original_position.x-head.head_position.x)*.5;
        // head.head_position.y+=(this.start_drawing_point.y+this.particles[this.ii].original_position.y-head.head_position.y)*.5;

        ctx2.beginPath(); 
        let rgb = HSVtoRGB(head.h,this.sat,.8);
        ctx2.strokeStyle = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
        ctx2.strokeStyle = 'rgb(255,255,255)';
        ctx2.moveTo(head.head_position.x, head.head_position.y);
        ctx2.lineTo(head.head_position.x-this.velocity.x, head.head_position.y-this.velocity.y);
        ctx2.lineWidth = this.thic;
        ctx2.stroke();

        // ctx.beginPath(); 
        // ctx.lineCap = "round";
        // ctx.arc(head.head_position.x, head.head_position.y, Math.abs(Math.sin(Date.now()*.04)*4)+4, 0, 2 * TAU, false);
        // let rgb2 = HSVtoRGB(this.h,Math.random(),1);
        // ctx.strokeStyle = 'rgb('+rgb2.r+','+rgb2.g+','+rgb2.b+')';
        // ctx.lineWidth = 3;

        // ctx.fillStyle = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
        // ctx.fill();
        ctx.stroke();
        
        break;      
      case "finished":
        let angle = Math.random()*TAU;
        let scale = .3+Math.random()*1.5;
        let leftBorder = 0;
        let topBorder = 0;
        let rightBorder = 0;
        let bottomBorder = 0;
        for (let i = 0; i<this.particles.length; i++) {
          let p = this.particles[i];
          let newPos = rotate2d(p.original_position.x, p.original_position.y, angle);
          p.mod_position.x=newPos.x*scale;
          p.mod_position.y=newPos.y*scale;
          leftBorder = Math.min(leftBorder, p.mod_position.x);
          rightBorder = Math.max(rightBorder, p.mod_position.x);
          topBorder = Math.min(topBorder, p.mod_position.y);
          bottomBorder = Math.max(bottomBorder, p.mod_position.y);
        }
        let mod_start = this.particles[0].mod_position;
        this.start_drawing_point.x = mod_start.x-leftBorder+Math.random()*(w-(rightBorder-mod_start.x)-(mod_start.x-leftBorder));
        this.start_drawing_point.y = mod_start.y-topBorder+Math.random()*(h-(bottomBorder-mod_start.y)-(mod_start.y-topBorder));
        // console.log(leftBorder);
        this.state="fly";
        break;
    }
     
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

}

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;

  w = canvas2.width = window.innerWidth;
  h = canvas2.height =window.innerHeight;
  //ctx.translate(w / 2, h / 2);
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
function draw(e) {
  var dt = e-time_old;
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

canvas.onmousemove = function(e){
    // mousePosPrev = mousePos;
    mousePosMM = getMousePos(canvas, e);
    if(mouseIsPressed){
        color_hue+=.001;
        if(color_hue>1){
            color_hue=0;
        }
    }
    
}
canvas.onmousedown = function(e){
    mouseIsPressed=true;
    show_tip=false;
    // console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
    let l = new ParticleSystem(mousePos);
    lines.push(l);
    currentLine=l;  
}
canvas.onmouseup = function(e){
    // console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
    currentLine.state="finished";
    mouseIsPressed = false;
}
draw(1);
