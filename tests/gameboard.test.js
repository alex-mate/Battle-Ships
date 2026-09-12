const Gameboard = require("../src/js/gameboard.js");

test("places a ship on the board", () => {
    const board = new Gameboard();

    board.placeShip(3, [
        [0, 0],
        [0, 1],
        [0, 2]
    ]);

    expect(board.ships.length).toBe(1);
});

test("can place a ship when all coordinates are empty and in bounds", () => {
    const board = new Gameboard();

    expect(
        board.canPlaceShip([
            [0, 0],
            [0, 1]
        ])
    ).toBe(true);
});

test("does not allow ships to overlap or leave the board", () => {
    const board = new Gameboard();

    board.placeShip(2, [
        [0, 0],
        [0, 1]
    ]);

    expect(
        board.canPlaceShip([
            [0, 1],
            [0, 2]
        ])
    ).toBe(false);

    expect(
        board.canPlaceShip([
            [9, 9],
            [10, 9]
        ])
    ).toBe(false);
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

test("keeps track of attacked coordinates", () => {
    const board = new Gameboard();

    board.receiveAttack(4, 5);

    expect(board.attacks).toContainEqual([4, 5]);
});

test("does not allow attacking the same coordinate twice", () => {
    const board = new Gameboard();

    board.receiveAttack(4, 5);

    expect(() => {
        board.receiveAttack(4, 5);
    }).toThrow("Coordinate already attacked");
});
test.each([
    [], [[0, 0], [0, 0]], [[0, 0], [0, 2]], [[0, 0], [1, 1]],
    [[0, 0], [0, 1], [1, 1]], [[0.5, 0]], [[0, 10]], null, [[0]],
])("rejects malformed placement %j without mutating the board", (coordinates) => {
    const board = new Gameboard();
    expect(board.canPlaceShip(coordinates)).toBe(false);
    expect(() => board.placeShip(2, coordinates)).toThrow();
    expect(board.ships).toHaveLength(0);
    expect(board.board.flat().every((cell) => cell === null)).toBe(true);
});

test.each([[-1, 0], [10, 0], [0, 10], [0, -1], [0.5, 1], [NaN, 0], ["0", 1]])("rejects invalid attack (%s, %s) without recording it", (row, col) => {
    const board = new Gameboard();
    expect(() => board.receiveAttack(row, col)).toThrow("Attack must be within the board");
    expect(board.attacks).toEqual([]);
    expect(board.missedAttacks).toEqual([]);
});

test("allows reversed contiguous ship coordinates", () => {
    const board = new Gameboard();
    expect(board.canPlaceShip([[2, 0], [1, 0], [0, 0]])).toBe(true);
});
