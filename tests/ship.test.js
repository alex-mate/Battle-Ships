const Ship = require("../src/js/ship.js");

describe("Ship", () => {
  test("creates a ship with the correct length", () => {
    const ship = new Ship(3);

    expect(ship.length).toBe(3);
  });

  test("hit() increases the number of hits", () => {
    const ship = new Ship(3);

    ship.hit();

    expect(ship.hits).toBe(1);
  });

  test("isSunk() returns true when hits equal the ship length", () => {
    const ship = new Ship(2);

    ship.hit();
    ship.hit();

    expect(ship.isSunk()).toBe(true);
  });

  test("isSunk() returns false when hits are less than the ship length", () => {
    const ship = new Ship(3);

    ship.hit();

    expect(ship.isSunk()).toBe(false);
});
});
test.each([0, -1, 1.5, 11, NaN, "3"])("rejects invalid length %s", (length) => {
    expect(() => new Ship(length)).toThrow();
});

test("hits cannot exceed the length of a sunk ship", () => {
    const ship = new Ship(1);
    ship.hit();
    ship.hit();
    expect(ship.hits).toBe(1);
    expect(ship.isSunk()).toBe(true);
});
