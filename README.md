# Iron Nest — Fire Control Calculator

Unofficial fan-made fire control calculator for
[Iron Nest: Heavy Turret Simulator](https://store.steampowered.com/app/3560930/Iron_Nest_Heavy_Turret_Simulator/).
Type azimuth and distance, get the required elevation instantly, and manage
shot cards for both guns — all from the keyboard, styled after the in-game
ballistic machine.

## Features

- **Instant ballistics** — elevation is computed live from distance and powder
  charges using the in-game model (`elevation° = meters × 0.012 / charges`,
  60° max elevation, charges 1–6, 30 km max range).
- **Auto charge selection** — always picks the lowest charge that can reach the
  target; click a higher charge to override, click again to return to auto.
- **Shot cards** — each logged shot becomes a paper card like the in-game
  clipboard: shell type, charges, elevation and azimuth. Cards land on Gun 1 /
  Gun 2 alternately, or all on one gun. Drag cards between guns, delete with ✕.
- **Volley history** — reset archives the board as a volley inside the current
  match; matches and volleys persist locally in the browser.
- **Keyboard-first** — `Enter` advances azimuth → distance → logs the shot,
  `R` resets and saves the volley, `C` switches the target gun, `Esc` returns
  to the azimuth field. No mouse needed.
- **Spanish / English**, no accounts, no tracking, fully static.

## Development

```sh
npm install
npm run dev       # local dev server
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build
```

Vue 3 + Vite + TypeScript, zero runtime dependencies beyond Vue. All artwork
is hand-made inline SVG.

## Credits

- Ballistic model cross-checked against the community FCC by
  [Joe Oakley](https://github.com/JoeOakley52/UNOFFICIAL-Iron-Nest-FCC) and the
  [Iron Nest Wiki calculator](https://ironnestwiki.com/calculator).
- Not affiliated with the developers or publishers of Iron Nest. All game
  names and trademarks belong to their respective owners.

## License

[MIT](LICENSE)
