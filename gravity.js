window.requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

//setup
var canvas = document.getElementById('mainCanvas');
var context = canvas.getContext('2d');
canvas.addEventListener('mousedown', startListen); // mouse event listeners
canvas.addEventListener('mouseup', stopListen); 
canvas.addEventListener('touchstart', startListenTouch); // touch event listeners
canvas.addEventListener('touchend', stopListenTouch); 
var birdNumber = 2000;
var xPos = new Array(birdNumber);
var yPos = new Array(birdNumber);
//var zPos = new Array(birdNumber);
var xVel = new Array(birdNumber);
var yVel = new Array(birdNumber);
//var zVel = new Array(birdNumber);
var mouseX = 0;
var mouseY = 0;
var mouseDown = false;
var px = context.createImageData(1, 1);  // 1x1 image data for particle
px.data[0] = 0;
px.data[1] = 255;
px.data[2] = 0;
px.data[3] = 255;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

for (i=0;i<birdNumber;i++) { //sets random initial positions and velocities
  xPos[i] = Math.random()*canvas.width;
  yPos[i] = Math.random()*canvas.height;
  xVel[i] = (Math.random()*4)-2;
  yVel[i] = (Math.random()*4)-2;
}

document.body.addEventListener('touchmove', function(event) {
  event.preventDefault();
}, false); 

function animate() {

  // update
  updateFrame();

  // clear
  canvas.width = window.innerWidth; //resize canvas
  canvas.height = window.innerHeight;
  context.clearRect(0, 0, canvas.width, canvas.height);

  // draw stuff
  drawFrame();

  // request new frame
  requestAnimFrame(function() {
    animate();
  });
}
animate();

function updateFrame() {
  if (mouseDown) {
    //Accelerate towards mouse coords
    for (i=0;i<birdNumber;i++) {
      var mouseDistance = Math.sqrt( Math.pow(mouseX-xPos[i], 2) + Math.pow(mouseY-yPos[i], 2) ); 
      var mouseAngle = Math.atan((mouseX-xPos[i])/(mouseY-yPos[i]));
      if (mouseY > yPos[i]) {
        yVel[i] += (50/mouseDistance)*(Math.cos(mouseAngle));
      } else {
        yVel[i] -= (50/mouseDistance)*(Math.cos(mouseAngle));
      }
      if (mouseY > yPos[i]) {
        xVel[i] += (50/mouseDistance)*(Math.sin(mouseAngle));
      } else {
        xVel[i] -= (50/mouseDistance)*(Math.sin(mouseAngle));
      }
    }
  }
  for (i=0;i<birdNumber;i++) {
    var vel = Math.sqrt( Math.pow(xVel[i], 2) + Math.pow(yVel[i], 2) ); 
    if (vel > 10) { // limits the velocity
      xVel[i] *= 10/dist;
      yVel[i] *= 10/dist;
    }
    xPos[i] += xVel[i];  //update the particle positions
    yPos[i] += yVel[i];
    xVel[i] *= 0.995;  // drag
    yVel[i] *= 0.995;
  }
}

function drawFrame() {
  for (i=0;i<birdNumber;i++) {
    px.data[3] = Math.sqrt( Math.pow(xVel[i], 2) + Math.pow(yVel[i], 2) )*25.6;
    context.putImageData( px, xPos[i], yPos[i]); //draw the particles
  }
}

function startListen(event) {               // mouse capture
  setMouse(event);
  canvas.addEventListener('mousemove', setMouse, false);
  mouseDown = true;
}

function stopListen(event) {
  canvas.removeEventListener('mousemove', setMouse, false);
  mouseDown = false;
}

function startListenTouch(event) {               // touch capture
  setMouse(event);
  canvas.removeEventListener('touchmove', setTouch, false);
  mouseDown = true;
}

function stopListenTouch(event) {
  canvas.removeEventListener('touchmove', setTouch, false);
  mouseDown = false;
}

function setMouse(event) {
  mouseX = event.pageX;
  mouseY = event.pageY;
}

function setTouch(event) {
  mouseX = event.touches[0].pageX;
  mouseY = event.touches[0].pageY;
}

function distance(pos1, pos2) {  //currently unused
  return Math.sqrt( Math.pow(xPos[pos1]-xPos[pos2], 2) + Math.pow(yPos[pos1]-yPos[pos2], 2) );
}
