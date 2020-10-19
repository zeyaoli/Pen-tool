const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const { width, height } = canvas;
ctx.fillStyle = "rgb(251,247,242)";
ctx.fillRect(0, 0, width, height);

let penDown = false;

let px, py;

let state = "blank";

document.getElementById("abstract").addEventListener("click", () => {
  if (state == "abstract") {
    state = "blank";
  } else {
    state = "abstract";
  }
});

document.getElementById("color").addEventListener("click", () => {
  if (state == "color") {
    state = "blank";
  } else {
    state = "color";
  }
});

document.getElementById("leaves").addEventListener("click", () => {
  if (state == "leaves") {
    state = "blank";
  } else {
    state = "leaves";
  }
});

document.getElementById("clear").addEventListener("click", () => {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgb(251,247,242)";
  ctx.fillRect(0, 0, width, height);
});

let lineColors = [
  `rgb(36,102,92)`,
  `rgb(205,64,22)`,
  `rgb(0, 0, 0)`,
  `rgb(177,27,22)`,
  `rgb(236,230,121)`,
];

let thickLineColor;

function norm_random(size) {
  return (Math.random() - 0.5) * size;
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function distance(aX, aY, bX, bY) {
  return Math.sqrt(Math.pow(aX - bX, 2) + Math.pow(aY - bY, 2));
}

function abstractBrush(x, y, color) {
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  let thickness = randomRange(2.5, 5);
  if (distance(x, y, px, py) > 30) {
    thickness = randomRange(8, 10);
  }

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.lineWidth = thickness;
  ctx.beginPath();
  ctx.arc(x, y, thickness / 2, 0, Math.PI * 2);
  ctx.fill();
}

function rainbowBrush(x, y) {
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = `hsl(${Math.random() * 360}, 90%, 60%)`;
    ctx.beginPath();
    ctx.arc(
      x - norm_random(50),
      y - norm_random(5),
      Math.random() * 10,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = `hsl(${Math.random() * 360}, 90%, 60%)`;
    ctx.fill();
  }
}

function leaveBrush(x, y) {
  let greenArr = [`hsl(120, 25%, 35%)`, `hsl(119, 30%, 53%)`];
  ctx.beginPath();
  //random chance - either two leaves or one
  if (Math.random() < 0.5) {
    ctx.ellipse(
      x,
      y - norm_random(5),
      randomRange(25, 40),
      randomRange(5, 15),
      randomRange(Math.PI, Math.PI - 0.05),
      0,
      2 * Math.PI
    );
  } else {
    for (let i = 0; i < 2; i++) {
      ctx.ellipse(
        x - norm_random(50),
        y - norm_random(5),
        randomRange(25, 40),
        randomRange(5, 10),
        randomRange(Math.PI + 0.5, Math.PI - 0.5),
        0,
        2 * Math.PI
      );
    }
  }
  // switch colors
  if (Math.random() > 0.4) {
    ctx.fillStyle = greenArr[0];
  } else {
    ctx.fillStyle = greenArr[1];
  }
  ctx.fill();
}

function draw(x, y, thickLineColor) {
  if (state == "abstract") {
    abstractBrush(x, y, thickLineColor);
  } else if (state == "color") {
    rainbowBrush(x, y);
  } else if (state == "leaves") {
    if (distance(x, y, px, py) >= 10) {
      leaveBrush(x, y);
    }
  } else {
    return;
  }
}

function drawStart(x, y) {
  penDown = true;
  px = x;
  py = y;
  thickLineColor = lineColors[Math.floor(Math.random() * lineColors.length)];
  console.log(state);
}

function paintMove(x, y) {
  ctx.beginPath();
  ctx.moveTo(px, py);

  draw(x, y, thickLineColor);

  //   rainbowBrush(x, y);

  //   if (distance(x, y, px, py) >= 20) {
  //     leaveBrush(x, y);
  //   } else {
  //     return;
  //   }

  px = x;
  py = y;
}

function drawEnd(x, y) {
  penDown = false;
  //   ctx.beginPath();
  //   ctx.fillStyle = "none";
  //   ctx.arc(x, y, 20, 0, 2 * Math.PI);
  //   ctx.stroke();
}

canvas.addEventListener("mousedown", (event) => {
  let x = event.clientX;
  let y = event.clientY;
  drawStart(x, y);
});

canvas.addEventListener("touchstart", (event) => {
  let touches = Array.from(event.touches);
  console.log(touches);
  let touch = touches[0];
  let x = touch.clientX;
  let y = touch.clientY;
  drawStart(x, y);
});

canvas.addEventListener("mousemove", (event) => {
  if (penDown == false) {
    return;
  }
  let x = event.clientX;
  let y = event.clientY;
  paintMove(x, y);
});

canvas.addEventListener("touchmove", (event) => {
  event.preventDefault();
  let touches = Array.from(event.touches);
  let touch = touches[0];
  let x = touch.clientX;
  let y = touch.clientY;
  paintMove(x, y);
});

canvas.addEventListener("mouseup", (event) => {
  let x = event.clientX;
  let y = event.clientY;
  drawEnd(x, y);
});

canvas.addEventListener("mouseout", (event) => {
  penDown = false;
});

canvas.addEventListener("touchend", (event) => {
  let touches = Array.from(event.touches);
  let touch = touches[0];
  let x = px;
  let y = py;
  drawEnd(x, y);
});
