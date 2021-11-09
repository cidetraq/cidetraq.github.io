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
  frequency_array,
  circle,
  audioIsPlaying,
  pauseSVG,
  playSVG;
bars = 200;
bar_width = 2;

//setup analyser
audio = new Audio();
context = new (window.AudioContext || window.webkitAudioContext)();
analyser = context.createAnalyser();
audio.crossOrigin = "anonymous";
audio.src = "weirdmon.mp3";
source = context.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(context.destination);
frequency_array = new Uint8Array(analyser.frequencyBinCount);
audioIsPlaying = false;
//setup canvas
canvas = document.getElementById("visualizer");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx = canvas.getContext("2d");

// var xml = new XMLSerializer().serializeToString(pauseSVG);
// // make it base64
// var svg64 = btoa(xml);
// var b64Start = "data:image/svg+xml;base64,";

// // prepend a "header"
// var image64 = b64Start + svg64;

// // set it as the source of the img element
// var pauseImage = new Image();
// pauseImage.src = image64;
// ctx.drawImage(pauseImage, center_x, center_y);

//setup touch listener
canvas.addEventListener("touchstart", clickInCanvas);
// setup mouse listener
canvas.addEventListener("click", clickInCanvas);

function play() {
  audio.play();
}

function animationLooper() {
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

  //draw pause button
  pauseSVG = new Image();
  pauseSVG.src = "pause-fill.svg";
  var path1 = new Path2D(
    "M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"
  );
  ctx.translate(center_x - radius, center_y - radius);
  ctx.scale(10, 10);
  ctx.stroke(path1);
  ctx.translate(-center_x + radius, -center_y + radius);
  ctx.scale(0.1, 0.1);

  //analyzer
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

function drawBar(x1, y1, x2, y2, width, frequency) {
  var lineColor = "rgb(" + frequency + ", " + frequency + ", " + 205 + ")";
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function clickInCanvas(event) {
  const res = getClickTapPos(event);
  if (!audioIsPlaying) {
    if (isInside(res.pos, res.rect)) {
      play();
      audioIsPlaying = true;
    } else {
      console.log("point not inside inner circle.");
    }
  } else {
  }
}

//Function to get the mouse / tap position
function getClickTapPos(event) {
  var rect = canvas.getBoundingClientRect();
  var x, y;
  if (event.changedTouches) {
    event.preventDefault();
    x = event.changedTouches[0].clientX - rect.left;
    y = event.changedTouches[0].clientY - rect.left;
  } else {
    x = event.clientX - rect.left;
    y = event.clientY - rect.left;
  }
  pos = { x, y };
  return { pos, rect };
}

//Function to check whether a point is inside a rectangle (NOT USED)
function isInside(pos, rect) {
  return (
    pos.x > rect.x &&
    pos.x < rect.x + rect.width &&
    pos.y < rect.y + rect.height &&
    pos.y > rect.y
  );
}

// //SVG

// var svg = document.querySelector("svg");
// var img = document.querySelector("img");

// // get svg data
// var xml = new XMLSerializer().serializeToString(svg);

// // make it base64
// var svg64 = btoa(xml);
// var b64Start = "data:image/svg+xml;base64,";

// // prepend a "header"
// var image64 = b64Start + svg64;

// // set it as the source of the img element
// img.src = image64;

// // draw the image onto the canvas
