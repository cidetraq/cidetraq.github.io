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
  pauseSVG,
  playSVG;
bars = 200;
bar_width = 2;

function setup() {
  //setup analyser
  audio = new Audio();
  audio.volume = 0.1;
  context = new (window.AudioContext || window.webkitAudioContext)();
  analyser = context.createAnalyser();
  audio.crossOrigin = "anonymous";
  audio.src = "weirdmon.mp3";
  source = context.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(context.destination);
  frequency_array = new Uint8Array(analyser.frequencyBinCount);

  //setup canvas
  canvas = document.getElementById("visualizer");
  canvas.width = window.innerWidth;
  isMobile = canvas.width < 500;
  ch = isMobile ? window.innerHeight / 2 : window.innerHeight;
  ctx = canvas.getContext("2d");

  //setup pausePlayButton
  var pausePlayButton = document.getElementById("pausePlayButton");
  center_x = canvas.width / 2;
  center_y = canvas.height / 2;
  radiusResponsiveDivisor = isMobile ? 5 : 10;
  radius = canvas.width / radiusResponsiveDivisor;
  pausePlayButton.width = Math.floor(radius);
  pausePlayButton.height = Math.floor(radius);
  var offset = Math.sqrt(radius ** 2 + radius ** 2);
  var top = center_y + canvas.height / 10 - radius / 2;
  var left = center_x - canvas.width / 10 + radius / 2;
  animationLooper();
}

function play() {
  if (audio.paused) {
    pausePlayButton.src = "pause-fill.svg";
    audio.play();
  } else {
    pausePlayButton.src = "play-fill.svg";
    audio.pause();
  }
}

function animationLooper() {
  canvas = document.getElementById("visualizer");
  canvas.width = window.innerWidth;
  canvas.height = ch;
  ctx = canvas.getContext("2d");
  // find the center of the window
  center_x = canvas.width / 2;
  center_y = canvas.height / 2;
  radius = canvas.width / radiusResponsiveDivisor;
  //draw a circle
  circle = new Path2D();
  circle.arc(center_x, center_y, radius, 0, 2 * Math.PI);
  var lineColor = "#ffffff";
  ctx.strokeStyle = lineColor;
  ctx.stroke(circle);

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
  // ctx.drawImage(img, 0, 0);
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
  if (!audio.play) {
    if (isInside(res.pos, res.rect)) {
      play();
      audio.play = true;
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
