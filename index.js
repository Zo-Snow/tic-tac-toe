const gameboard = (function() {
    let list = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    const getList = () => list;            
    const markSpot = (chosenNumber, symbol) => {list[chosenNumber] = symbol}
    const resetGameboard = () => {list = [0, 1, 2, 3, 4, 5, 6, 7, 8];}

    return {getList, markSpot, resetGameboard}
})();

function game() {
    let winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8],[0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ];
    let endMessage = "";

    function checkForRemainingSpots() {
        if (!gameboard.getList().some((spot) => typeof spot === 'number')) {
            DOMfunctions.endGame();
        }       
    }
    function checkForWinCombo(player) {
        if (player.getList().length >= 3) {
            winningCombos.forEach((combo) => {
                let a = combo[0];
                let b = combo[1];
                let c = combo[2];
                if (player.getList().includes(a) && player.getList().includes(b) && player.getList().includes(c)) {
                    DOMfunctions.endGame();
                    endMessage = `${player.name} Winss!!!`
                    DOMfunctions.displayMessage(endMessage);    
                }
            })
        }
    }
    function addMark(player, choice) {
        if (gameboard.getList().includes(choice)) {
            player.addToList(choice);
            if (player === player1) {
                gameboard.getList()[choice] = "x"
            } else if (player === player2) {
                gameboard.getList()[choice] = "o"
            }
        }
    }
    function playRound(player, choice) {
        addMark(player, choice);
        checkForWinCombo(player);
        checkForRemainingSpots();
    }     
    return {playRound}
}

function createPLayer(name) {
    let list = [];

    const getList = () => list;
    const addToList = (item) => list.push(item);
    const resetList = () => {list = [];};

    return {name, getList, addToList, resetList}
}

const DOMfunctions = (function() {

    const buttons = document.querySelectorAll(".gamepad");   
    const startButton = document.querySelector(".start");
    const restartButton = document.querySelector(".restart");
    const middleDivSecond = document.querySelector(".middle-second");
    const middleDivFirst = document.querySelector(".middle-first");
    let endMessage = document.querySelector(".end-message");
    let name1 = document.querySelector("#player1");
    let name2 = document.querySelector("#player2");
    let displayP1 = document.querySelector(".p-names-1");
    let displayP2 = document.querySelector(".p-names-2");
    let num = 1;
    
    const addClickers = () => {
        buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
                if (num % 2 === 0) {
                    newGame.playRound(player2, index);
                    num++;
                    displayList();
                } else if (!num % 2 === 0) {
                    newGame.playRound(player1, index);
                    num++;
                    displayList();
                }
            })
        })
        startButton.addEventListener('click', (event) => {
            if (name1.checkValidity() && name2.checkValidity()) {            
                middleDivSecond.style.display = "none";
                middleDivFirst.style.display = "flex";
                player1 = createPLayer(name1.value);
                player2 = createPLayer(name2.value);
                displayP1.innerHTML = `${name1.value} (X)`;
                displayP2.innerHTML = `${name2.value} (O)`;
                event.preventDefault();  
            }
        })
        restartButton.addEventListener('click', () => {
            gameboard.resetGameboard();
            player1.resetList();
            player2.resetList();
            endMessage.innerHTML = "";           
            buttons.forEach((button) => {
                button.disabled = false;
            });
            num = 1;
            displayList();            
            middleDivSecond.style.display = "flex";
            middleDivFirst.style.display = "none";
            restartButton.style.display = "none";
        })
    }
    const displayList = () => {
        buttons.forEach((button, index) => {
            let display = gameboard.getList()[index];
            if (typeof display === 'number') {
                button.innerHTML = "";
            } else {
                button.innerHTML = display;
            }   
        })
    }   
    const endGame = () => {
        buttons.forEach((button) => {
            button.disabled = true;  
        })

        restartButton.style.display = "block";
        displayP1.innerHTML = "";
        displayP2.innerHTML = "";
    } 
    const displayMessage = (message) => {
        endMessage.innerHTML = message;
    }    
    return {displayList, addClickers, endGame, displayMessage}
})();

DOMfunctions.displayList();

let player1 = ""; 
let player2 = "";

DOMfunctions.addClickers();

const newGame = game();