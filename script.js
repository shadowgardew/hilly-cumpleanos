const target = new Date("2026-09-14T00:00:00-05:00").getTime();

function updateCountdown() {
  const now = Date.now();
  let diff = target - now;

  if (diff <= 0) {
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    document.querySelector(".eyebrow").textContent = "HOY · 14 DE SEPTIEMBRE · 2026";
    return;
  }

  const days = Math.floor(diff / 86400000);
  diff %= 86400000;
  const hours = Math.floor(diff / 3600000);
  diff %= 3600000;
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

document.getElementById("openLetter").addEventListener("click", () => {
  document.getElementById("letterSection").scrollIntoView({ behavior: "smooth" });
  burstConfetti();
});

const gift = document.getElementById("giftBox");
function openGift() {
  document.getElementById("surpriseMessage").classList.add("show");
  burstConfetti();
  showToast("Sorpresa desbloqueada ❤️");
}
gift.addEventListener("click", openGift);
gift.addEventListener("keydown", e => {
  if (e.key === "Enter" || e.key === " ") openGift();
});

function showToast(text) {
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}

function burstConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  const pieces = Array.from({ length: 110 }, () => ({
    x: innerWidth / 2,
    y: innerHeight * .42,
    vx: (Math.random() - .5) * 12,
    vy: Math.random() * -11 - 4,
    size: Math.random() * 7 + 3,
    rot: Math.random() * 6,
    vr: (Math.random() - .5) * .25,
    life: 1
  }));

  const colors = ["#ff5b83", "#ffd98a", "#ffffff", "#ff8da9", "#b991ff"];

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    pieces.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += .28;
      p.rot += p.vr;
      p.life -= .012;

      if (p.life > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * .65);
        ctx.restore();
      }
    });

    if (alive) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  frame();
}

/* Pequeño efecto de bienvenida */
window.addEventListener("load", () => {
  setTimeout(() => showToast("Esto es para ti, Hilly 🌹"), 900);
});
