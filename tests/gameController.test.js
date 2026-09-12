const GameController = require("../src/js/gameController.js");
const Player = require("../src/js/player.js");

describe("GameController", () => {

    test("creates a human player and a computer player", () => {
        const game = new GameController();

        expect(game.player).toBeInstanceOf(Player);
        expect(game.computer).toBeInstanceOf(Player);

        expect(game.player.type).toBe("human");
        expect(game.computer.type).toBe("computer");
    });

});

test("each player has their own gameboard", () => {
    const game = new GameController();

    expect(game.player.gameboard).not.toBe(game.computer.gameboard);
});

test("human player starts the game", () => {
    const game = new GameController();

    expect(game.currentPlayer).toBe(game.player);
});

test("switchTurn changes turn from human to computer", () => {
    const game = new GameController();

    game.switchTurn();

    expect(game.currentPlayer).toBe(game.computer);
});

test("switchTurn changes turn back to human", () => {
    const game = new GameController();

    game.switchTurn();
    game.switchTurn();

    expect(game.currentPlayer).toBe(game.player);
});

test("player attacks the computer gameboard", () => {
    const game = new GameController();

    game.computer.gameboard.placeShip(2, [
        [0, 0],
        [0, 1]
    ]);

    game.playerAttack(0, 0);

    expect(game.computer.gameboard.ships[0].hits).toBe(1);
});

test("player attack reports the hit ship and whether it sank", () => {
    const game = new GameController();

    game.computer.gameboard.placeShip(1, [[0, 0]], "Patrol Boat");

    expect(game.playerAttack(0, 0)).toEqual({
        row: 0,
        col: 0,
        hit: true,
        shipName: "Patrol Boat",
        sunk: true,
    });
});

test("winner returns the player after all computer ships sink", () => {
    const game = new GameController();

    game.computer.gameboard.placeShip(1, [[0, 0]], "Patrol Boat");
    game.playerAttack(0, 0);

    expect(game.winner()).toBe(game.player);
});

test("player cannot attack when it is computer's turn", () => {
    const game = GameController();

    game.switchTurn();

    expect(() => {
        game.playerAttack(0, 0);
    }).toThrow("It's not the player's turn!");
});

test("player attack only attacks the computer board", () => {
    const game = GameController();

    game.player.gameboard.placeShip(2, [
        [0, 0],
        [0, 1],
    ]);

    game.computer.gameboard.placeShip(2, [
        [0, 0],
        [0, 1],
    ]);

    game.playerAttack(0, 0);

    expect(game.computer.gameboard.ships[0].hits).toBe(1);
    expect(game.player.gameboard.ships[0].hits).toBe(0);
});
test("invalid attacks and repeated attacks preserve the player's turn", () => {
    const game = GameController();
    expect(() => game.playerAttack(-1, 0)).toThrow("Attack must be within the board");
    expect(game.currentPlayer).toBe(game.player);
    game.playerAttack(0, 0);
    game.computerAttack();
    expect(() => game.playerAttack(0, 0)).toThrow("Coordinate already attacked");
    expect(game.currentPlayer).toBe(game.player);
});

test("computer cannot retaliate after the winning shot", () => {
    const game = GameController();
    game.computer.gameboard.placeShip(1, [[0, 0]], "Patrol Boat");
    game.playerAttack(0, 0);
    expect(() => game.computerAttack()).toThrow("Battle is already over");
    expect(game.player.gameboard.attacks).toHaveLength(0);
    game.switchTurn();
    expect(() => game.playerAttack(1, 1)).toThrow("Battle is already over");
});

test("computer selects each available square once, even with constant randomness", () => {
    const game = GameController();
    const random = jest.spyOn(Math, "random").mockReturnValue(0);
    try {
        for (let i = 0; i < 100; i++) {
            game.playerAttack(Math.floor(i / 10), i % 10);
            game.computerAttack();
        }
        expect(new Set(game.player.gameboard.attacks.map(String)).size).toBe(100);
        game.switchTurn();
        expect(() => game.computerAttack()).toThrow("No targets remaining");
    } finally { random.mockRestore(); }
});
