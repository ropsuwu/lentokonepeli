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
audio.volume = 1;
audio.loop = true;
audio.autoplay = true;

let volume = document.querySelector("#volume-slider");
volume.addEventListener("input", function(e) {
    audio.volume = e.currentTarget.value / 100;
});