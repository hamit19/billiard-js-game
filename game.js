const Ball_ORIGIN = new Vector(25,25);

const STICK_ORIGIN = new Vector(970, 11);
const SHOOT_ORIGIN = new Vector(950, 11);
const DELTA = 1/100;


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
  Mouse.position.x = e.pageX;
  Mouse.position.y = e.pageY;
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



//======> White Ball <========//

function Ball(position) {
  this.position = position;
  this.velocity = new Vector()
  this.moving = false;
}


Ball.prototype.update = function(delta) {
  this.position.addTo(this.velocity.mult(delta))
  this.velocity = this.velocity.mult(.98)

  if( this.velocity.length() < 5 ) {
    this.velocity = new Vector() ;
    this.moving = false;
  }

}

Ball.prototype.draw = function() {
  Canvas.drawImages(sprites.WhiteBall, this.position, Ball_ORIGIN )
}


Ball.prototype.shoot = function(power, rotation) {
   this.velocity =  new Vector(power * Math.cos(rotation),  power * Math.sin(rotation))

   this.moving = true;

}

//-------------------------------

//==========> Stick <===========//

function Stick ( position, onShoot ) {
  this.position = position;
  this.rotation = 0;
  this.origin = STICK_ORIGIN.copy();
  this.power = 0;
  this.onShoot = onShoot;
  this.shut = false;
}


Stick.prototype.draw = function() {
  Canvas.drawImages(sprites.stick, this.position, this.origin, this.rotation)
}


Stick.prototype.update = function () {
  this.updateRotation()

  if(Mouse.left.down) {

    this.increasePower()

  }else if(this.power > 0 ) {
    this.shoot()
  }

}

Stick.prototype.shoot = function() {

  this.onShoot(this.power, this.rotation);

  this.power = 0;

  this.origin = SHOOT_ORIGIN.copy();

  this.shut = true;
}


Stick.prototype.increasePower = function() {
  this.power += 100;
  this.origin.x += 5;

}

Stick.prototype.updateRotation = function() {
  let opposite = Mouse.position.y - this.position.y;
  let adjacent = Mouse.position.x - this.position.x;

  this.rotation = Math.atan2(opposite, adjacent);

}

Stick.prototype.rePosition = function(position) {
  this.position = position.copy()
}

//--------------------------------



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
  this.cxt.drawImage(image, -origin.x, -origin.y);
  this.cxt.restore();
};

let Canvas = new Canvas2D();

//-----------------------

// =====> game World <====//

function GameWorld() {

  this.whiteBall = new Ball(new Vector(410, 413))

  this.stick = new Stick(new Vector(413, 413), this.whiteBall.shoot.bind(this.whiteBall))

}

GameWorld.prototype.update = function () {
  this.stick.update()
  this.whiteBall.update(DELTA)

  if(!this.whiteBall.moving && this.stick.shut ) {
    this.stick.rePosition(this.whiteBall.position)
    this.stick.origin = STICK_ORIGIN.copy()
  }
};

GameWorld.prototype.draw = function () {
  Canvas.drawImages(sprites.background);

  this.whiteBall.draw()

  this.stick.draw()
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
