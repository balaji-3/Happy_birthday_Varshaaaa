const enterBtn = document.getElementById('enterBtn');
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
const overlay = document.getElementById('transitionOverlay');
const sections = document.querySelectorAll('.section');

let currentSection = 0;
let musicPlaying = false;
let balloonsStarted = false;


// SECTION SWITCH
function goToSection(index) {
  if (!sections[index]) return;

  sections.forEach(section => {
    section.classList.remove('active', 'exit', 'animate');
  });

  sections[index].classList.add('active');
  currentSection = index;

  // Phase 2 animation trigger
  if (index === 1) {
    const wishSection = document.getElementById('wishSection');
    wishSection.classList.remove('animate');
    void wishSection.offsetWidth; // force reflow
    wishSection.classList.add('animate');
  }

  // Phase 3 start balloons ONCE
  if (index === 2 && !balloonsStarted) {
    balloonsStarted = true;
    startBalloons();
  }
}



// ENTER BUTTON
if (enterBtn) {
  enterBtn.addEventListener('click', () => {
    enterBtn.innerText = '…';
    enterBtn.style.pointerEvents = 'none';

    overlay.classList.add('active');

    setTimeout(() => {
      goToSection(1);
    }, 1000);

    setTimeout(() => {
      overlay.classList.remove('active');
    }, 2000);
  });
}

// AUDIO STATE
let audioUnlocked = false;

// UNLOCK AUDIO
function unlockAudio() {
  if (!audioUnlocked) {
    bgMusic.volume = 0.5;
    bgMusic.play().then(() => {
      bgMusic.pause();
      audioUnlocked = true;
    }).catch(() => {});
  }
}

// UNLOCK ON FIRST USER ACTION
if (enterBtn) {
  enterBtn.addEventListener('click', unlockAudio);
}

// MUSIC TOGGLE WITH VISUAL STATE
if (musicToggle && bgMusic) {
  musicToggle.addEventListener('click', () => {

    if (!audioUnlocked) {
      unlockAudio();
      return;
    }

    if (!musicPlaying) {
      bgMusic.play();
      musicToggle.innerText = '⏸';
      musicToggle.classList.remove('paused');
      musicToggle.classList.add('playing');
    } else {
      bgMusic.pause();
      musicToggle.innerText = '🎵';
      musicToggle.classList.remove('playing');
      musicToggle.classList.add('paused');
    }

    musicPlaying = !musicPlaying;
  });
}


// FIREFLIES (SAFE)
const fireflyContainer = document.querySelector('.fireflies');

if (fireflyContainer) {
  for (let i = 0; i < 12; i++) {
    const firefly = document.createElement('span');
    firefly.style.left = Math.random() * 100 + '%';
    firefly.style.top = Math.random() * 100 + '%';
    firefly.style.animationDelay = Math.random() * 8 + 's';
    fireflyContainer.appendChild(firefly);
  }
}

/* PHASE 3 – BALLOONS */

const balloonContainer = document.querySelector('.balloon-container');
const balloonOverlay = document.querySelector('.balloon-overlay');
const balloonText = document.getElementById('balloonText');

const balloonMessages = [
  "Some people make silence feel safe.",
  "You are softer than you realize, and stronger than you think.",
  "There’s warmth in the way you exist.",
  "Someone is quietly grateful you exist today.",
  "You deserve a love that never rushes you."
];

function createBalloon() {
  // POSITION WRAPPER
  const wrapper = document.createElement('div');
  wrapper.className = 'balloon-wrapper';

  // ACTUAL BALLOON
  const balloon = document.createElement('div');
  balloon.className = 'balloon';

  wrapper.appendChild(balloon);
  balloonContainer.appendChild(wrapper);

  const startX = Math.random() * 85;
  let posY = window.innerHeight + 80;
  const speed = 0.25 + Math.random() * 0.25;

  wrapper.style.left = startX + '%';
  wrapper.style.transform = `translateY(${posY}px)`;

  let floating = true;

  function float() {
    if (!floating) return;

    posY -= speed;
    wrapper.style.transform = `translateY(${posY}px)`;

    if (posY > -120) {
      requestAnimationFrame(float);
    } else {
      wrapper.remove();
    }
  }

  requestAnimationFrame(float);

  balloon.addEventListener('click', () => {
    if (!floating) return;
    floating = false;

    balloon.classList.add('pop');

    const msg =
      balloonMessages[Math.floor(Math.random() * balloonMessages.length)];

    setTimeout(() => {
      wrapper.remove();
      showBalloonMessage(msg);
    }, 480);
  });
}



function startBalloons() {
  balloonContainer.innerHTML = '';

  // Spawn immediately
  createBalloon();
  createBalloon();

  // Then stagger next ones
  setTimeout(createBalloon, 800);
  setTimeout(createBalloon, 1600);

  // Continuous spawn
  setInterval(createBalloon, 4200);
}


// EXIT MESSAGE WITH ANIMATION
balloonOverlay.addEventListener('click', () => {
  balloonOverlay.classList.remove('show');
  balloonOverlay.classList.add('hide');

  setTimeout(() => {
    balloonOverlay.classList.add('hidden');
  }, 600);
});

function showBalloonMessage(msg) {
  balloonText.innerText = msg;
  balloonOverlay.classList.remove('hidden', 'hide');
  balloonOverlay.classList.add('show');
}


// PHASE 2 → PHASE 3 NAVIGATION
const toBalloons = document.getElementById('toBalloons');

if (toBalloons) {
  toBalloons.addEventListener('click', () => {
    const current = sections[currentSection];
    current.classList.add('exit');
    overlay.classList.add('active');

    setTimeout(() => {
      current.classList.remove('exit');
      goToSection(2);
    }, 900);

    setTimeout(() => {
      overlay.classList.remove('active');
    }, 1800);
  });
}

