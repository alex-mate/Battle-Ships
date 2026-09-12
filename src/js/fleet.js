const fleet = [
    { name: "Carrier", length: 5 },
    { name: "Battleship", length: 4 },
    { name: "Destroyer", length: 3 },
    { name: "Submarine", length: 3 },
    { name: "Patrol Boat", length: 2 },
];

function deployFleet(board) {
    for (const ship of fleet) {
        const options = [];
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                for (const vertical of [false, true]) {
                    const coordinates = Array.from({ length: ship.length }, (_, i) =>
                        [row + (vertical ? i : 0), col + (vertical ? 0 : i)]);
                    if (board.canPlaceShip(coordinates)) options.push(coordinates);
                }
            }
        }
        if (!options.length) throw new Error("Not enough room for the fleet");
        board.placeShip(ship.length, options[Math.floor(Math.random() * options.length)], ship.name);
    }
}
module.exports = { fleet, deployFleet };
