// https://www.kkhaydarov.com/audio-visualizer/
var canvas,
  ctx,
  center_x,
  center_y,
  radius,
  bars,
  x_end,
  y_end,
  bar_height,
  bar_width,
  frequency_array;
bars = 200;
bar_width = 2;

//setup
audio = new Audio();
context = new (window.AudioContext || window.webkitAudioContext)();
analyser = context.createAnalyser();
audio.crossOrigin = "anonymous";
audio.src = "weirdmon.mp3";
source = context.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(context.destination);
frequency_array = new Uint8Array(analyser.frequencyBinCount);

function play() {
  audio.play();
}

function setScreenGradient() {
  // set to the size of device
  canvas = document.documentElement;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");
  // find the center of the window
  center_x = canvas.width / 2;
  center_y = canvas.height / 2;
  radius = canvas.width / 10;
  // style the background
  var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "rgba(35, 7, 77, 1)");
  gradient.addColorStop(1, "rgba(204, 83, 51, 1)");
  ctx.fillStyle = gradient;
}

let circle;

function animationLooper() {
  // setScreenGradient();
  // set to the size of device
  canvas = document.getElementById("visualizer");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");
  // find the center of the window
  center_x = canvas.width / 2;
  center_y = canvas.height / 2;
  radius = canvas.width / 10;

  //draw a circle
  circle = new Path2D();
  circle.arc(center_x, center_y, radius, 0, 2 * Math.PI);
  var lineColor = "#ffffff";
  ctx.strokeStyle = lineColor;
  ctx.stroke(circle);

  analyser.getByteFrequencyData(frequency_array);
  for (var i = 0; i < bars; i++) {
    //divide a circle into equal parts
    rads = (Math.PI * 2) / bars;
    bar_height = frequency_array[i] * 0.007 * radius;
    // set coordinates
    x = center_x + Math.cos(rads * i) * radius;
    y = center_y + Math.sin(rads * i) * radius;
    x_end = center_x + Math.cos(rads * i) * (radius + bar_height);
    y_end = center_y + Math.sin(rads * i) * (radius + bar_height);
    //draw a bar
    drawBar(x, y, x_end, y_end, bar_width, frequency_array[i]);
  }
  window.requestAnimationFrame(animationLooper);
}
// for drawing a bar
function drawBar(x1, y1, x2, y2, width, frequency) {
  var lineColor = "rgb(" + frequency + ", " + frequency + ", " + 205 + ")";
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

//Function to get the mouse position
function getMousePos(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}
//Function to check whether a point is inside a rectangle
function isInside(pos, rect) {
  return (
    pos.x > rect.x &&
    pos.x < rect.x + rect.width &&
    pos.y < rect.y + rect.height &&
    pos.y > rect.y
  );
}

function clickInCanvas() {
  var visualizer = document.getElementById("visualizer");
  const { x, y } = getMousePos(visualizer, event);
  if (ctx.isPointInPath(circle, x, y)) {
    play();
  } else {
    console.log("point not inside inner circle.");
  }
}
// //Binding the click event on the canvas
// canvas.addEventListener(
//   "click",
//   function (evt) {
//     var mousePos = getMousePos(canvas, evt);

//     if (isInside(mousePos, rect)) {
//       alert("clicked inside rect");
//     } else {
//       alert("clicked outside rect");
//     }
//   },
//   false
// );
