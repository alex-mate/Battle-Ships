function shipTypeClass(shipName) {
    return `ship-type--${shipName
        .toLowerCase()
        .replace(/\s+/g, "-")}`;
}

function getShipPart(gameboard, row, col, ship) {
    const sameShip = (targetRow, targetCol) => (
        targetRow >= 0 &&
        targetRow < 10 &&
        targetCol >= 0 &&
        targetCol < 10 &&
        gameboard.board[targetRow][targetCol] === ship
    );

    const left = sameShip(row, col - 1);
    const right = sameShip(row, col + 1);
    const up = sameShip(row - 1, col);
    const down = sameShip(row + 1, col);

    if (left || right) {
        if (!left && right) {
            return [
                "ship-part--horizontal",
                "ship-part--start"
            ];
        }

        if (left && !right) {
            return [
                "ship-part--horizontal",
                "ship-part--end"
            ];
        }

        return [
            "ship-part--horizontal",
            "ship-part--middle"
        ];
    }

    if (up || down) {
        if (!up && down) {
            return [
                "ship-part--vertical",
                "ship-part--start"
            ];
        }

        if (up && !down) {
            return [
                "ship-part--vertical",
                "ship-part--end"
            ];
        }

        return [
            "ship-part--vertical",
            "ship-part--middle"
        ];
    }

    return [
        "ship-part--horizontal",
        "ship-part--single"
    ];
}

function addShipVisual(
    cell,
    gameboard,
    row,
    col,
    ship
) {
    cell.classList.add("ship-part");

    cell.classList.add(
        shipTypeClass(ship.name || "ship")
    );

    cell.classList.add(
        ...getShipPart(
            gameboard,
            row,
            col,
            ship
        )
    );

    cell.dataset.shipName =
        ship.name || "Ship";
}

function renderBoard(
    container,
    gameboard,
    showShips = false
) {
    container.innerHTML = "";

    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            const cell =
                document.createElement("button");

            const ship =
                gameboard.board[row][col];

            cell.type = "button";
            cell.classList.add("cell");

            cell.dataset.row = row;
            cell.dataset.col = col;

            const wasAttacked =
                gameboard.attacks.some(
                    ([attackRow, attackCol]) =>
                        attackRow === row &&
                        attackCol === col
                );

            /*
             * Player ships are always visible.
             *
             * Enemy ships are hidden until
             * that exact cell has been hit.
             */
            if (
                ship &&
                (showShips || wasAttacked)
            ) {
                addShipVisual(
                    cell,
                    gameboard,
                    row,
                    col,
                    ship
                );
            }

            if (wasAttacked) {
                cell.classList.add(
                    ship ? "hit" : "miss"
                );
            }

            const visibleShip = ship && (showShips || wasAttacked);
            cell.setAttribute("aria-label", `${String.fromCharCode(65 + row)}${col + 1}: ${wasAttacked ? (ship ? (ship.isSunk() ? "sunk" : "hit") : "miss") : "unattacked"}${visibleShip ? `, ${ship.name || "ship"}` : ""}`);
            if (ship && ship.isSunk()) cell.classList.add("sunk");
            container.appendChild(cell);
        }
    }
}

function enableBoardClicks(
    container,
    onCellClick
) {
    container.addEventListener(
        "click",
        (event) => {
            const cell =
                event.target.closest(".cell");

            if (
                !cell ||
                !container.contains(cell)
            ) {
                return;
            }

            const row =
                Number(cell.dataset.row);

            const col =
                Number(cell.dataset.col);

            onCellClick(row, col);
        }
    );
}

function enableEnemyBoardClicks(
    container,
    onAttack
) {
    enableBoardClicks(
        container,
        onAttack
    );
}

module.exports = {
    renderBoard,
    enableBoardClicks,
    enableEnemyBoardClicks,
};