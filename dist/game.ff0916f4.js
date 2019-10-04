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
})({"game/classes/Hopper.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _game = require("../game.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Hopper =
/*#__PURE__*/
function () {
  function Hopper(x, y) {
    _classCallCheck(this, Hopper);

    this.x = x;
    this.y = y;
    this.radius = _game.config.hopper.radius; // Collision detectors

    this.left = x - this.radius;
    this.right = x + this.radius;
    this.bottom = y + this.radius; // Movement

    this.movement = "falling";
    this.direction = "right"; // Physics

    this.dx = _game.config.physics.speed;
    this.dy = _game.config.physics.speed;
    this.terminal = _game.config.terminal;
  }

  _createClass(Hopper, [{
    key: "update",
    value: function update() {
      // HELPER FUNCTIONS
      var isWallToLeft = function isWallToLeft() {
        return block.includes(_game.gameBoard[gridY][gridX - 1]);
      };

      var isWallToRight = function isWallToRight() {
        return block.includes(_game.gameBoard[gridY][gridX + 1]);
      };

      var isFloorBelowHopper = function isFloorBelowHopper() {
        return block.includes(_game.gameBoard[gridY + 1][gridX]);
      };

      var isNoFloorBelowHopper = function isNoFloorBelowHopper() {
        return empty.includes(_game.gameBoard[gridY + 1][gridX]);
      }; // COLLISIONS
      // First translate current px coordinates as grid coordinates


      var gridX = Math.floor(this.x / _game.config.board.spacing);
      var gridY = Math.floor(this.y / _game.config.board.spacing);
      var block = [1, 2]; // These correspond to blocks that hoppers can't move through

      var empty = [0, 4]; // Correspond to empty squares or exit

      var px_blockTop = (gridY + 1) * _game.config.board.spacing; // y coordinate of top of block
      // Test collision with floor

      if (isFloorBelowHopper()) {
        // See if square below hopper is an impenetrable block
        if (this.bottom + this.dy > px_blockTop) {
          this.movement = "rolling";
          this.y = px_blockTop - this.radius; // Correcting position
        }
      } // Test collision with wall to the right of hopper


      if (isWallToRight()) {
        if (this.right > (gridX + 1) * _game.config.board.spacing) {
          this.direction = "left";
        }
      } // Test collision with wall to the left of hopper


      if (isWallToLeft()) {
        if (this.left < gridX * _game.config.board.spacing) {
          this.direction = "right";
        }
      } // Make hopper fall if it rolls off an edge


      if (this.movement == "rolling" && isNoFloorBelowHopper() && this.bottom + 1 > (gridY + 1) * _game.config.board.spacing && (this.left + 1 > gridX * _game.config.board.spacing && this.direction == "right" || this.right - 1 < (gridX + 1) * _game.config.board.spacing && this.direction == "left")) {
        this.movement = "falling";
      } // Wrap around


      if (this.bottom + this.dy > _game.canvas.height) {
        this.y = 0;
      }

      if (this.x > _game.canvas.width) {
        this.x = 0;
      }

      if (this.x < 0) {
        this.x = _game.canvas.width;
      } // MOVEMENT


      switch (this.movement) {
        case "falling":
          this.dx = 0;
          this.dy = Math.min(this.dy + _game.config.physics.gravity, _game.config.physics.terminal);
          this.y += this.dy;
          break;

        case "rolling":
          this.dx = this.direction == "right" ? _game.config.physics.speed : -_game.config.physics.speed;
          this.dy = 0;
          this.x += this.dx;
          break;
      } // Update collision detectors


      this.left = this.x - this.radius;
      this.right = this.x + this.radius;
      this.bottom = this.y + this.radius;
      this.draw();
    }
  }, {
    key: "draw",
    value: function draw() {
      _game.c.save();

      _game.c.beginPath();

      _game.c.fillStyle = _game.config.hopper.color;

      _game.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);

      _game.c.fill();

      _game.c.closePath();

      _game.c.restore();
    }
  }]);

  return Hopper;
}();

exports.default = Hopper;
},{"../game.js":"game/game.js"}],"game/eventListeners.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mousedown = exports.mouse = void 0;
var mouse = {
  x: 900,
  y: 900
};
exports.mouse = mouse;
var mousedown = false;
exports.mousedown = mousedown;
window.addEventListener("mousemove", function () {
  mouse.x = event.x;
  mouse.y = event.y;
});
window.addEventListener("mousedown", function () {
  exports.mousedown = mousedown = true;
});
window.addEventListener("mouseup", function () {
  exports.mousedown = mousedown = false;
});
},{}],"game/classes/Selector.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _game = require("../game.js");

var _eventListeners = require("../eventListeners.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// During init() we log all movable blocks and create an array of objects that stores the block's home address
// and current address. Initially home and current are the same.
// When user first drags a block, its home address is stored in this selector object.
// Then when user drags the block to another location, we search the 'addresses' array
// for an object that matches the home address stored in this selector.
// Its new location is then stored in 'current'.
// The implication of this is that when the user goes to drag the block again, we loop through this process
// Only this time, the current address is different to the home address.
// The home address is referenced when dragging the block around, so that we can't pull the block
// more than one square away in any direction.
// Doing things this way means we don't have to have an object for every block, which
// gives primacy to the level map.
// This makes life easier when it comes to being able to edit levels etc.
// We also don't have to loop through a list of block objects every frame, because collisions are handled by
// the hopper object which only checks for collisions within one square of itself,
// and the loops in this object are only called when we drag a block.
var Selector =
/*#__PURE__*/
function () {
  function Selector() {
    _classCallCheck(this, Selector);

    this.x = null;
    this.y = null;
    this.homeX = null;
    this.homeY = null;
    this.dragging = false;
    this.draggingBlock = false;
    this.whatBlockWas = null;
  }

  _createClass(Selector, [{
    key: "update",
    value: function update() {
      var _this = this;

      var gridX = Math.floor(_eventListeners.mouse.x / _game.config.board.spacing);
      var gridY = Math.floor(_eventListeners.mouse.y / _game.config.board.spacing);
      var newX = Math.floor(this.x / _game.config.board.spacing);
      var newY = Math.floor(this.y / _game.config.board.spacing); // Helper functions

      var isOverlappingBlock = function isOverlappingBlock() {
        try {
          return _game.gameBoard[gridY][gridX] == 1;
        } catch (_unused) {
          return false;
        }
      };

      var hasStartedDraggingBlock = function hasStartedDraggingBlock() {
        return !_this.dragging && _eventListeners.mousedown && isOverlappingBlock();
      };

      var isDraggingEmptySquare = function isDraggingEmptySquare() {
        return !_this.dragging && _eventListeners.mousedown && !isOverlappingBlock();
      };

      var hasStoppedDragging = function hasStoppedDragging() {
        return _this.dragging && !_eventListeners.mousedown;
      };

      var isPainting = function isPainting() {
        return _eventListeners.mousedown && _this.draggingBlock;
      };

      var squareIsEmpty = function squareIsEmpty() {
        try {
          return _game.gameBoard[gridY][gridX] == 0;
        } catch (_unused2) {
          return false;
        }
      };

      var isOverlappingHopper = function isOverlappingHopper() {
        return _game.hoppers.some(function (hopper) {
          try {
            var hopperGridX = Math.floor(hopper.x / _game.config.board.spacing);
            var hopperGridY = Math.floor(hopper.y / _game.config.board.spacing);
            return newX == hopperGridX && newY == hopperGridY;
          } catch (_unused3) {
            return false;
          }
        });
      };

      if (hasStartedDraggingBlock()) {
        var address = _game.homeAddresses.filter(function (address) {
          return address.current.x == gridX && address.current.y == gridY;
        })[0];

        this.homeX = address.home.x * _game.config.board.spacing;
        this.homeY = address.home.y * _game.config.board.spacing;
        this.whatBlockWas = _game.gameBoard[gridY][gridX];
        this.dragging = true;
        this.draggingBlock = true;
        _game.gameBoard[gridY][gridX] = 0;
      } else if (isDraggingEmptySquare()) {
        this.dragging = true;
        this.draggingBlock = false;
      }

      if (isOverlappingHopper() && this.dragging) {
        this.draw();
        return;
      } else if (hasStoppedDragging()) {
        _game.homeAddresses.forEach(function (address) {
          if (address.home.x == Math.floor(_this.homeX / _game.config.board.spacing) && address.home.y == Math.floor(_this.homeY / _game.config.board.spacing)) {
            address.current.x = newX;
            address.current.y = newY;
          }
        });

        _game.gameBoard[newY][newX] = this.whatBlockWas;
        this.dragging = false;

        if (this.draggingBlock) {
          _game.c.fillStyle = "pink";

          _game.c.fillRect(this.x, this.y, _game.config.board.spacing, _game.config.board.spacing);
        }

        this.draggingBlock = false;
      } else if (isPainting() && squareIsEmpty() && _eventListeners.mouse.x < this.homeX + _game.config.board.spacing * 2 && // Skip these if you want to drag the block anywhere, e.g. during level editing.
      _eventListeners.mouse.x > this.homeX - _game.config.board.spacing && _eventListeners.mouse.y < this.homeY + _game.config.board.spacing * 2 && _eventListeners.mouse.y > this.homeY - _game.config.board.spacing && _eventListeners.mouse.x < _game.canvas.width && _eventListeners.mouse.x >= 0 && _eventListeners.mouse.y < _game.canvas.height && _eventListeners.mouse.y >= 0) {
        this.x = Math.floor(_eventListeners.mouse.x / _game.config.board.spacing) * _game.config.board.spacing;
        this.y = Math.floor(_eventListeners.mouse.y / _game.config.board.spacing) * _game.config.board.spacing;
      }

      if (isPainting()) {
        this.draw();
      }
    }
  }, {
    key: "draw",
    value: function draw() {
      _game.c.save();

      _game.c.beginPath();

      _game.c.shadowColor = "white";
      _game.c.shadowBlur = 12;
      _game.c.strokeStyle = "rgb(255,191,0)";
      _game.c.fillStyle = "rgba(150,50,100,0.2)";

      _game.c.rect(this.homeX - _game.config.board.spacing, this.homeY - _game.config.board.spacing, _game.config.board.spacing * 3, _game.config.board.spacing * 3);

      _game.c.fill();

      _game.c.stroke();

      _game.c.closePath();

      _game.c.restore();

      _game.c.fillStyle = "orange";

      _game.c.fillRect(this.x, this.y, _game.config.board.spacing, _game.config.board.spacing);
    }
  }]);

  return Selector;
}();

exports.default = Selector;
},{"../game.js":"game/game.js","../eventListeners.js":"game/eventListeners.js"}],"game/game.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hoppers = exports.gameBoard = exports.homeAddresses = exports.selector = exports.level = exports.config = exports.c = exports.canvas = void 0;

var _Hopper = _interopRequireDefault(require("./classes/Hopper.js"));

var _Selector = _interopRequireDefault(require("./classes/Selector.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvas = document.querySelector("canvas");
exports.canvas = canvas;
var c = canvas.getContext("2d");
exports.c = c;
var config = {
  board: {
    size: 16,
    spacing: 32
  },
  hopper: {
    color: "green",
    radius: 9
  },
  mode: {
    random: true,
    adventure: false,
    editor: false
  },
  physics: {
    gravity: 0.3,
    speed: 1.5,
    terminal: 9.8
  }
};
exports.config = config;
var level = {
  color: "pink"
};
exports.level = level;
var selector = new _Selector.default();
exports.selector = selector;
var homeAddresses = [];
exports.homeAddresses = homeAddresses;
canvas.width = config.board.size * config.board.spacing;
canvas.height = config.board.size * config.board.spacing;
var gameBoard = [[0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0], [2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 2, 1, 2, 0, 1, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0], [0, 0, 1, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0], [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 2, 2, 1, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // <- stops falling errors occuring
];
exports.gameBoard = gameBoard;
var hoppers = [];
exports.hoppers = hoppers;

function init() {
  exports.hoppers = hoppers = [];
  hoppers.push(new _Hopper.default(48, 0));

  for (var y = 0; y < config.board.size; y++) {
    for (var x = 0; x < config.board.size; x++) {
      if (gameBoard[y][x] == 1) {
        homeAddresses.push({
          home: {
            x: x,
            y: y
          },
          current: {
            x: x,
            y: y
          }
        });
      }
    }
  }
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.fill(); // mouseLogic();
  // Draw game board

  for (var y = 0; y < config.board.size; y++) {
    for (var x = 0; x < config.board.size; x++) {
      switch (gameBoard[y][x]) {
        case 0:
          c.fillStyle = "black";
          break;

        case 1:
          c.fillStyle = level.color;
          break;

        case 2:
          c.fillStyle = "grey";
          break;

        case 3:
          c.fillStyle = "blue";
          break;

        case 4:
          c.fillStyle = "white";
          break;

        case 5:
          c.fillStyle = "orange";
          break;
      }

      c.save();
      c.beginPath();
      c.fillRect(x * config.board.spacing, y * config.board.spacing, x * config.board.spacing + config.board.spacing, y * config.board.spacing + config.board.spacing);
      c.fill();
      c.closePath();
      c.restore();
    }
  } // Update and draw selector


  selector.update(); // Update and draw hoppers

  hoppers.forEach(function (hopper) {
    return hopper.update();
  });
}

init();
gameLoop();
},{"./classes/Hopper.js":"game/classes/Hopper.js","./classes/Selector.js":"game/classes/Selector.js"}],"../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57257" + '/');

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
      } else {
        window.location.reload();
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
},{}]},{},["../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","game/game.js"], null)
//# sourceMappingURL=/game.ff0916f4.js.map