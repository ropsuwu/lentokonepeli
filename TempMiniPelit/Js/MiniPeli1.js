const nuolet = ["←", "↑", "↓", "→"]
const nuoliKuvat = {
    "←": "./kuvat/vasen.jpg",
    "↑": "./kuvat/ylos.png",
    "↓": "./kuvat/alas.jpg",
    "→": "./kuvat/oikea.jpg"
}
const app = document.getElementById("app");

app.innerHTML = `
<div style="padding: 20px">

</div>
<button id="start">Aloita peli</button>
    <div class="testi">
        <div id="tulos">Pisteet: 0</div>
        <div id="aika">Aika: 30</div>

        <div id="kuvat">
            <img id="nuoliKuvat" src="./kuvat/alku.jpg" alt="alkukuva">
        </div>

        <div id="napit"></div>
        <div id="loppu" style="display:none;">Nyt loppu lmao</div>
    </div>
    

`;
//MiniPeli2
let nuoli = []
let pisteet = 0
let aika = 30
let active = false
const voitto = 30


const nuoliDiv = document.getElementById("napit")
const pisteDiv = document.getElementById("tulos")
const aikaDiv = document.getElementById("aika")
const loppuDiv = document.getElementById("loppu")
const nuoliKuva = document.getElementById("nuoliKuvat")
document.getElementById("start").addEventListener("click", startGame);

function startGame(){
    pisteet = 0
    aika = 30
    active = true

    luoNuoli()
    taulu()
    nuoliKuva.src = "./kuvat/alku.jpg"

    if(timer) clearInterval(timer)

    timer = setInterval(ajastin, 1000)
}
function luoNuoli() {
    nuoli = []
    for (let i = 0; i < 5; i++){
        nuoli.push(randNuoli());
    }
    taulu()
}
function luoNuoliKuva(nappi){
    nuoliKuva.src = nuoliKuvat[nappi];
}

function randNuoli() {
    return nuolet[Math.floor(Math.random() * nuolet.length )]
}

function taulu() {
    nuoliDiv.textContent = nuoli.join(" ")
    pisteDiv.textContent = "Pisteet: " + pisteet;
    aikaDiv.textContent = "aika: "+aika
}

document.addEventListener("keydown", (e) => {
    if (!active) return;
    const eka = nuoli[0];

    let näppäin = "";
    if(e.key === "ArrowLeft") näppäin = "←"
    if(e.key === "ArrowUp") näppäin = "↑"
    if(e.key === "ArrowDown") näppäin = "↓"
    if(e.key === "ArrowRight") näppäin = "→"

    if(!näppäin) return;

    if (näppäin === eka){
        nuoli.shift()
        pisteet++;
        nuoli.push(randNuoli())
        taulu()
        luoNuoliKuva(näppäin)
        voittoTarkistus()
    }else {
        lopeta()
    }
})
function voittoTarkistus(){
    if(pisteet >= voitto) {
        active = false;
        const testiDiv = document.querySelector(".testi");
        testiDiv.innerHTML = "<div id='voitto'>Voitit</div>";
    }
}
function lopeta(){
    active = false;
    const testiDiv = document.querySelector(".testi");
    testiDiv.innerHTML = "<div id='loppu'>Nyt loppu lmao</div>";
}

function ajastin(){
    if (!active) return;
    aika--;
    taulu()
    if (aika <= 0) {
        lopeta()
    }
}


