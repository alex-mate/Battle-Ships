const Player = require("./player.js");

function GameController() {
    const player = new Player("human");
    const computer = new Player("computer");

    let currentPlayer = player;

    function switchTurn() {
        currentPlayer =
            currentPlayer === player
                ? computer
                : player;
    }

    function playerAttack(x, y) {
        if (currentPlayer !== player) {
            throw new Error("It's not the player's turn!");
        }

        const result = computer.gameboard.receiveAttack(x, y);

        switchTurn();

        return result;
    }

    function isGameOver() {
        return (
            player.gameboard.allShipsSunk() ||
            computer.gameboard.allShipsSunk()
        );
    }

    return {
        player,
        computer,

        get currentPlayer() {
            return currentPlayer;
        },

        switchTurn,
        playerAttack,
        isGameOver,
    };
}

module.exports = GameController;