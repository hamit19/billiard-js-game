//========> sprite <==========//

let sprites = {};

let assetsLoading = 0;

function loadSprite(fileName) {
  assetsLoading++;

  let spriteImage = new Image();

  spriteImage.src = "./assets/" + fileName;

  spriteImage.addEventListener("load", () => {
    assetsLoading--;
  });

  return spriteImage;
}

function loadAssets(callback) {
  sprites.background = loadSprite("pool.png");
  sprites.WhiteBall = loadSprite("ball_white.png");
  sprites.stick = loadSprite("stick.png");

  console.log(sprites.background.src);

  assetsLoadingLoop(callback);
}

function assetsLoadingLoop(callback) {
  if (assetsLoading) {
    requestAnimationFrame(assetsLoadingLoop.bind(this, callback));
  } else {
    callback();
  }
}

//-------------------------------

//=======> Vector <======//

function Vector(x = 0, y = 0) {
  (this.x = x), (this.y = y);
}

Vector.prototype.copy = function () {
  return new Vector(this.x, this.y);
};

Vector.prototype.addTo = function (vector) {
  this.x += vector.x;
  this.y += vector.y;
};

Vector.prototype.mult = function (value) {
  return new Vector(this.x * value, this.y * value);
};

Vector.prototype.length = function () {
  return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
};

//---------------------------

//=======> Mouse handler <========//

function ButtonState() {
  this.down = false;
  this.pressed = false;
}

function MouseHandler() {
  this.left = new ButtonState();
  this.middle = new ButtonState();
  this.right = new ButtonState();
  this.position = new Vector();

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mousedown", handleKeyDown);
  document.addEventListener("mouseup", handleKeyUp);
}

MouseHandler.prototype.reset = function () {
  this.left.pressed = false;
  this.right.pressed = false;
  this.middle.pressed = false;
}

function handleMouseMove(e) {
  Mouse.position = e.pageX;
  Mouse.position = e.pageY;
}

function handleKeyDown(e) {
  handleMouseMove(e);

  if(e.button === 0 ) {

    Mouse.left.down = true;
    Mouse.left.pressed = true

  } else if( e.button === 1  ) {
    Mouse.middle.down = true;
    Mouse.middle.pressed = true;

  }else if (e.button === 2){
    Mouse.right.down = true;
    Mouse.right.pressed = true;
  }

}

function handleKeyUp(e) {
  handleMouseMove(e);
  
  if(e.button === 0 ) {

    Mouse.left.down = false;

  } else if( e.button === 1  ) {

    Mouse.middle.down = false;

  }else if (e.button === 2){

    Mouse.right.down = false;
  }

}

let Mouse = new MouseHandler();

//----------------------------------

//======> canvas <=====//

function Canvas2D() {
  this._canvas = document.getElementById("screen");

  this.cxt = this._canvas.getContext("2d");
}

Canvas2D.prototype.clear = function () {
  this.cxt.clearRect(0, 0, this._canvas.clientWidth, this._canvas.clientHeight);
};

Canvas2D.prototype.drawImages = function (
  image,
  position = new Vector(),
  origin = new Vector(),
  rotation = 0
) {
  this.cxt.save();
  this.cxt.translate(position.x, position.y);
  this.cxt.rotate(rotation);
  this.cxt.drawImage(image, -origin.y, -origin.y);
  this.cxt.restore();
};

let Canvas = new Canvas2D();

//-----------------------

// =====> game World <====//

function GameWorld() {}

GameWorld.prototype.update = function () {};

GameWorld.prototype.draw = function () {
  Canvas.drawImages(sprites.background);
};

let gameWorld = new GameWorld();

///-------------------------

function animate() {
  Canvas.clear();
  gameWorld.update();
  gameWorld.draw();

  requestAnimationFrame(animate);
}

loadAssets(animate);
