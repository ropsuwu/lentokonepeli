/*
====================
SFX
====================
 */

/* ---Click sound effect --- */
class Overlap {
  path;
  constructor(path) {
    this.path = path;
  }

  /*Creates an audio object when the button is clicked*/
  play() {
    const audio = new Audio(this.path)
    audio.volume = currentSfx;

    audio.play().catch(e => console.error("Audio playback failed", e));
    audio.addEventListener("ended", () => {
      /*remove object after playing to prevent possible, although unlikely, memory leak*/
      audio.remove();
    });
  };
}

const clickSound = new Overlap("audio/click.ogg")
const button = document.getElementById("button-main")

/*Runs the play method when clicking*/
button.addEventListener("click", () => {
  clickSound.play();
});

/* --- Sound for flying --- */
const flightSound = new Audio("audio/fly.ogg");
flightSound.loop = true;
flightSound.preservesPitch = false;

function playFlight() {
  if (flightSound.paused) {
    flightSound.volume = typeof currentSfx !== 'undefined' ? currentSfx: 1;

    flightSound.play().catch(e => console.log("Audio failed to play:", e));
  }
}

function stopFlight() {
  flightSound.pause();
  flightSound.currentTime = 0;
}

/* Change the pitch of flight sound depending on speed*/
function setFlightPitch(speed) {
  let rate = speed / 50;

  if (rate < 0.5) rate = 0.5;
  if (rate > 3.0) rate =3.0;

  //console.log(speed)
  //console.log(rate)
  flightSound.playbackRate = rate;
}


/*
====================
Volume Controls
====================
 */

/* --- Volume slider for sfx --- */
let sfxVolume = document.querySelector("#sfx-volume")
let currentSfx = 1;

/*Checks if the volume value is saved to the browser*/
let savedSfx = localStorage.getItem("sfx_volume")
if (savedSfx !== null) {
  currentSfx= savedSfx / 100;
  sfxVolume.value = savedSfx;
} else {
  currentSfx= 1;
  sfxVolume.value = 100;
}

sfxVolume.addEventListener("input", function(e) {
  currentSfx = e.currentTarget.value /100;
  localStorage.setItem("sfx_volume", e.currentTarget.value);
});

/* --- Volume slider for bgm --- */
let music = new Audio("audio/bgm.ogg");
let musicVolume = document.querySelector("#music-volume");

/*Checks if the volume value is saved to the browser*/
let savedMusic = localStorage.getItem("bgm_volume");
if (savedMusic !== null) {
  music.volume = savedMusic / 100;
  musicVolume.value = savedMusic;
} else {
  music.volume = 1;
  musicVolume.value = 100;
}
music.loop = true
music.autoplay = true //User has to allow this first

musicVolume.addEventListener("input", function(e) {
    music.volume = e.currentTarget.value / 100;
    /*saves the audio volume to the browser's storage to keep volume after page refresh*/
    localStorage.setItem("bgm_volume", e.currentTarget.value);
});