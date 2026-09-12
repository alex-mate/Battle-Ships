const Ship = require("./ship.js");

class GameBoard {
    constructor() {
        this.board = Array(10)
            .fill(null)
            .map(() => Array(10).fill(null));

        this.ships = [];
        this.missedAttacks = [];
        this.attacks = [];
    }

    canPlaceShip(coordinates) {
        if (!Array.isArray(coordinates) || coordinates.length === 0 ||
            !coordinates.every((point) => Array.isArray(point) && point.length === 2 &&
                point.every((value) => Number.isInteger(value) && value >= 0 && value < 10))) {
            return false;
        }
        const horizontal = coordinates.every(([row]) => row === coordinates[0][0]);
        const vertical = coordinates.every(([, col]) => col === coordinates[0][1]);
        if (!horizontal && !vertical) return false;
        const positions = coordinates.map((point) => point[horizontal ? 1 : 0]).sort((a, b) => a - b);
        return positions.every((position, index) => index === 0 || position === positions[index - 1] + 1) &&
            coordinates.every(([row, col]) => !this.board[row][col]);
    }

    placeShip(length, coordinates, name) {
        if (
            !Number.isInteger(length) || length < 1 ||
            !Array.isArray(coordinates) || coordinates.length !== length ||
            !this.canPlaceShip(coordinates)
        ) {
            throw new Error("Ship cannot be placed there");
        }

        const newShip = new Ship(length, name);

        this.ships.push(newShip);

        for (const [row, col] of coordinates) {
            this.board[row][col] = newShip;
        }

        return newShip;
    }

    receiveAttack(row, col) {
        if (![row, col].every((value) => Number.isInteger(value) && value >= 0 && value < 10)) {
            throw new Error("Attack must be within the board");
        }
        const alreadyAttacked = this.attacks.some(
            ([attackRow, attackCol]) =>
                attackRow === row && attackCol === col
        );

        if (alreadyAttacked) {
            throw new Error("Coordinate already attacked");
        }

        this.attacks.push([row, col]);

        const target = this.board[row][col];

        if (target) {
            target.hit();
            return true;
        }

        this.missedAttacks.push([row, col]);

        return false;
    }

    allShipsSunk() {
        return (
            this.ships.length > 0 &&
            this.ships.every((ship) => ship.isSunk())
        );
    }
}

module.exports = GameBoard;