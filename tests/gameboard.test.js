const Gameboard = require("../src/js/gameboard.js");
const Ship = require("../src/js/ship.js");

test("places a ship on the board", () => {
    const board = new Gameboard();
    const ship = new Ship(3);

    board.placeShip(ship, [[0, 0], [0, 1], [0, 2]]);

    expect(board.ships.length).toBe(1);
});

test("receiveAttack hits a ship", () => {
    const board = new Gameboard();

    board.placeShip(2, [
        [0, 0],
        [0, 1]
    ]);

    board.receiveAttack(0, 0);

    expect(board.ships[0].hits).toBe(1);
});

test("receiveAttack returns false when attack misses", () => {
    const board = new Gameboard();

    expect(board.receiveAttack(5, 5)).toBe(false);
});

test("allShipsSunk returns false if at least one ship is not sunk", () => {
    const board = new Gameboard();

    board.placeShip(2, [
        [0, 0],
        [0, 1]
    ]);

    board.receiveAttack(0, 0);

    expect(board.allShipsSunk()).toBe(false);
});

test("allShipsSunk returns true when all ships are sunk", () => {
    const board = new Gameboard();

    board.placeShip(2, [
        [0, 0],
        [0, 1]
    ]);

    board.receiveAttack(0, 0);
    board.receiveAttack(0, 1);

    expect(board.allShipsSunk()).toBe(true);
});

test("records missed attacks", () => {
    const board = new Gameboard();

    board.receiveAttack(5, 5);

    expect(board.missedAttacks).toContainEqual([5, 5]);
});