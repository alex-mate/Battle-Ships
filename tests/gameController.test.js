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