app.innerHTML = `
<button id="start2">Aloita peli 2 (W)</button>

    <div id="game2" class="testi2">
        <div id="piste2">Pisteet: 0</div>
        <div id="aika2">Aika: 30</div>
        <img id="kuva2" src="./kuvat/ylos.png">
    </div>
`;

//MINIPELI2
let piste2 = 0;
let aika2 = 30;
let active2 = false;
let timer2 = null;
let drop = null;

const piste2Div = document.getElementById("piste2");
const aika2Div = document.getElementById("aika2");
const kuva2 = document.getElementById("kuva2");

const kuvatTasot = [
    "./kuvat/alas.jpg",
    "./kuvat/oikea.jpg",
    "./kuvat/vasen.jpg",
    "./kuvat/alas.jpg",
];

document.getElementById("start2").addEventListener("click", startGame2);

function startGame2(){
    piste2 = 0;
    aika2 = 30;
    active2 = true;

    updateGame2()

    if(timer2) clearInterval(timer2)
    if(drop) clearInterval(drop)

    timer2 = setInterval(aikaTick2,1000)
    drop = setInterval(pisteReduce,200)
}

function updateGame2(){
    piste2Div.textContent = "Pisteet: " + piste2
    aika2Div.textContent = "Aika: " + aika2

    if(piste2 < 5) kuva2.src = kuvatTasot[0]
    else if(piste2 < 10) kuva2.src = kuvatTasot[1]
    else if(piste2 < 20) kuva2.src = kuvatTasot[2]
    else if(piste2 === 30) kuva2.src = kuvatTasot[3]
}

document.addEventListener("keydown", (e)=>{
    if(!active2) return;
    if(e.key === "w" || e.key === "W"){
        piste2++
        updateGame2()
        if(piste2 >= 3) win2();
    }
})

function pisteReduce(){
    if(!active2) return;
    if(piste2 > 0){
        piste2--
        updateGame2()
    }
}

function aikaTick2(){
    if(!active2) return;
    aika2--
    updateGame2()
    if(aika2 <= 0){
        end2();
    }
}

function win2(){
    active2 = false;
    const testiDiv = document.querySelector(".testi2");
    testiDiv.innerHTML = "<div id='voitto'>Voitit</div>";

}

function end2(){
    active2 = false;
    const testiDiv = document.querySelector(".testi2");
    testiDiv.innerHTML = "<div id='voitto'>hävisit</div>";
}
