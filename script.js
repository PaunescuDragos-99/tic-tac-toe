const startBtn = document.querySelector("#startbtn");

const displayController = (() => {
    const renderMessage = (message) => {
        document.querySelector("#message").innerHTML = message;
    }
    return {
        renderMessage
    }
})();

const Gameboard = (() => {
    let gameboard = ["","","","","","","","",""];

    const render = () => {
        let boardHTML = "";
        gameboard.forEach((square, index) =>{
            boardHTML += `<div class="square" id=square-${index}>${square}</div>`
        })
        document.querySelector("#gameboard").innerHTML = boardHTML;
        const squares = document.querySelectorAll(".square");        
        squares.forEach((square) => {
            square.addEventListener("click", Game.handleClick)
        })
    }

    const update = (index, value) =>{
        gameboard[index] = value;
        if(value === "X"){
            document.querySelector("p:nth-child(2)").style.backgroundColor = "rgb(179, 4, 91)";
            document.querySelector("p:nth-child(1)").style.backgroundColor = "rgba(66, 175, 175, 0.548)";
        }else{
            document.querySelector("p:nth-child(1)").style.backgroundColor = "rgb(179, 4, 91)";
            document.querySelector("p:nth-child(2)").style.backgroundColor = "rgba(66, 175, 175, 0.548)";
        }
        render();
    }

    const getGameboard = () => gameboard;

    return {
        render,
        update,
        getGameboard
    }
})();

const createPlayer = (name, mark) => {
    return {
        name,
        mark,
    }
}

const Game = (() => {
    let player = [];
    let currentPlayerIndex = 0;
    let gameOver = false;

    const start = () => {
        player = [
            createPlayer(document.querySelector("#player1").value, "X"),
            createPlayer(document.querySelector("#player2").value, "O")
        ];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();
        const squares = document.querySelectorAll(".square");        
        squares.forEach((square) => {
            square.addEventListener("click", handleClick)
        })
    }

    const handleClick = (e) => {
        if(gameOver){
            return;
        }
        let index = parseInt(e.target.id.split("-")[1]);
        if(Gameboard.getGameboard()[index] !== ""){
            return;
        }
        Gameboard.update(index, player[currentPlayerIndex].mark);
        if(checkForWin(Gameboard.getGameboard(),player[currentPlayerIndex].mark)) {
            gameOver = true;
            displayController.renderMessage(`${player[currentPlayerIndex].name} wins`);
        }else if (checkForTie(Gameboard.getGameboard())){
            gameOver = true;
            displayController.renderMessage("It's a tie!");
        }
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }

    const restart = () => {
        for (let i = 0; i < 9; i++){
            Gameboard.update(i, "");
        }
        Gameboard.render();
        gameOver = false;
        document.querySelector("#message").innerHTML = "";
    }

    return {
        start,
        handleClick,
        restart
    }
})();

function checkForWin(board) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for(let i = 0; i < winningCombinations.length; i++){
        const [a, b, c] = winningCombinations[i];
        if(board[a] && board[a] === board[b] && board[a] === board[c]){
            document.querySelector(`#square-${a}`).style.backgroundColor = "green";
            document.querySelector(`#square-${b}`).style.backgroundColor = "green";
            document.querySelector(`#square-${c}`).style.backgroundColor = "green";
            document.querySelector("p:nth-child(2)").style.backgroundColor = "teal";
            document.querySelector("p:nth-child(1)").style.backgroundColor = "teal";
            return true;
        }
    }
    return false;
}

function checkForTie(board) {
    return board.every(cell => cell !== "");
}

startBtn.addEventListener("click", () => {
    Game.restart();
    Game.start();
});


Gameboard.render();
Game.start();