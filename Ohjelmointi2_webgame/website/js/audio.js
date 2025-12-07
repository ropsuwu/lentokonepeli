class Overlap {
  path;
  constructor(path) {
    this.path = path;
  }


  play() {
    const audio = new Audio(this.path)
    audio.play().catch(e => console.error("Audio playback failed", e));

    audio.addEventListener("ended", () => {
    });
  };
}

const clickSound = new Overlap("../audio/click.ogg")
const button = document.querySelector("button")

if (button) {
  button.addEventListener("click", () => {
    clickSound.play();
  });
}