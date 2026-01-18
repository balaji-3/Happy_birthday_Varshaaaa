/* =====================================================
   BASIC ELEMENTS
===================================================== */
const enterBtn = document.getElementById('enterBtn');
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
const overlay = document.getElementById('transitionOverlay');
const sections = document.querySelectorAll('.section');


let currentSection = 0;
let musicPlaying = false;
let audioUnlocked = false;
let journeyCompleted = false;


/* =====================================================
   SECTION SWITCHING
===================================================== */
function goToSection(index) {
  if (!sections[index]) return;

  // Stop balloons if leaving Phase 3
  if (currentSection === 2 && balloonInterval) {
    clearInterval(balloonInterval);
    balloonInterval = null;
  }

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

  // Phase 3 start balloons
  if (index === 2) {
    startBalloons();
  }

    // Mark journey complete when Phase 5 is reached
  if (index === 4) {
      journeyCompleted = true;
  }

  updatePhaseNav();

}

/* =====================================================
   ENTER BUTTON (PHASE 1 → PHASE 2)
===================================================== */
if (enterBtn) {
  enterBtn.addEventListener('click', () => {
    enterBtn.innerText = '…';
    enterBtn.style.pointerEvents = 'none';

    overlay.classList.add('active');

    unlockAudio();

    setTimeout(() => {
      goToSection(1);
    }, 1000);

    setTimeout(() => {
      overlay.classList.remove('active');
    }, 2000);
  });
}

/* =====================================================
   AUDIO CONTROL
===================================================== */
function unlockAudio() {
  if (!audioUnlocked && bgMusic) {
    bgMusic.volume = 0.5;
    bgMusic.play().then(() => {
      bgMusic.pause();
      audioUnlocked = true;
    }).catch(() => {});
  }
}

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

/* =====================================================
   FIREFLIES (PHASE 2)
===================================================== */
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

/* =====================================================
   PHASE 3 — BALLOONS
===================================================== */
const balloonContainer = document.querySelector('.balloon-container');
const balloonOverlay = document.querySelector('.balloon-overlay');
const balloonText = document.getElementById('balloonText');
let allBalloonMessagesShown = false;


let balloonInterval = null;
let currentBalloonMessageIndex = 0;

const balloonMessages = [
  "Being you is already enough.",
  "You matter more than you probably realize.",
  "A lot of who i'm today is because of you.",
  "Someone is quietly grateful you exist today.Literally me...",
  "You deserve a love that never rushes you."
];

/* CREATE ONE BALLOON */
function createBalloon() {
  const wrapper = document.createElement('div');
  wrapper.className = 'balloon-wrapper';

  const balloon = document.createElement('div');
  balloon.className = 'balloon';

  wrapper.appendChild(balloon);
  balloonContainer.appendChild(wrapper);

  const startX = Math.random() * 70 + 10; // keep balloons inside screen
  let posY = window.innerHeight + 80 + Math.random() * 120;
  const speed = 0.8 + Math.random() * 0.6;

  wrapper.style.left = startX + '%';
  wrapper.style.transform = `translateY(${posY}px)`;

  let floating = true;

  function float() {
    if (!floating) return;

    posY -= speed;
    wrapper.style.transform = `translateY(${posY}px)`;

    if (posY > -window.innerHeight - 200) {
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

    const msg = balloonMessages[currentBalloonMessageIndex];

    currentBalloonMessageIndex++;

    if (currentBalloonMessageIndex >= balloonMessages.length) {
      currentBalloonMessageIndex = balloonMessages.length - 1;
      allBalloonMessagesShown = true;
    }


    setTimeout(() => {
      wrapper.remove();
      showBalloonMessage(msg);
    }, 450);
  });
}

/* START BALLOONS */
const isMobile = window.innerWidth < 768;
function startBalloons() {
  currentBalloonMessageIndex = 0;
  balloonContainer.innerHTML = '';

  if (balloonInterval) {
    clearInterval(balloonInterval);
    balloonInterval = null;
  }

   // Fewer balloons on mobile
    const initialCount = isMobile ? 2 : 3;

    for (let i = 0; i < initialCount; i++) {
      createBalloon();
    }

    balloonInterval = setInterval(() => {
      createBalloon();
    }, isMobile ? 3600 : 2800);

  // Immediate spawn
  createBalloon();
  createBalloon();
  createBalloon();

  balloonInterval = setInterval(() => {
    createBalloon();
  }, 2800);
}

/* MESSAGE OVERLAY */
function showBalloonMessage(msg) {
  balloonText.innerText = msg;
  balloonOverlay.classList.remove('hidden', 'hide');
  balloonOverlay.classList.add('show');
}

if (balloonOverlay) {
  balloonOverlay.addEventListener('click', () => {
    balloonOverlay.classList.remove('show');
    balloonOverlay.classList.add('hide');

    setTimeout(() => {
      balloonOverlay.classList.add('hidden');

      // AUTO MOVE TO PHASE 4 AFTER LAST MESSAGE
      if (allBalloonMessagesShown) {
        allBalloonMessagesShown = false;

        overlay.classList.add('active');

        setTimeout(() => {
          goToSection(3); // Phase 4: Audio
        }, 900);

        setTimeout(() => {
          overlay.classList.remove('active');
        }, 1800);
      }

    }, 600);
  });
}


/* =====================================================
   PHASE 2 → PHASE 3 NAVIGATION
===================================================== */
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


/* =====================================================
   PHASE 4 — AUDIO MEMORY
===================================================== */
const audioPlayer = document.getElementById('audioPlayer');
const audioBtn = document.getElementById('audioBtn');
const voiceAudio = document.getElementById('voiceAudio');
const forwardBtn = document.getElementById('forwardBtn');
const backwardBtn = document.getElementById('backwardBtn');
const toGiftBtn = document.getElementById('toGiftBtn');
let audioListenTimerStarted = false;



let voicePlaying = false;

if (forwardBtn && voiceAudio) {
  forwardBtn.addEventListener('click', () => {
    if (!voiceAudio.duration) return;

    voiceAudio.currentTime = Math.min(
      voiceAudio.currentTime + 5,
      voiceAudio.duration
    );
  });
}

if (backwardBtn && voiceAudio) {
  backwardBtn.addEventListener('click', () => {
    voiceAudio.currentTime = Math.max(
      voiceAudio.currentTime - 5,
      0
    );
  });
}

if (voiceAudio && toGiftBtn) {

  voiceAudio.addEventListener('timeupdate', () => {
    // Show button after 10 seconds of actual listening
    if (
      voiceAudio.currentTime >= 10 &&
      !audioListenTimerStarted
    ) {
      audioListenTimerStarted = true;
      toGiftBtn.classList.remove('hidden');
      toGiftBtn.classList.add('show');
    }
  });

}

if (toGiftBtn) {
  toGiftBtn.addEventListener('click', () => {

    // STOP VOICE AUDIO
    if (voiceAudio && !voiceAudio.paused) {
      voiceAudio.pause();
      voiceAudio.currentTime = 0;
    }

    // RESET AUDIO UI
    if (audioPlayer) {
      audioPlayer.classList.remove('playing');
    }
    if (audioBtn) {
      audioBtn.innerText = '▶';
    }
    voicePlaying = false;

    overlay.classList.add('active');

    setTimeout(() => {
      goToSection(4); // Phase 5
    }, 900);

    setTimeout(() => {
      overlay.classList.remove('active');
    }, 1800);
  });
}





if (audioBtn && voiceAudio) {
  audioBtn.addEventListener('click', () => {

    // Unlock audio if needed (mobile)
    if (voiceAudio.paused && !audioUnlocked) {
      unlockAudio();
    }

    if (!voicePlaying) {

      // PAUSE BACKGROUND MUSIC IF PLAYING
      if (musicPlaying && bgMusic) {
        bgMusic.pause();
        musicPlaying = false;
        musicToggle.innerText = '🎵';
        musicToggle.classList.remove('playing');
        musicToggle.classList.add('paused');
      }

      voiceAudio.play();
      audioBtn.innerText = '⏸';
      audioPlayer.classList.add('playing');
    }
      else {
            voiceAudio.pause();
            audioBtn.innerText = '▶';
            audioPlayer.classList.remove('playing');
          }

    voicePlaying = !voicePlaying;
  });

  // When audio ends naturally
  voiceAudio.addEventListener('ended', () => {
    voicePlaying = false;
    audioBtn.innerText = '▶';
    audioPlayer.classList.remove('playing');
  });
}



/* =====================================================
   PHASE 3 → PHASE 4 NAVIGATION
===================================================== */
const toMemories = document.getElementById('toMemories');

if (toMemories) {
  toMemories.addEventListener('click', () => {
    const current = sections[currentSection];
    current.classList.add('exit');
    overlay.classList.add('active');

    setTimeout(() => {
      current.classList.remove('exit');
      goToSection(3);
    }, 900);

    setTimeout(() => {
      overlay.classList.remove('active');
    }, 1800);
  });
}


/* =====================================================
   PHASE 5 — GIFT / COUPON
===================================================== */
const envelope = document.getElementById('envelope');
const couponCard = document.getElementById('couponCard');
const copyCoupon = document.getElementById('copyCoupon');
const couponCode = document.getElementById('couponCode');

if (envelope) {
  envelope.addEventListener('click', () => {
    envelope.classList.add('open');

    setTimeout(() => {
      couponCard.classList.remove('hidden');
    }, 700);
  });
}

if (copyCoupon && couponCode) {
  copyCoupon.addEventListener('click', () => {
    navigator.clipboard.writeText(couponCode.innerText);

    copyCoupon.innerText = 'copied';
    setTimeout(() => {
      copyCoupon.innerText = 'copy code';
    }, 1500);
  });
}



/* =====================================================
   PHASE NAVIGATION CONTROLS
===================================================== */
const prevPhaseBtn = document.getElementById('prevPhase');
const nextPhaseBtn = document.getElementById('nextPhase');

function updatePhaseNav() {
  // Hide navigation entirely until journey is complete
  if (!journeyCompleted) {
    prevPhaseBtn.style.opacity = '0';
    nextPhaseBtn.style.opacity = '0';
    prevPhaseBtn.style.pointerEvents = 'none';
    nextPhaseBtn.style.pointerEvents = 'none';
    return;
  }

  // Once unlocked, normal behavior
  prevPhaseBtn.style.opacity = currentSection === 0 ? '0' : '1';
  prevPhaseBtn.style.pointerEvents = currentSection === 0 ? 'none' : 'auto';

  nextPhaseBtn.style.opacity =
    currentSection === sections.length - 1 ? '0' : '1';
  nextPhaseBtn.style.pointerEvents =
    currentSection === sections.length - 1 ? 'none' : 'auto';
}


// Call after every section change
const originalGoToSection = goToSection;
goToSection = function(index) {
  originalGoToSection(index);
  updatePhaseNav();
};

// Previous
prevPhaseBtn.addEventListener('click', () => {
  if (currentSection > 0) {
    overlay.classList.add('active');
    setTimeout(() => goToSection(currentSection - 1), 700);
    setTimeout(() => overlay.classList.remove('active'), 1400);
  }
});

// Next
nextPhaseBtn.addEventListener('click', () => {
  if (currentSection < sections.length - 1) {
    overlay.classList.add('active');
    setTimeout(() => goToSection(currentSection + 1), 700);
    setTimeout(() => overlay.classList.remove('active'), 1400);
  }
});

updatePhaseNav();

