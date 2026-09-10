const gameboard = require('./gameboard.js');

class Player {
    constructor(type) {
        this.type = type;
        this.gameboard = new gameboard();
    }
}

module.exports = Player;