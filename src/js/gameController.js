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
        if (isGameOver()) throw new Error("Battle is already over");
        if (currentPlayer !== player) {
            throw new Error("It's not the player's turn!");
        }

        const hit = computer.gameboard.receiveAttack(x, y);
        const target = computer.gameboard.board[x][y];

        switchTurn();

        return {
            row: x,
            col: y,
            hit,
            shipName: target ? target.name : null,
            sunk: target ? target.isSunk() : false,
        };
    }

    function computerAttack() {
        if (isGameOver()) throw new Error("Battle is already over");
        if (currentPlayer !== computer) {
            throw new Error("It's not the computer's turn!");
        }

        const availableCoordinates = [];

        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                const alreadyAttacked = player.gameboard.attacks.some(
                    ([attackRow, attackCol]) => attackRow === row && attackCol === col
                );

                if (!alreadyAttacked) {
                    availableCoordinates.push([row, col]);
                }
            }
        }

        if (!availableCoordinates.length) throw new Error("No targets remaining");

        const [row, col] = availableCoordinates[
            Math.floor(Math.random() * availableCoordinates.length)
        ];
        const target = player.gameboard.board[row][col];
        const hit = player.gameboard.receiveAttack(row, col);

        switchTurn();

        return {
            row,
            col,
            hit,
            shipName: target ? target.name : null,
            sunk: target ? target.isSunk() : false,
        };
    }

    function isGameOver() {
        return (
            player.gameboard.allShipsSunk() ||
            computer.gameboard.allShipsSunk()
        );
    }

    function winner() {
        if (computer.gameboard.allShipsSunk()) return player;
        if (player.gameboard.allShipsSunk()) return computer;
        return null;
    }

    return {
        player,
        computer,

        get currentPlayer() {
            return currentPlayer;
        },

        switchTurn,
        playerAttack,
        computerAttack,
        isGameOver,
        winner,
    };
}

module.exports = GameController;