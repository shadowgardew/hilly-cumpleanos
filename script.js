const target = new Date("2026-09-14T00:00:00-05:00").getTime();
// Modo secreto de vista previa: solo se activa con ?preview=1
const previewMode = new URLSearchParams(window.location.search).get("preview") === "1";
let unlocked = false;
let attempts = 0;

const teasingMessages = [
  "Alto ahí, curiosa 😭 La carta todavía está sellada.",
  "JAJAJA ¿ya estás intentando romper el sello? 😂",
  "Hilly... el sobre no se abre por insistencia 👀",
  "Esta carta está mejor escondida que la anterior. 😌",
  "🚨 Detectada intrusa intentando abrir correspondencia privada 🚨",
  "JAJAJA paciencia, todavía no te toca. 😭",
  "El sello aguanta... por ahora. 👀",
  "Confirmado: la curiosidad de Hilly no tiene límites 😂"
];

function setCountdown(prefix, diff) {
  let r = Math.max(diff, 0);
  const d = Math.floor(r / 86400000);
  r %= 86400000;
  const h = Math.floor(r / 3600000);
  r %= 3600000;
  const m = Math.floor(r / 60000);
  const s = Math.floor((r % 60000) / 1000);

  document.getElementById(prefix + "Days").textContent = String(d).padStart(2, "0");
  document.getElementById(prefix + "Hours").textContent = String(h).padStart(2, "0");
  document.getElementById(prefix + "Minutes").textContent = String(m).padStart(2, "0");
  document.getElementById(prefix + "Seconds").textContent = String(s).padStart(2, "0");
}

function updateCountdown() {
  if (previewMode) {
    setCountdown("lock", 0);
    setCountdown("hero", 0);
    unlockPage();
    return;
  }

  const diff = target - Date.now();

  if (diff <= 0) {
    setCountdown("lock", 0);
    setCountdown("hero", 0);
    unlockPage();
    return;
  }

  setCountdown("lock", diff);
  setCountdown("hero", diff);
}

function unlockPage() {
  if (unlocked) return;
  unlocked = true;
  document.body.classList.remove("locked");
  document.getElementById("lockScreen").classList.add("hidden");
  document.querySelector(".hero .eyebrow").textContent = "HOY · 14 DE SEPTIEMBRE · 2026";
  showToast("🔓 El sello se ha roto. Feliz cumpleaños, Hilly ✉️");
  burstConfetti();
}

function tryOpen() {
  if (unlocked) return;

  attempts++;
  const msg = teasingMessages[(attempts - 1) % teasingMessages.length];
  document.getElementById("lockMessage").textContent = msg;
  showToast(msg);

  const button = document.getElementById("tryOpen");
  const labels = [
    "Intentar otra vez 😅",
    "A ver si ahora sí... 👀",
    "Seguir intentando 😂",
    "No me rindo ✉️",
    "ROMPER EL SELLO (mentira) 😂"
  ];
  button.textContent = labels[Math.min(attempts - 1, labels.length - 1)];

  const card = document.querySelector(".lock-card");
  card.classList.remove("shake");
  void card.offsetWidth;
  card.classList.add("shake");
}

document.getElementById("tryOpen").addEventListener("click", tryOpen);

document.getElementById("openLetter").addEventListener("click", () => {
  if (!unlocked) {
    tryOpen();
    return;
  }
  document.getElementById("letterSection").scrollIntoView({ behavior: "smooth" });
  burstConfetti();
});

const gift = document.getElementById("giftBox");
function openGift() {
  if (!unlocked) {
    tryOpen();
    return;
  }
  document.getElementById("surpriseMessage").classList.add("show");
  burstConfetti();
  showToast("La última página era para ti ✉️");
}

gift.addEventListener("click", openGift);
gift.addEventListener("keydown", e => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    openGift();
  }
});

function showToast(text) {
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
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

  const colors = ["#8d1f2d", "#d8b06a", "#f7ead1", "#b85b52", "#5e3529"];

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

window.addEventListener("load", () => {
  setTimeout(() => showToast("Hay una carta esperándote, Hilly ✉️"), 900);
});

updateCountdown();
setInterval(updateCountdown, 1000);
