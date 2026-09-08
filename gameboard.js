const ship = require('./ship');
class GameBoard {
    constructor() {
        this.board = Array(10).fill(null).map(() => Array(10).fill(null));
        this.ships = [];
        this.missedAttacks = [];
    }

    placeShip(lenght, coordinates) {
        const newShip =  new ship(lenght);
        this.ships.push(newShip);

        for (const [x, y] of coordinates) {
            this.board[x][y] = newShip;
        }
    }

    receiveAttack(x, y) {
        const target = this.board[x][y];
        if (target) {
            target.hits++;
            return true; // Hit
        }
        this.missedAttacks.push([x, y]);
        return false; // Miss
    }

    allShipsSunk() {
        return this.ships.every(ship => ship.isSunk());
    } 

}

module.exports = GameBoard;