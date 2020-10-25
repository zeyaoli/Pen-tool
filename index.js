const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 800;
const { width, height } = canvas;

const bgImg = new Image();
bgImg.src = "./test.jpg";
ctx.fillStyle = "rgb(251,247,242)";
ctx.fillRect(0, 0, width, height);
bgImg.onload = function () {
  ctx.drawImage(bgImg, 0, 0, width, height);
};

let penDown = false;

let px, py;

let state = "blank";

let blankText = document.getElementById("blank");
let autumnBtn = document.getElementById("autumnLeaves");
let dirtBtn = document.getElementById("dirt");
let leavesBtn = document.getElementById("leaves");

function resetButtonStyles() {
  Array.from(document.getElementsByClassName("tool-button")).forEach(
    (button) => {
      button.classList.remove("active");
      button.style.borderWidth = "1px";
    }
  );
}

function activeBtn(ele) {
  ele.classList.add("active");
  Array.from(document.getElementsByClassName("active")).forEach((activeBtn) => {
    activeBtn.style.borderWidth = "3px";
  });
}

resetButtonStyles();

autumnBtn.addEventListener("click", () => {
  if (state == "autumn") {
    state = "blank";
  } else {
    state = "autumn";
    blankText.style.display = "none";
    resetButtonStyles();
    activeBtn(autumnBtn);
  }
});

dirtBtn.addEventListener("click", () => {
  if (state == "dirt") {
    state = "blank";
  } else {
    state = "dirt";
    blankText.style.display = "none";
    resetButtonStyles();
    activeBtn(dirtBtn);
  }
});

leavesBtn.addEventListener("click", () => {
  if (state == "leaves") {
    state = "blank";
  } else {
    state = "leaves";
    blankText.style.display = "none";
    resetButtonStyles();
    activeBtn(leavesBtn);
  }
});

document.getElementById("clear").addEventListener("click", () => {
  state = "blank";
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgb(251,247,242)";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bgImg, 0, 0, width, height);

  blankText.style.display = "flex";
  resetButtonStyles();
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

function getMousePos(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function autumnBrush(x, y, color) {
  let autumnPalette = [`#FF6034`, `#FF9828`, `#FFDB31`, `#D9D32F`];
  ctx.beginPath();
  //random chance - either two leaves or one
  if (distance(x, y, px, py) > 15) {
    if (Math.random() < 0.5) {
      ctx.ellipse(
        x,
        y - norm_random(5),
        randomRange(15, 30),
        randomRange(5, 10),
        randomRange(Math.PI, Math.PI - 0.05),
        0,
        2 * Math.PI
      );
    } else {
      for (let i = 0; i < 3; i++) {
        ctx.ellipse(
          x - norm_random(50),
          y - norm_random(5),
          randomRange(10, 20),
          randomRange(5, 10),
          randomRange(Math.PI + 0.5, Math.PI - 0.5),
          0,
          2 * Math.PI
        );
      }
    }
  }
  // switch colors
  ctx.fillStyle =
    autumnPalette[Math.floor(Math.random() * autumnPalette.length)];
  ctx.fill();
}

function dirtBrush(x, y) {
  for (let i = 0; i < 100; i++) {
    ctx.fillStyle = `hsl(${randomRange(20, 35)}, ${randomRange(
      45,
      65
    )}%, ${randomRange(20, 45)}%)`;
    ctx.beginPath();
    ctx.arc(
      x - norm_random(50),
      y - norm_random(50),
      Math.random() * 0.2,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = `hsl(${randomRange(20, 35)}, ${randomRange(
      45,
      65
    )}%, ${randomRange(20, 45)}%)`;
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

function draw(x, y) {
  if (state == "autumn") {
    autumnBrush(x, y);
  } else if (state == "dirt") {
    dirtBrush(x, y);
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
  // thickLineColor = lineColors[Math.floor(Math.random() * lineColors.length)];
  //   console.log(state);
}

function paintMove(x, y) {
  ctx.beginPath();
  ctx.moveTo(px, py);

  draw(x, y);

  px = x;
  py = y;
}

function drawEnd(x, y) {
  penDown = false;
}

canvas.addEventListener("mousedown", (event) => {
  let pos = getMousePos(canvas, event);
  let x = pos.x;
  let y = pos.y;
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
  let pos = getMousePos(canvas, event);
  let x = pos.x;
  let y = pos.y;
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
  let pos = getMousePos(canvas, event);
  let x = pos.x;
  let y = pos.y;
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

// function rainbowBrush(x, y) {
//     for (let i = 0; i < 10; i++) {
//       ctx.fillStyle = `hsl(${Math.random() * 360}, 90%, 60%)`;
//       ctx.beginPath();
//       ctx.arc(
//         x - norm_random(50),
//         y - norm_random(5),
//         Math.random() * 10,
//         0,
//         2 * Math.PI
//       );
//       ctx.fillStyle = `hsl(${Math.random() * 360}, 90%, 60%)`;
//       ctx.fill();
//     }
//   }

// function abstractBrush(x, y, color) {
//   ctx.beginPath();
//   ctx.moveTo(px, py);
//   ctx.fillStyle = color;
//   ctx.strokeStyle = color;
//   let thickness = randomRange(2.5, 4.5);
//   if (distance(x, y, px, py) > 30) {
//     thickness = randomRange(6, 8);
//   }

//   ctx.lineTo(x, y);
//   ctx.stroke();
//   ctx.lineWidth = thickness;
//   ctx.beginPath();
//   ctx.arc(x, y, thickness / 2, 0, Math.PI * 2);
//   ctx.fill();
// }
