var gravity = 0.001;
let animationId = null;
let isStopped = false;
var friction = 0.99;
let dots = [];
let optionsG;
let ctx;
let width;
let height;

var colors = ["#D8F0F2", "#6D90A6", "#465E73", "#D99F6C"];

let BouncingDots = function (canvas, options) {
  ctx = canvas.getContext("2d");
  width = canvas.width;
  height = canvas.height;

  let defaultOptions = {
    backgroundColor: "#000000",
    count: 10,
    minRadius: 20,
    maxRadius: 50,
    minSpeed: 0.0003,
    maxSpeed: 1,
    fadeSpeed: 0.9,
    trailingDots: 0,
    trailingTicks: 0,
  };

  options = options || {};
  for (let key in defaultOptions) {
    if (options[key] === undefined) {
      options[key] = defaultOptions[key];
    }
  }

  optionsG = options;

  for (let i = 0; i < optionsG.count; i++) {
    let dot = new Dot(width, height);
    dots.push(dot);
  }

  animate();
};

class Dot {
  constructor() {
    this.radius = randomFloatFromRange(optionsG.minRadius, optionsG.maxRadius);
    this.xSpeed =
      randomFloatFromRange(optionsG.minSpeed, optionsG.maxSpeed) *
        Math.random() <
      0.5
        ? 1
        : -1;
    this.ySpeed =
      randomFloatFromRange(optionsG.minSpeed, optionsG.maxSpeed) *
        Math.random() <
      0.5
        ? 1
        : -1;
    this.opacity = randomFloatFromRange(
      optionsG.minOpacity,
      optionsG.maxOpacity
    );
    this.color = hexToRgba(
      colors[randomIntFromRange(0, colors.length - 1)],
      0.85
    );
    this.x = randomIntFromRange(this.radius * 2, width - this.radius * 2);
    this.y = randomIntFromRange(this.radius * 2, height - this.radius * 2);
    this.previousLocation = [];
    this.animationTick = 1;
  }

  animate() {
    //loop animation tick
    // this.animationTick++;
    // if (this.animationTick > optionsG.trailingTicks) {
    //   this.animationTick = 0;
    // }
    if (
      this.x + this.radius + this.xSpeed > width ||
      this.x - this.radius + this.xSpeed < 0
    ) {
      this.xSpeed = -this.xSpeed;
      this.xSpeed *= friction;
    }
    if (
      this.y + this.radius > height - this.ySpeed ||
      this.y - this.radius < 0 - this.ySpeed
    ) {
      this.ySpeed = -this.ySpeed;
      this.ySpeed *= friction;
    }
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.ySpeed += gravity;

    // if (this.animationTick === 0) {
    //   console.log("pushing");
    //   this.previousLocation.push({ x: this.x, y: this.y });
    //   if (this.previousLocation.length > optionsG.trailingDots) {
    //     this.previousLocation.shift();
    //   }
    // }

    this.draw();
  }
  draw() {
    let circleSize = this.radius;
    let circleOpacity = 0.67;

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, circleSize, 0, 2 * Math.PI);
    ctx.fill();

    // for (let i = this.previousLocation.length - 1; i >= 0; i--) {
    //   let circle = this.previousLocation[i];
    //   ctx.beginPath();
    //   ctx.arc(circle.x, circle.y, circleSize, 0, Math.PI * 2, false);
    //   ctx.fillStyle = hexToRgba(this.color, circleOpacity);
    //   ctx.fill();
    //   circleSize *= optionsG.fadeSpeed;
    //   circleOpacity *= optionsG.fadeSpeed;
    // }
  }
  reset() {
    this.x = randomFloatFromRange(0, width);
    this.y = height + this.radius;
    this.previousLocation = [];
    this.xSpeed = randomFloatFromRange(optionsG.minSpeed, optionsG.maxSpeed);
    this.ySpeed = randomFloatFromRange(optionsG.minSpeed, optionsG.maxSpeed);
    this.color = colors[randomIntFromRange(0, colors.length - 1)];
  }
}

let hexToRgba = (hex, opacity) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);
  return "rgba(" + r + "," + g + "," + b + ", " + opacity + ")";
};

let randomFloatFromRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

let randomIntFromRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

let animate = () => {
  if (isStopped) {
    return;
  }
  ctx.fillStyle = optionsG.backgroundColor;
  ctx.fillRect(0, 0, width, height);

  dots.forEach((dot) => {
    dot.animate();
  });
  animationId = requestAnimationFrame(animate);
};

let stop = () => {
  isStopped = true;
  cancelAnimationFrame(animationId);
};

let pause = () => {
  cancelAnimationFrame(animationId);
};

let resume = () => {
  animate();
};

let reset = () => {
  stop();
  dots = [];
  for (let i = 0; i < optionsG.count; i++) {
    let dot = new Dot();
    dots.push(dot);
  }
  animate();
};

export default BouncingDots;
