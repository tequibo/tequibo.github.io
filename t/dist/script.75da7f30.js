// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"script.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
function rr(min, max) {
  return min + Math.random() * (max - min);
}

function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}
/* INSTANCE METHODS */


Vector.prototype = {
  negative: function negative() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  },
  add: function add(v) {
    if (v instanceof Vector) {
      this.x += v.x;
      this.y += v.y;
    } else {
      this.x += v;
      this.y += v;
    }

    return this;
  },
  subtract: function subtract(v) {
    if (v instanceof Vector) {
      this.x -= v.x;
      this.y -= v.y;
    } else {
      this.x -= v;
      this.y -= v;
    }

    return this;
  },
  multiply: function multiply(v) {
    if (v instanceof Vector) {
      this.x *= v.x;
      this.y *= v.y;
    } else {
      this.x *= v;
      this.y *= v;
    }

    return this;
  },
  divide: function divide(v) {
    if (v instanceof Vector) {
      if (v.x != 0) this.x /= v.x;
      if (v.y != 0) this.y /= v.y;
    } else {
      if (v != 0) {
        this.x /= v;
        this.y /= v;
      }
    }

    return this;
  },
  equals: function equals(v) {
    return this.x == v.x && this.y == v.y;
  },
  dot: function dot(v) {
    return this.x * v.x + this.y * v.y;
  },
  cross: function cross(v) {
    return this.x * v.y - this.y * v.x;
  },
  length: function length() {
    return Math.sqrt(this.dot(this));
  },
  normalize: function normalize() {
    return this.divide(this.length());
  },
  min: function min() {
    return Math.min(this.x, this.y);
  },
  max: function max() {
    return Math.max(this.x, this.y);
  },
  toAngles: function toAngles() {
    return -Math.atan2(-this.y, this.x);
  },
  angleTo: function angleTo(a) {
    return Math.acos(this.dot(a) / (this.length() * a.length()));
  },
  toArray: function toArray(n) {
    return [this.x, this.y].slice(0, n || 2);
  },
  clone: function clone() {
    return new Vector(this.x, this.y);
  },
  set: function set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
};
/* STATIC METHODS */

Vector.negative = function (v) {
  return new Vector(-v.x, -v.y);
};

Vector.add = function (a, b) {
  if (b instanceof Vector) return new Vector(a.x + b.x, a.y + b.y);else return new Vector(a.x + b, a.y + b);
};

Vector.subtract = function (a, b) {
  if (b instanceof Vector) return new Vector(a.x - b.x, a.y - b.y);else return new Vector(a.x - b, a.y - b);
};

Vector.multiply = function (a, b) {
  if (b instanceof Vector) return new Vector(a.x * b.x, a.y * b.y);else return new Vector(a.x * b, a.y * b);
};

Vector.divide = function (a, b) {
  if (b instanceof Vector) return new Vector(a.x / b.x, a.y / b.y);else return new Vector(a.x / b, a.y / b);
};

Vector.equals = function (a, b) {
  return a.x == b.x && a.y == b.y;
};

Vector.dot = function (a, b) {
  return a.x * b.x + a.y * b.y;
};

Vector.cross = function (a, b) {
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
    case 0:
      r = v, g = t, b = p;
      break;

    case 1:
      r = q, g = v, b = p;
      break;

    case 2:
      r = p, g = v, b = t;
      break;

    case 3:
      r = p, g = q, b = v;
      break;

    case 4:
      r = t, g = p, b = v;
      break;

    case 5:
      r = v, g = p, b = q;
      break;
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

  var max = Math.max(r, g, b),
      min = Math.min(r, g, b),
      d = max - min,
      h,
      s = max === 0 ? 0 : d / max,
      v = max / 255;

  switch (max) {
    case min:
      h = 0;
      break;

    case r:
      h = g - b + d * (g < b ? 6 : 0);
      h /= 6 * d;
      break;

    case g:
      h = b - r + d * 2;
      h /= 6 * d;
      break;

    case b:
      h = r - g + d * 4;
      h /= 6 * d;
      break;
  }

  return {
    h: h,
    s: s,
    v: v
  };
}

function rotate2d(x, y, angle) {
  var s = Math.sin(angle);
  var c = Math.cos(angle);
  var newx = x * c - y * s;
  var newy = x * s + y * c;
  return {
    x: newx,
    y: newy
  };
}

var Particle = /*#__PURE__*/function () {
  function Particle(position, size_vel, hue, parent) {
    _classCallCheck(this, Particle);

    this.position = new Vector(position.x, position.y);
    this.acceleration = new Vector(0, 0);
    this.velocity = new Vector(0, 0); // if(parent!=null){
    //   this.velocity = Vector.subtract(parent.position, this.position)
    //   this.velocity.multiply(-.05);
    //   // this.velocity.add(parent.velocity);
    // }

    this.life = 0;
    this.size = 0;
    this.size_vel = size_vel;
    this.spawned = 0;
    this.parent = parent;
    var rgb = HSVtoRGB(hue, 1, 1);
    this.hue = hue;
    this.color = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')'; // console.log(this.original_position);

    this.max_spawn = rr(0, 5);
    this.rotation = rr(0, TAU);
    this.rot_vel = rr(-.1, 1);
    this.special = rr(0, 1) > .9 ? true : false; // this.attract = rr(0,1)>.7?true:false;
  }

  _createClass(Particle, [{
    key: "run",
    value: function run() {
      if (this.parent != undefined) {} else {// console.log(this.head_position);            
      }

      this.velocity.multiply(.97);
      this.position.add(this.velocity);
    }
  }, {
    key: "render",
    value: function render() {}
  }]);

  return Particle;
}();

var TAU = 6.2831853; // const start = Date.now();

var ParticleSystem = /*#__PURE__*/function () {
  function ParticleSystem(origin) {
    _classCallCheck(this, ParticleSystem);

    this.particles = [];
    this.draw = false;
  }

  _createClass(ParticleSystem, [{
    key: "addParticle",
    value: function addParticle() {
      this.new_part = new Particle(new Vector(mousePosPrev.x, mousePosPrev.y), rr(.1, .5), color_hue, this.prev_part);
      this.particles.push(this.new_part);
      this.prev_part = this.new_part;
    }
  }, {
    key: "addParticleSpawn",
    value: function addParticleSpawn(parent_particle) {
      this.new_part = new Particle(new Vector(parent_particle.position.x, parent_particle.position.y), rr(.1, .5), parent_particle.hue + .001 % 1, parent_particle);
      var v = Vector.subtract(parent_particle.position, parent_particle.parent.position);
      v = rotate2d(v.x, v.y, rr(-.5, .5));
      this.new_part.spawned = parent_particle.spawned;
      this.new_part.life = parent_particle.life;
      this.new_part.velocity.x = v.x;
      this.new_part.velocity.y = v.y;
      this.new_part.velocity.normalize();
      this.new_part.velocity.multiply(rr(1.1, 3));
      this.new_part.special = true;
      this.new_part.attract = true;
      this.particles.push(this.new_part);
    }
  }, {
    key: "run",
    value: function run() {
      var p;
      var len = this.particles.length;

      for (var i = 0; i < this.particles.length; i++) {
        p = this.particles[i]; // if (this.state != "creation") {
        //   p.run();      
        // } 

        var rgb = HSVtoRGB(p.hue, 1, 1 - p.life / 5);
        var v = new Vector(0, 0);

        for (var _i = 0; _i < this.particles.length; _i++) {
          var p2 = this.particles[_i];

          if (p == p2 || p2 == p.parent || !p.attract) {
            continue;
          }

          v = Vector.subtract(p.position, p2.position);

          if (v.length() < 20) {
            // console.log(v)
            v.multiply(.001);

            if (false) {
              p2.velocity.add(v);
              p.velocity.subtract(v);
            } else {
              p.velocity.add(v); // p2.velocity.subtract(v);
            }
          }
        }

        p.run();

        if (p.special) {
          if (rr(0, 1) > .9 && p.parent != null && p.spawned < p.max_spawn) {
            p.spawned++;
            this.addParticleSpawn(p);
          }

          ctx.save();
          ctx.translate(p.position.x, p.position.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }

        p.size_vel *= .95;
        p.size += p.size_vel;
        p.rot_vel *= .97;
        p.rotation += p.rot_vel;
        p.render();
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';

        if (p.parent != null) {
          ctx.moveTo(p.position.x, p.position.y);
          ctx.lineTo(p.parent.position.x, p.parent.position.y);
        }

        ctx.lineWidth = 1; //4-3*i/len;

        ctx.stroke();
        p.life += dt * .001;

        if (p.life > 5) {
          this.particles.splice(i, 1);
        }
      } // console.log(this.state);

    }
  }]);

  return ParticleSystem;
}();

var mousePos;
var mousePosPrev;
var mousePosMM;
var lines = [];
var currentLine;
var mouseIsPressed = false;
var color_hue = 0;

function setup() {
  // canvas = document.querySelector("canvas");
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  canvas2 = document.getElementById("canvas2");
  ctx2 = canvas2.getContext("2d"); // ctx2.fillStyle='rgb(10,10,10)';
  // ctx2.fillRect(0, 0, canvas2.width, canvas2.height);

  resize();
  window.addEventListener("resize", resize);
}

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  w = canvas2.width = window.innerWidth;
  h = canvas2.height = window.innerHeight; //ctx.translate(w / 2, h / 2);
}

function getMousePos(canvas, e) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

var time_old;
var show_tip = true;
var dt = 0;

function draw(e) {
  dt = e - time_old;
  time_old = e;
  requestAnimationFrame(draw);
  mousePosPrev = mousePos;
  mousePos = mousePosMM;

  if (mouseIsPressed) {
    currentLine.addParticle();
  } //   ctx2.fillStyle='rgba(0,0,0,.01)';
  //   ctx2.fillRect(0, 0, canvas2.width, canvas2.height);


  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (show_tip) {
    color_hue += .001;

    if (color_hue > 1) {
      color_hue = 0;
    }

    var rgb = HSVtoRGB(color_hue, .7, 1);
    ctx.fillStyle = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')'; // ctx.fillStyle='rgb(155,155,155)';

    ctx.textAlign = "center";
    ctx.font = '28px monospace';
    ctx.fillText('draw', w / 2, h / 2);
  }

  if (lines.length > 0) {
    for (var i = 0; i < lines.length; i++) {
      var l = lines[i];

      if (l.particles.length == 0 && l.anim) {
        lines.splice(i, 1);
      }

      l.run();
    }
  }
}

setup();

canvas.onmousemove = function (e) {
  // mousePosPrev = mousePos;
  mousePosMM = getMousePos(canvas, e);

  if (mouseIsPressed) {
    color_hue += .0005;

    if (color_hue > 1) {
      color_hue = 0;
    }
  }
};

canvas.onmousedown = function (e) {
  mouseIsPressed = true;
  show_tip = false; // console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);

  var l = new ParticleSystem(mousePos);
  lines.push(l);
  currentLine = l;
};

canvas.onmouseup = function (e) {
  // console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
  currentLine.state = "finished";
  mouseIsPressed = false;
};

draw(1);
},{}],"../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54249" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script.js"], null)
//# sourceMappingURL=/script.75da7f30.js.map