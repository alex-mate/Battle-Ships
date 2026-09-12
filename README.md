# Battleship

A classic 10 × 10 Battleship game against the computer, built with JavaScript, Webpack, and Jest.

## Run locally

```sh
npm install
npm run dev
```

`npm test -- --runInBand` runs the unit and regression tests. `npm run build` creates the bundled app in `dist/`.

## Project structure

```text
index.html                 Page layout and accessible game controls
src/
  css/style.css            Responsive naval chart design
  js/
    index.js               Placement, UI state, events, and enemy-turn timing
    domController.js       Board rendering and delegated cell clicks
    gameController.js      Turn order, attacks, and winner detection
    gameboard.js           Placement validation and attack history
    ship.js                Ship health and sinking
    player.js              Player identity and board ownership
    fleet.js               Shared fleet definitions and random deployment
 tests/                    Jest tests for game rules and fleet generation
webpack.config.js          JavaScript/CSS bundling and development server
```

## Play

Select a ship and a starting square on your ocean. Rotate changes the direction; the preview indicates whether the ship fits. Ships cannot overlap or leave the board. Shuffle fleet places all five ships automatically and can be used again before battle.

Once all five ships are deployed, start the battle and select a square in enemy waters. Each attack is followed by a computer turn. Hits use a cross, misses a dot, and sunk ships a rust-colored hull. Sink the enemy fleet first to win. New game resets both fleets, including any pending computer turn.

Use Tab to reach controls, arrow keys to move through board squares, and Enter or Space to select. On mobile, the target board appears first during battle. Status updates are announced to screen readers. Enemy ships remain hidden until hit; the entire board is revealed when the game ends.

The interface uses Google Fonts when available, with local sans-serif fallbacks. Gameplay needs no external service.

## Repository note

`node_modules/` and `dist/` are ignored. Some dependency files were already tracked in Git before this update; `.gitignore` alone does not untrack them. Those existing index entries have been left intact.
