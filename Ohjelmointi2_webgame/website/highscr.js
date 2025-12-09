// Haetaan highscore-lista localStoragesta
let scoreList = JSON.parse(localStorage.getItem("sausageScoreList"));

// Jos ei ole, luodaan tyhjä lista
if (!scoreList) {
    scoreList = [];
    localStorage.setItem("sausageScoreList", JSON.stringify(scoreList));
}

// Funktio päivittää listan
function updateHighscoreDisplay() {
    const scoreItems = document.getElementById("scoreItems");
    scoreItems.innerHTML = "";

    let top5 = scoreList.slice(0, 5);

    top5.forEach((entry) => {
        let li = document.createElement("li");
        li.textContent = `${entry.name} – ${entry.score} pistettä`;
        scoreItems.appendChild(li);
    });
}

updateHighscoreDisplay();

// Kun Find Sausage -nappia painetaan
document.getElementById("sausageBtn").addEventListener("click", function () {

    // !! Korvaa tämä oman pelin pisteillä !!
    let points = Math.floor(Math.random() * 100);

    let name = prompt("Anna nimesi:");
    if (!name || name.trim() === "") {
        name = "Player";
    }

    scoreList.push({
        name: name,
        score: points
    });

    scoreList.sort((a, b) => b.score - a.score);

    scoreList = scoreList.slice(0, 5);

    localStorage.setItem("sausageScoreList", JSON.stringify(scoreList));

    updateHighscoreDisplay();
});

