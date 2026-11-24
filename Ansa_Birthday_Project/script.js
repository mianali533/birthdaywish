
/* ==========================================
   ANSA - A LITTLE MORE MAGIC
   Premium Birthday Experience
========================================== */

"use strict";

const PASSWORD = "ANSA28";

// ELEMENTS
const intro = document.getElementById("intro");
const celebration = document.getElementById("celebration");
const countdownOverlay = document.getElementById("countdownOverlay");
const countdownNumber = document.getElementById("countdownNumber");

const passwordInput = document.getElementById("secretCode");
const openButton = document.getElementById("openSurprise");
const gateHint = document.getElementById("gateHint");

const giftStage = document.getElementById("giftStage");
const giftMessage = document.getElementById("giftMessage");
const giftModal = document.getElementById("giftModal");
const closeNote = document.getElementById("closeNote");

const cake = document.getElementById("cakeVisual");
const blowButton = document.getElementById("blowCandles");
const cutButton = document.getElementById("cutCake");
const resetButton = document.getElementById("resetCake");

const wishFeedback = document.getElementById("wishFeedback");
const cakeCutMessage = document.getElementById("cakeCutMessage");

const musicToggle = document.getElementById("musicToggle");
const celebrateAgain = document.getElementById("celebrateAgain");
const revealWishes = document.getElementById("revealWishes");

// STATE
let unlocked = false;
let giftOpened = false;
let candlesBlown = false;
let cakeCut = false;
let musicPlaying = false;
let audioContext = null;
let musicTimer = null;
let noteIndex = 0;

const musicNotes = [
  523.25, 659.25, 783.99, 659.25,
  587.33, 698.46, 880, 783.99,
  659.25, 783.99, 987.77, 880
];

/* ==========================================
   PASSWORD UNLOCK
========================================== */

function unlockCelebration() {

  if (unlocked) return;

  const enteredPassword = passwordInput.value.trim();

  if (enteredPassword.toUpperCase() !== PASSWORD) {

    gateHint.textContent = "Oops! That's not the magic code. Try again. 💗";
    gateHint.classList.add("error");

    passwordInput.classList.remove("wrong");

    void passwordInput.offsetWidth;

    passwordInput.classList.add("wrong");

    passwordInput.value = "";
    passwordInput.focus();

    return;
  }

  unlocked = true;

  gateHint.textContent = "The magic is opening... ✨";
  gateHint.classList.remove("error");

  passwordInput.disabled = true;
  openButton.disabled = true;

  startCountdown();
}

openButton.addEventListener("click", unlockCelebration);

passwordInput.addEventListener("keydown", event => {
  if (event.key === "Enter") unlockCelebration();
});

/* ==========================================
   COUNTDOWN
========================================== */

function startCountdown() {

  countdownOverlay.classList.remove("hidden");

  let count = 5;

  countdownNumber.textContent = count;

  const timer = setInterval(() => {

    count--;

    if (count > 0) {

      countdownNumber.textContent = count;

      countdownNumber.style.animation = "none";
      void countdownNumber.offsetWidth;
      countdownNumber.style.animation = "";

    } else {

      clearInterval(timer);

      countdownNumber.textContent = "✨";

      setTimeout(() => {

        countdownOverlay.classList.add("hidden");
        intro.classList.add("hidden");
        celebration.classList.remove("hidden");

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

        startFireworks();
        startFloatingDecorations();
        createConfetti(100);

      }, 700);
    }

  }, 1000);
}

/* ==========================================
   GIFT OPENING
========================================== */

function openGift() {

  if (giftOpened) {
    giftModal.classList.remove("hidden");
    return;
  }

  giftOpened = true;

  giftStage.classList.add("opened");

  giftMessage.classList.remove("hidden");

  giftMessage.textContent =
    "A little surprise, especially for you. 💗";

  createConfetti(35);

  setTimeout(() => {
    giftModal.classList.remove("hidden");
  }, 650);
}

giftStage.addEventListener("click", openGift);

giftStage.addEventListener("keydown", event => {

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openGift();
  }

});

closeNote.addEventListener("click", () => {

  giftModal.classList.add("hidden");

  document.getElementById("cake").scrollIntoView({
    behavior: "smooth"
  });

});

giftModal.addEventListener("click", event => {

  if (event.target === giftModal) {
    giftModal.classList.add("hidden");
  }

});

/* ==========================================
   BLOW OUT CANDLES
========================================== */

blowButton.addEventListener("click", () => {

  if (candlesBlown) {
    wishFeedback.textContent =
      "Your wish is already flying into the universe! 💗";
    return;
  }

  candlesBlown = true;

  cake.classList.add("blown");

  wishFeedback.textContent =
    "Your wish has been released into the universe! ✨";

  createConfetti(45);

  launchFirework(
    window.innerWidth / 2,
    window.innerHeight / 2
  );

});

/* ==========================================
   CAKE CUTTING
========================================== */

cutButton.addEventListener("click", () => {

  if (!candlesBlown) {

    wishFeedback.textContent =
      "First, blow out the candles and make a wish! 🕯️";

    return;
  }

  if (cakeCut) {

    wishFeedback.textContent =
      "The birthday cake is already cut. Enjoy your slice! 🍰";

    return;
  }

  cakeCut = true;

  cake.classList.add("cut");

  cakeCutMessage.classList.remove("hidden");

  wishFeedback.textContent =
    "One beautiful wish, one sweet birthday, and endless happiness! 💗";

  createConfetti(100);

  launchFirework(
    window.innerWidth * .5,
    window.innerHeight * .45
  );

});

/* ==========================================
   RESET CAKE
========================================== */

resetButton.addEventListener("click", () => {

  candlesBlown = false;
  cakeCut = false;

  cake.classList.remove("blown", "cut");

  cakeCutMessage.classList.add("hidden");

  wishFeedback.textContent =
    "Your birthday cake is ready for another magical moment! ✨";

});

/* ==========================================
   BIRTHDAY WISH REVEAL
========================================== */

revealWishes.addEventListener("click", () => {

  document.getElementById("wish").scrollIntoView({
    behavior: "smooth"
  });

  createConfetti(25);

});

/* ==========================================
   INTERACTIVE WISH WALL
========================================== */

document.querySelectorAll(".wish-wall-card").forEach(card => {

  card.addEventListener("click", () => {

    const wasRevealed = card.classList.contains("revealed");

    document.querySelectorAll(".wish-wall-card").forEach(item => {
      item.classList.remove("revealed");
    });

    if (!wasRevealed) {

      card.classList.add("revealed");

      card.querySelector("b").textContent =
        card.dataset.wish;

      createConfetti(12);
    }

  });

});

/* ==========================================
   PARTICLES
========================================== */

const particleCanvas = document.getElementById("particles");
const particleCtx = particleCanvas.getContext("2d");

let particles = [];

function resizeCanvas() {

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  particleCanvas.width = window.innerWidth * dpr;
  particleCanvas.height = window.innerHeight * dpr;

  particleCanvas.style.width = window.innerWidth + "px";
  particleCanvas.style.height = window.innerHeight + "px";

  particleCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

class Particle {

  constructor() {
    this.reset(true);
  }

  reset(initial = false) {

    this.x = Math.random() * window.innerWidth;

    this.y = initial
      ? Math.random() * window.innerHeight
      : window.innerHeight + 10;

    this.size = Math.random() * 2 + .5;
    this.speed = Math.random() * .5 + .15;
    this.opacity = Math.random() * .7 + .2;
    this.phase = Math.random() * 6.28;

  }

  update(time) {

    this.y -= this.speed;

    this.x += Math.sin(time * .001 + this.phase) * .25;

    if (this.y < -10) this.reset();

  }

  draw() {

    particleCtx.beginPath();

    particleCtx.arc(
      this.x,
      this.y,
      this.size,
      0,
      Math.PI * 2
    );

    particleCtx.fillStyle =
      `rgba(255,190,224,${this.opacity})`;

    particleCtx.shadowBlur = 12;
    particleCtx.shadowColor = "#ff91ca";

    particleCtx.fill();

    particleCtx.shadowBlur = 0;

  }

}

for (let i = 0; i < 90; i++) {
  particles.push(new Particle());
}

function animateParticles(time) {

  particleCtx.clearRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );

  particles.forEach(particle => {

    particle.update(time);
    particle.draw();

  });

  requestAnimationFrame(animateParticles);

}

requestAnimationFrame(animateParticles);

/* ==========================================
   FALLING PETALS & HEARTS
========================================== */

function createFloatingItem(container, symbol, className) {

  const item = document.createElement("span");

  item.className = className;
  item.textContent = symbol;

  item.style.left = Math.random() * 100 + "%";

  item.style.animationDuration =
    (Math.random() * 5 + 7) + "s";

  item.style.fontSize =
    (Math.random() * 12 + 12) + "px";

  container.appendChild(item);

  setTimeout(() => item.remove(), 13000);

}

function startFloatingDecorations() {

  const petalLayer = document.getElementById("petalLayer");
  const heartLayer = document.getElementById("heartLayer");

  setInterval(() => {

    createFloatingItem(
      petalLayer,
      ["✿", "❀", "✧"][Math.floor(Math.random() * 3)],
      "petal"
    );

    if (Math.random() > .5) {

      createFloatingItem(
        heartLayer,
        "♡",
        "floating-heart"
      );

    }

  }, 900);

}

/* ==========================================
   CONFETTI
========================================== */

function createConfetti(amount = 60) {

  const symbols = ["✦", "✧", "♥", "✿", "✨"];

  for (let i = 0; i < amount; i++) {

    const confetti = document.createElement("span");

    confetti.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    confetti.style.position = "fixed";
    confetti.style.zIndex = "150";
    confetti.style.pointerEvents = "none";

    confetti.style.left =
      Math.random() * 100 + "vw";

    confetti.style.top = "-30px";

    confetti.style.color =
      ["#ff91ca", "#f5d28a", "#fff", "#bd8aff"][
        Math.floor(Math.random() * 4)
      ];

    confetti.style.fontSize =
      (Math.random() * 17 + 10) + "px";

    document.body.appendChild(confetti);

    const duration = Math.random() * 2200 + 1800;

    const animation = confetti.animate([

      {
        transform: "translateY(0) rotate(0deg)",
        opacity: 1
      },

      {
        transform:
          `translate(${Math.random() * 200 - 100}px, ${window.innerHeight + 100}px) rotate(${Math.random() * 1000}deg)`,
        opacity: 0
      }

    ], {

      duration,
      easing: "cubic-bezier(.2,.7,.3,1)"

    });

    animation.onfinish = () => confetti.remove();

  }

}

/* ==========================================
   FIREWORKS
========================================== */

const fireworksCanvas = document.getElementById("fireworks");
const fireworksCtx = fireworksCanvas.getContext("2d");

let fireworks = [];
let fireworkParticles = [];

function resizeFireworks() {

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  fireworksCanvas.width = window.innerWidth * dpr;
  fireworksCanvas.height = window.innerHeight * dpr;

  fireworksCanvas.style.width = window.innerWidth + "px";
  fireworksCanvas.style.height = window.innerHeight + "px";

  fireworksCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

}

resizeFireworks();

window.addEventListener("resize", resizeFireworks);

class Firework {

  constructor(x, y) {

    this.x = x;
    this.y = window.innerHeight;

    this.targetY = y;
    this.speed = 7 + Math.random() * 3;
    this.exploded = false;

  }

  update() {

    this.y -= this.speed;

    if (this.y <= this.targetY) {

      this.exploded = true;

      explodeFirework(this.x, this.y);

    }

  }

  draw() {

    fireworksCtx.beginPath();

    fireworksCtx.arc(
      this.x,
      this.y,
      3,
      0,
      Math.PI * 2
    );

    fireworksCtx.fillStyle = "#ffe4a3";
    fireworksCtx.fill();

  }

}

class Spark {

  constructor(x, y, color) {

    this.x = x;
    this.y = y;

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 1;

    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.alpha = 1;
    this.color = color;
    this.gravity = .045;

  }

  update() {

    this.x += this.vx;
    this.y += this.vy;

    this.vy += this.gravity;

    this.vx *= .99;
    this.vy *= .99;

    this.alpha -= .012;

  }

  draw() {

    fireworksCtx.globalAlpha = Math.max(0, this.alpha);

    fireworksCtx.fillStyle = this.color;

    fireworksCtx.beginPath();

    fireworksCtx.arc(
      this.x,
      this.y,
      2,
      0,
      Math.PI * 2
    );

    fireworksCtx.fill();

    fireworksCtx.globalAlpha = 1;

  }

}

function explodeFirework(x, y) {

  const colors = [
    "#ff8fc9",
    "#f5d28a",
    "#ffffff",
    "#c69aff",
    "#ffb6d9"
  ];

  const color = colors[
    Math.floor(Math.random() * colors.length)
  ];

  for (let i = 0; i < 65; i++) {

    fireworkParticles.push(
      new Spark(x, y, color)
    );

  }

}

function launchFirework(x, y) {

  fireworks.push(
    new Firework(x, y)
  );

}

function animateFireworks() {

  fireworksCtx.clearRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );

  fireworks.forEach((firework, index) => {

    firework.update();
    firework.draw();

    if (firework.exploded) {
      fireworks.splice(index, 1);
    }

  });

  fireworkParticles.forEach((spark, index) => {

    spark.update();
    spark.draw();

    if (spark.alpha <= 0) {
      fireworkParticles.splice(index, 1);
    }

  });

  requestAnimationFrame(animateFireworks);

}

requestAnimationFrame(animateFireworks);

function startFireworks() {

  const launchInterval = setInterval(() => {

    launchFirework(
      Math.random() * window.innerWidth,
      Math.random() * window.innerHeight * .55
    );

  }, 1200);

  setTimeout(() => {
    clearInterval(launchInterval);
  }, 12000);

}

/* ==========================================
   BACKGROUND MUSIC
   Original synthesized melody
========================================== */

function playNote(frequency, duration = .55) {

  if (!audioContext) {

    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    audioContext = new AudioContextClass();

  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  gain.gain.setValueAtTime(.0001, audioContext.currentTime);

  gain.gain.exponentialRampToValueAtTime(
    .055,
    audioContext.currentTime + .08
  );

  gain.gain.exponentialRampToValueAtTime(
    .0001,
    audioContext.currentTime + duration
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();

  oscillator.stop(audioContext.currentTime + duration);

}

function startMusic() {

  if (musicPlaying) return;

  musicPlaying = true;

  musicToggle.classList.add("playing");
  musicToggle.innerHTML = "♫ <span>Music playing</span>";

  playNote(musicNotes[noteIndex++ % musicNotes.length]);

  musicTimer = setInterval(() => {

    if (!musicPlaying) return;

    playNote(musicNotes[noteIndex++ % musicNotes.length]);

  }, 600);

}

function stopMusic() {

  musicPlaying = false;

  clearInterval(musicTimer);

  musicToggle.classList.remove("playing");
  musicToggle.innerHTML = "♫ <span>Play music</span>";

}

musicToggle.addEventListener("click", () => {

  if (musicPlaying) {
    stopMusic();
  } else {
    startMusic();
  }

});

document.addEventListener("visibilitychange", () => {

  if (document.hidden && musicPlaying) {
    stopMusic();
  }

});

/* ==========================================
   SCROLL REVEAL
========================================== */

const revealElements = document.querySelectorAll(
  ".section-heading, .message-card, .wish-card, .wish-wall-card, .finale"
);

revealElements.forEach(element => {
  element.classList.add("reveal");
});

const revealObserver = new IntersectionObserver(entries => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {

      entry.target.classList.add("visible");

      revealObserver.unobserve(entry.target);

    }

  });

}, {

  threshold: .12

});

revealElements.forEach(element => {
  revealObserver.observe(element);
});

/* ==========================================
   CELEBRATE AGAIN
========================================== */

celebrateAgain.addEventListener("click", () => {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  createConfetti(100);

  startFireworks();

});

/* ==========================================
   INITIALIZATION
========================================== */

console.log(
  "%c ✨ A LITTLE MORE MAGIC — MADE FOR ANSA ✨ ",
  "color:#ff91ca;font-size:16px;font-weight:bold;"
);

