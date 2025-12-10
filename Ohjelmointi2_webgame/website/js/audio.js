class Overlap {
  path;
  constructor(path) {
    this.path = path;
  }

  /*Creates an audio object when the button is clicked*/
  play() {
    const audio = new Audio(this.path)
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

/*Volume slider*/
let audio = new Audio("audio/bgm.ogg");
let volume = document.querySelector("#volume-slider");

/*Checks if the volume value is saved to the browser*/
let savedVolume = localStorage.getItem("bgm_volume");
if (savedVolume !== null) {
  audio.volume = savedVolume / 100;
  volume.value = savedVolume;
} else {
  audio.volume = 1;
  volume.value = 100;
}
audio.loop = true
audio.autoplay = true //User has to allow this first

volume.addEventListener("input", function(e) {
    audio.volume = e.currentTarget.value / 100;
    /*saves the audio volume to the browser's storage to keep volume after page refresh*/
    localStorage.setItem("bgm_volume", e.currentTarget.value);
});