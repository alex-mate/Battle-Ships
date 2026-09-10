const Player = require('../src/js/player.js');
const Gameboard = require('../src/js/gameboard.js');

test("creates a human player", () => {
    const player = new Player("human");

    expect(player.type).toBe("human");
});

test("player has its own gameboard", () => {
    const player = new Player("human");

    expect(player.gameboard).toBeInstanceOf(Gameboard);
});

test("creates a computer player", () => {
    const computer = new Player("computer");

    expect(computer.type).toBe("computer");
});