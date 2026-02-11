const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let hole = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  r: 40,
  speed: 4,
};

let keys = {};
let objects = [];

function spawnObjects() {
  objects = [];
  for (let i = 0; i < 80; i++) {
    objects.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 10 + Math.random() * 30,
      eaten: false,
    });
  }
}

spawnObjects();

document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

function moveHole() {
  if (keys["ArrowUp"] || keys["w"]) hole.y -= hole.speed;
  if (keys["ArrowDown"] || keys["s"]) hole.y += hole.speed;
  if (keys["ArrowLeft"] || keys["a"]) hole.x -= hole.speed;
  if (keys["ArrowRight"] || keys["d"]) hole.x += hole.speed;
}

function drawHole() {
  ctx.beginPath();
  ctx.arc(hole.x, hole.y, hole.r, 0, Math.PI * 2);
  ctx.fillStyle = "black";
  ctx.fill();
}

function drawObjects() {
  objects.forEach((o) => {
    if (o.eaten) return;
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
    ctx.fillStyle = "#ccc";
    ctx.fill();
  });
}

function checkEating() {
  objects.forEach((o) => {
    if (o.eaten) return;

    const dx = hole.x - o.x;
    const dy = hole.y - o.y;
    const dist = Math.hypot(dx, dy);

    if (dist < hole.r && o.r < hole.r * 0.9) {
      o.eaten = true;
      hole.r += o.r * 0.15; // growth
    }
  });
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  moveHole();
  drawObjects();
  drawHole();
  checkEating();

  requestAnimationFrame(loop);
}

loop();

document.getElementById("resetBtn").onclick = () => {
  hole.r = 40;
  hole.x = canvas.width / 2;
  hole.y = canvas.height / 2;
  spawnObjects();
};
