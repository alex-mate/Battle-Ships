const GameBoard = require("./gameboard.js");

class Player {
    constructor(type) {
        this.type = type;
        this.gameboard = new GameBoard();
    }
}

module.exports = Player;