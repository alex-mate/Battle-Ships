const GameBoard = require("../src/js/gameboard.js");
const { fleet, deployFleet } = require("../src/js/fleet.js");

test.each([0, 0.25, 0.5, 0.999999])("deploys a complete non-overlapping fleet with random value %s", (value) => {
    const random = jest.spyOn(Math, "random").mockReturnValue(value);
    try {
        const board = new GameBoard();
        deployFleet(board);
        expect(board.ships.map(({ name, length }) => ({ name, length }))).toEqual(fleet);
        expect(board.board.flat().filter(Boolean)).toHaveLength(17);
        for (const ship of board.ships) {
            expect(board.board.flat().filter((cell) => cell === ship)).toHaveLength(ship.length);
        }
    } finally { random.mockRestore(); }
});
