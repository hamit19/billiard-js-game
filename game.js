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

let vector1 = new Vector(3, 6);

let vector1Copy = vector1.copy();

console.log(vector1.length());
console.log(vector1Copy, "this victor1 copy's");

//---------------------------

//======> canvas <=====//

function Canvas2D() {
  this._canvas = document.getElementById("screen");

  this.cxt = this._canvas.getContext("2d");
}

Canvas2D.prototype.clear = function () {
  this.cxt.clearRect(0, 0, this._canvas.clientWidth, this._canvas.clientHeight);
};

Canvas2D.prototype.drawImage = function (
  image,
  position = new Vector(),
  origin = new Vector(),
  rotation = 0
) {
  this.cxt.save();
  this.cxt.translate(position.x, position.y);
  this.cxt.rotate(rotation);
  this.drawImage(image, -origin.x, -origin.y);
  this.cxt.restore();
};

//-----------------------
