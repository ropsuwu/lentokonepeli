const games = [
    {
        name: "Reaction Game",
        description: "Click the circle as soon as it turns green!",
        html: `
                <div class="game-box">
                    <h2>Reaction Game</h2>
                    <p>Click the circle as soon as it turns green!</p>
                    <div id="reactionSignal">Wait...</div>
                    <p id="reactionResult"></p>
                    <button id="reactionStartBtn">Start Game</button>
                </div>
            `
    },
    {
        name: "Quick Math Game",
        description: "Solve as many simple math equations as possible!",
        html: `
                <div class="game-box">
                    <h2>Quick Math Game</h2>
                    <p>Solve as many simple math equations as possible!</p>
                    <div id="quickMathQuestion"></div>
                    <input type="number" id="quickMathAnswer" />
                    <button id="quickMathSubmit">Answer</button>
                    <p id="quickMathResult"></p>
                    <button id="quickMathStartBtn">Start Game</button>
                </div>
            `
    },
    {
        name: "Guessing Game",
        description: "Guess numbers between 1 and 5!",
        html: `
                <div class="game-box">
                    <h2>Guessing Game</h2>
                    <p>Guess numbers between 1 and 5!</p>
                    <input type="number" id="guessInput" min="1" max="5"/>
                    <button id="guessSubmit">Guess</button>
                    <p id="guessResult"></p>
                    <button id="guessStartBtn">Start Game</button>
                </div>
            `
    },
    {
        name: "Rhyhtm Game",
        description: "Press the arrows in the right order!",
        html: `
                <div class="game-box">
                    <h2>Rhythm Game</h2>
                    <p>Press the arrows in the right order!</p>
                    <div id="tulos">Points: 0</div>
                    <div id="aika">Time: 30</div>
                    <div id="kuvat">
                        <img id="nuoliKuvat" src="./images/alku.png" alt="">
                    </div>
                    <div id="napit"></div>
                    <button id="start">Start Game</button>
                    <div class="testi"></div>
                </div>
            `
    },
    {
        name: "Spam Game",
        description: "Spam the W-key as fast as possible!",
        html: `
                <div class="game-box">
                    <h2>Smashing Game</h2>
                    <p>Spam the W-key as fast as possible!</p>
                    <div id="piste2">Points: 0</div>
                    <div id="aika2">Time: 30</div>
                    <div id="kuvat">
                        <img id="kuva2" src="./images/spam.png">
                    </div>
                    <button id="start2">Press W (W) as fast as you can!</button>
                    <div class="testi"></div>
                </div>
            `
    }
];

function showRandomGame() {
    const gameContainer = document.getElementById('gameContainer');
    const randomIndex = Math.floor(Math.random() * games.length);
    const game = games[randomIndex];
    gameContainer.innerHTML = game.html;
    initGameLogic();
}

//document.getElementById('randomGameBtn').addEventListener('click', showRandomGame);

function initGameLogic() {
    const currentGameName = document.querySelector('.game-box h2').textContent;

    if (currentGameName === 'Reaction Game') {
        const reactionSignal = document.getElementById('reactionSignal');
        const reactionResult = document.getElementById('reactionResult');
        const reactionStartBtn = document.getElementById('reactionStartBtn');
        let reactionStartTime = 0;
        let reactionTimeout;
        let reactionEndTimeout;

        function startReactionGame() {
            reactionResult.textContent = "";
            reactionSignal.style.backgroundColor = 'gray';
            reactionSignal.textContent = 'Wait...';
            const duration = Math.floor(Math.random() * 6) + 15;
            const changeDelay = Math.random() * 2000 + 1000;
            reactionTimeout = setTimeout(() => {
                reactionSignal.style.backgroundColor = 'green';
                reactionSignal.textContent = 'Click!';
                reactionStartTime = Date.now();
            }, changeDelay);
            reactionEndTimeout = setTimeout(() => {
                if (reactionStartTime === 0) {
                    reactionResult.textContent = `You lost! You didn't click the circle in time.`;
                } else {
                    const reactionTime = (Date.now() - reactionStartTime) / 1000;
                    const outcome = reactionTime < 0.35 ? "Winner!" : "Loser!";
                    reactionResult.textContent = `Reaction time: ${reactionTime.toFixed(3)} sekuntia. ${outcome}`;
                    if (outcome == "Winner!") { win() }
                    else if (outcome == "Loser!") { end() }
                }
                reactionSignal.style.backgroundColor = 'gray';
                reactionSignal.textContent = 'Wait...';
                clearTimeout(reactionTimeout);
            }, duration * 1000);
        }

        reactionSignal.addEventListener('click', () => {
            if (reactionSignal.style.backgroundColor === 'green') {
                reactionStartTime = Date.now();
            }
        });

        reactionStartBtn.addEventListener('click', startReactionGame);

    } else if (currentGameName === 'Quick Math Game') {
        const quickMathQuestion = document.getElementById('quickMathQuestion');
        const quickMathAnswer = document.getElementById('quickMathAnswer');
        const quickMathResult = document.getElementById('quickMathResult');
        const quickMathSubmit = document.getElementById('quickMathSubmit');
        const quickMathStartBtn = document.getElementById('quickMathStartBtn');
        let quickMathScore = 0;
        let quickMathEndTime = 0;
        let currentAnswer = 0;

        function startQuickMathGame() {
            quickMathScore = 0;
            quickMathResult.textContent = "";
            const duration = Math.floor(Math.random() * 6) + 15;
            quickMathEndTime = Date.now() + duration * 1000;
            nextQuickMathQuestion();
        }

        function nextQuickMathQuestion() {
            if (Date.now() > quickMathEndTime) {
                const outcome = quickMathScore >= 10 ? "Winner!" : "Loser!";
                quickMathResult.textContent = `Points: ${quickMathScore}. ${outcome}`;
                quickMathQuestion.textContent = "";
                if (outcome === "Winner!") { win() }
                else if (outcome === "Loser!") { end() }
                return;
            }
            const a = Math.floor(Math.random() * 10) + 1;
            const b = Math.floor(Math.random() * 10) + 1;
            currentAnswer = a + b;
            quickMathQuestion.textContent = `${a} + ${b} = ?`;
            quickMathAnswer.value = "";
            quickMathAnswer.focus();
        }

        quickMathSubmit.addEventListener('click', () => {
            if (parseInt(quickMathAnswer.value) === currentAnswer) quickMathScore++;
            nextQuickMathQuestion();
        });

        quickMathStartBtn.addEventListener('click', startQuickMathGame);

    } else if (currentGameName === 'Guessing Game') {
        const guessInput = document.getElementById('guessInput');
        const guessResult = document.getElementById('guessResult');
        const guessSubmit = document.getElementById('guessSubmit');
        const guessStartBtn = document.getElementById('guessStartBtn');
        let guessWins = 0;
        let guessAttempts = 0;
        let guessEndTime = 0;

        function startGuessingGame() {
            guessWins = 0;
            guessAttempts = 0;
            guessResult.textContent = "";
            const duration = Math.floor(Math.random() * 6) + 15;
            guessEndTime = Date.now() + duration * 1000;
        }

        guessSubmit.addEventListener('click', () => {
            if (Date.now() > guessEndTime) {
                const outcome = guessWins >= 7 ? "Winner!" : "Loser!";
                guessResult.textContent = `Times up! Wins: ${guessWins}, attempts: ${guessAttempts}. ${outcome}`;
                if (outcome === "Winner!") { win() }
                else if (outcome === "Loser!") { end() }
                return;
            }
            const target = Math.floor(Math.random() * 5) + 1;
            const guess = parseInt(guessInput.value);
            guessAttempts++;
            if (guess === target) guessWins++;
            guessResult.textContent = `Voitot: ${guessWins}, Yritykset: ${guessAttempts}`;
            guessInput.value = "";
            guessInput.focus();
        });

        guessStartBtn.addEventListener('click', startGuessingGame);

    } else if (currentGameName === 'Rythm Game') {
        const nuoliDiv = document.getElementById("napit");
        const pisteDiv = document.getElementById("tulos");
        const aikaDiv = document.getElementById("aika");
        const nuoliKuva = document.getElementById("nuoliKuvat");
        const startBtn = document.getElementById("start");
        let nuoli = [];
        let pisteet = 0;
        let aika = 30;
        let active = false;
        let timer;
        const voitto = 30;
        const nuolet = ["←", "↑", "↓", "→"];
        /*const nuoliKuvat = {
            "←": "./images/vasen.png",
            "↑": "./images/ylos.png",
            "↓": "./images/alas.png",
            "→": "./images/oikea.png"
        };*/

        function startGame() {
            pisteet = 0;
            aika = 30;
            active = true;
            luoNuoli();
            taulu();
            nuoliKuva.src = "./images/alku.jpg";
            if (timer) clearInterval(timer);
            timer = setInterval(ajastin, 1000);
        }

        function luoNuoli() {
            nuoli = [];
            for (let i = 0; i < 5; i++) {
                nuoli.push(randNuoli());
            }
            taulu();
        }

        function randNuoli() {
            return nuolet[Math.floor(Math.random() * nuolet.length)];
        }

        function taulu() {
            nuoliDiv.textContent = nuoli.join(" ");
            pisteDiv.textContent = "Pisteet: " + pisteet;
            aikaDiv.textContent = "Aika: " + aika;
        }

        function voittoTarkistus() {
            if (pisteet >= voitto) {
                active = false;
                clearInterval(timer);
                const gameContainer = document.getElementById('gameContainer');
                gameContainer.innerHTML = `
                        <div class="game-box">
                            <img src="./images/lesgo.jpg" alt="raaah">
                            <p>Voitit!</p>
                            <button id="backToMenu">Jatka</button>
                        </div>
                    `;
                document.getElementById('backToMenu').addEventListener('click', () => {
                    gameContainer.innerHTML = '';
                    success();
                });
            }
        }

        function lopeta() {
            active = false;
            clearInterval(timer);
            const gameContainer = document.getElementById('gameContainer');
            gameContainer.innerHTML = `
                    <div class="game-box">
                        <img src="./images/ohno.jpg" alt="raaah">
                        <p>You lost</p>
                        <button id="backToMenu">Jatka</button>
                    </div>
                `;
            document.getElementById('backToMenu').addEventListener('click', () => {
                gameContainer.innerHTML = '';
                failure();
            });
        }

        function ajastin() {
            if (!active) return;
            aika--;
            taulu();
            voittoTarkistus();
            if (aika <= 0) {
                lopeta();
            }
        }

        function luoNuoliKuva(nappi) {
            nuoliKuva.src = nuoliKuvat[nappi];
        }

        startBtn.addEventListener("click", startGame);

        document.addEventListener("keydown", (e) => {
            if (!active) return;
            const eka = nuoli[0];
            let näppäin = "";
            if (e.key === "ArrowLeft") näppäin = "←";
            if (e.key === "ArrowUp") näppäin = "↑";
            if (e.key === "ArrowDown") näppäin = "↓";
            if (e.key === "ArrowRight") näppäin = "→";
            if (!näppäin) return;
            if (näppäin === eka) {
                nuoli.shift();
                pisteet++;
                nuoli.push(randNuoli());
                taulu();
                luoNuoliKuva(näppäin);
                voittoTarkistus();
            } else {
                lopeta();
            }
        });

    } else if (currentGameName === 'Smashing Game') {
        const piste2Div = document.getElementById("piste2");
        const aika2Div = document.getElementById("aika2");
        const kuva2 = document.getElementById("kuva2");
        const startBtn = document.getElementById("start2");
        let piste2 = 0;
        let aika2 = 30;
        let active2 = false;
        let timer2 = null;
        let drop = null;
        const kuvatTasot = [
            "./images/spam.png",
            "./images/spam.png",
            "./images/spam.png",
            "./images/spam.png",
        ];

        function startGame2() {
            piste2 = 0;
            aika2 = 30;
            active2 = true;
            updateGame2();
            if (timer2) clearInterval(timer2);
            if (drop) clearInterval(drop);
            timer2 = setInterval(aikaTick2, 1000);
            drop = setInterval(pisteReduce, 200);
        }

        function updateGame2() {
            piste2Div.textContent = "Pisteet: " + piste2;
            aika2Div.textContent = "Aika: " + aika2;
            if (piste2 < 5) kuva2.src = kuvatTasot[0];
            else if (piste2 < 10) kuva2.src = kuvatTasot[1];
            else if (piste2 < 20) kuva2.src = kuvatTasot[2];
            else if (piste2 === 25) kuva2.src = kuvatTasot[3];
        }

        function pisteReduce() {
            if (!active2) return;
            if (piste2 > 0) {
                piste2--;
                updateGame2();
            }
        }

        function aikaTick2() {
            if (!active2) return;
            aika2--;
            updateGame2();
            if (aika2 <= 0) {
                end2();
            }
        }

        function win2() {
            active2 = false;
            clearInterval(timer2);
            clearInterval(drop);
            const gameContainer = document.getElementById('gameContainer');
            gameContainer.innerHTML = `
                    <div class="game-box">
                        <img src="./images/lesgo.jpg" alt="raaah">
                        <p>You Won!</p>
                        <button id="backToMenu">Continue</button>
                    </div>
                `;
            playJingle()
            document.getElementById('backToMenu').addEventListener('click', () => {
                gameContainer.innerHTML = '';
                success();
            });
        }

        function end2() {
            active2 = false;
            clearInterval(timer2);
            clearInterval(drop);
            const gameContainer = document.getElementById('gameContainer');
            gameContainer.innerHTML = `
                    <div class="game-box">
                        <img src="./images/ohno.jpg" alt="raaah">
                        <p>You Lost!</p>
                        <button id="backToMenu">Continue</button>
                    </div>
                `;
            document.getElementById('backToMenu').addEventListener('click', () => {
                gameContainer.innerHTML = '';
                failure();
            });
        }

        startBtn.addEventListener('click', startGame2);

        document.addEventListener("keydown", (e) => {
            if (!active2) return;
            if (e.key === "w" || e.key === "W") {
                piste2++;
                updateGame2();
                if (piste2 >= 25) win2();
            }
        });
    }
    function win() {
        const gameContainer = document.getElementById('gameContainer');
        gameContainer.innerHTML = `
                    <div class="game-box">
                        <img src="./images/lesgo.jpg" alt="raaah">
                        <p>You Won!</p>
                        <button id="backToMenu">Continue</button>
                    </div>
                `;
        playJingle();
        document.getElementById('backToMenu').addEventListener('click', () => {
            gameContainer.innerHTML = '';
            success();
        });
    }

    function end() {
        const gameContainer = document.getElementById('gameContainer');
        gameContainer.innerHTML = `
                    <div class="game-box">
                        <img src="./images/ohno.jpg" alt="raaah">
                        <p>You Lost!</p>
                        <button id="backToMenu">Continue</button>
                    </div>
                `;
        document.getElementById('backToMenu').addEventListener('click', () => {
            gameContainer.innerHTML = '';
            failure();
        });
    }
}
function success() {
    sosigJudgement(true)
}
function failure() {
    sosigJudgement(false)
}