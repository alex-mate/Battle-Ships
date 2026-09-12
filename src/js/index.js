require("../css/style.css");
const GameController = require("./gameController.js");
const DOMController = require("./domController.js");
const { fleet, deployFleet } = require("./fleet.js");
const $ = (selector) => document.querySelector(selector);
const playerBoard = $("#player-board");
const computerBoard = $("#computer-board");
const shipButtons = [...document.querySelectorAll(".ship-card")];
let game, selectedShip, orientation, phase, timer;

function message(text) { $("#game-message").textContent = text; }
function coordinatesFor(row, col) {
    return Array.from({ length: selectedShip.length }, (_, i) =>
        [row + (orientation === "vertical" ? i : 0), col + (orientation === "horizontal" ? i : 0)]);
}
function refresh() {
    const placing = phase === "deployment" && selectedShip;
    const attacking = phase === "battle" && game.currentPlayer === game.player;
    document.body.dataset.phase = phase;
    DOMController.renderBoard(playerBoard, game.player.gameboard, true);
    DOMController.renderBoard(computerBoard, game.computer.gameboard, phase === "complete");
    playerBoard.classList.toggle("board--placement", Boolean(placing));
    computerBoard.classList.toggle("board--active", attacking);
    for (const cell of playerBoard.children) cell.disabled = !placing;
    for (const cell of computerBoard.children) cell.disabled = !attacking || cell.classList.contains("hit") || cell.classList.contains("miss");
    shipButtons.forEach((button) => {
        const placed = game.player.gameboard.ships.some((ship) => ship.name === button.dataset.shipName);
        const selected = Boolean(placing && selectedShip.name === button.dataset.shipName);
        button.disabled = phase !== "deployment" || placed;
        button.classList.toggle("is-deployed", placed);
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", selected);
        button.querySelector("small").textContent = placed ? "Deployed ✓" : `${button.dataset.shipLength} spaces`;
    });
    $("#rotate-ship").disabled = !placing;
    $("#rotate-ship").textContent = `↻ ${orientation === "horizontal" ? "Horizontal" : "Vertical"}`;
    $("#start-game").disabled = phase !== "deployment" || Boolean(selectedShip);
    $("#place-ships").disabled = phase !== "deployment";
    $("#fleet-count").textContent = `${game.player.gameboard.ships.length} / 5 deployed`;
    $("#player-remaining").textContent = `${game.player.gameboard.ships.filter((s) => !s.isSunk()).length} ships afloat`;
    $("#enemy-remaining").textContent = `${game.computer.gameboard.ships.filter((s) => !s.isSunk()).length} ships afloat`;
    $("#shot-count").textContent = String(game.computer.gameboard.attacks.length).padStart(2, "0");
    $("#status-label").textContent = phase === "complete" ? "BATTLE COMPLETE" : phase === "deployment" ? (selectedShip ? "DEPLOYMENT" : "READY TO SAIL") : (attacking ? "YOUR TURN" : "ENEMY TURN");
}
function nextShip() {
    selectedShip = fleet.find((definition) => !game.player.gameboard.ships.some((ship) => ship.name === definition.name));
    message(selectedShip ? `Place your ${selectedShip.name}. Choose a starting square on your ocean.` : "All ships in position. Start the battle when you're ready.");
}
function reset() {
    clearTimeout(timer);
    game = GameController();
    deployFleet(game.computer.gameboard);
    phase = "deployment";
    orientation = "horizontal";
    nextShip();
    refresh();
}
function preview(event) {
    playerBoard.querySelectorAll(".preview, .preview--invalid").forEach((cell) => cell.classList.remove("preview", "preview--invalid"));
    const cell = event.target.closest(".cell");
    if (!cell || phase !== "deployment" || !selectedShip) return;
    const coordinates = coordinatesFor(Number(cell.dataset.row), Number(cell.dataset.col));
    const valid = game.player.gameboard.canPlaceShip(coordinates);
    coordinates.forEach(([row, col]) => {
        playerBoard.querySelector(`[data-row="${row}"][data-col="${col}"]`)?.classList.add(valid ? "preview" : "preview--invalid");
    });
}
DOMController.enableBoardClicks(playerBoard, (row, col) => {
    if (phase !== "deployment" || !selectedShip) return;
    const coordinates = coordinatesFor(row, col);
    if (!game.player.gameboard.canPlaceShip(coordinates)) {
        message("That ship won't fit. Keep it inside the grid and clear of other ships.");
        return;
    }
    game.player.gameboard.placeShip(selectedShip.length, coordinates, selectedShip.name);
    nextShip();
    refresh();
    if (selectedShip) playerBoard.querySelector(`[data-row="${row}"][data-col="${col}"]`).focus();
    else $("#start-game").focus();
});
function resultMessage(result, enemy = false) {
    const coordinate = `${String.fromCharCode(65 + result.row)}${result.col + 1}`;
    return `${enemy ? "Enemy" : "You"} fired at ${coordinate}: ${result.sunk ? `${result.shipName} sunk!` : result.hit ? "hit!" : "miss."}`;
}
function finish() {
    if (!game.isGameOver()) return false;
    phase = "complete";
    message(game.winner() === game.player ? "Victory. You sank the enemy fleet! Start a new game to play again." : "Fleet lost. The enemy won this battle. Start a new game to try again.");
    refresh();
    $("#new-game").focus();
    return true;
}
DOMController.enableEnemyBoardClicks(computerBoard, (row, col) => {
    if (phase !== "battle" || game.currentPlayer !== game.player) return;
    if (game.computer.gameboard.attacks.some(([r, c]) => r === row && c === col)) return;
    const result = game.playerAttack(row, col);
    message(`${resultMessage(result)} Enemy is choosing a target…`);
    if (finish()) return;
    refresh();
    timer = setTimeout(() => {
        const response = game.computerAttack();
        if (finish()) return;
        message(`${resultMessage(result)} ${resultMessage(response, true)} Your turn.`);
        refresh();
        const next = [...computerBoard.children].find((cell, index) => index > row * 10 + col && !cell.disabled) || computerBoard.querySelector(".cell:not(:disabled)");
        next?.focus({ preventScroll: true });
    }, 650);
});
shipButtons.forEach((button) => button.addEventListener("click", () => {
    selectedShip = fleet.find((ship) => ship.name === button.dataset.shipName);
    message(`Place your ${selectedShip.name}. Choose a starting square on your ocean.`);
    refresh();
}));
$("#rotate-ship").addEventListener("click", () => {
    orientation = orientation === "horizontal" ? "vertical" : "horizontal";
    refresh();
});
$("#place-ships").addEventListener("click", () => {
    const GameBoard = require("./gameboard.js");
    game.player.gameboard = new GameBoard();
    deployFleet(game.player.gameboard);
    nextShip();
    refresh();
});
$("#start-game").addEventListener("click", () => {
    if (phase !== "deployment" || selectedShip) return;
    phase = "battle";
    message("Your move. Choose a square in enemy waters to fire.");
    refresh();
    computerBoard.querySelector(".cell").focus({ preventScroll: true });
});
$("#new-game").addEventListener("click", reset);
playerBoard.addEventListener("pointerover", preview);
playerBoard.addEventListener("focusin", preview);
playerBoard.addEventListener("pointerleave", () => playerBoard.querySelectorAll(".preview, .preview--invalid").forEach((cell) => cell.classList.remove("preview", "preview--invalid")));
for (const board of [playerBoard, computerBoard]) {
    board.addEventListener("keydown", (event) => {
        const offsets = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 10, ArrowUp: -10 };
        if (!(event.key in offsets)) return;
        event.preventDefault();
        const cells = [...board.children];
        let index = cells.indexOf(event.target) + offsets[event.key];
        while (index >= 0 && index < cells.length) {
            if (!cells[index].disabled) { cells[index].focus(); break; }
            index += offsets[event.key];
        }
    });
}
reset();
