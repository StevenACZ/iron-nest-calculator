# Iron Nest — Ballistic Calculator

<p align="center">
  <a href="https://store.steampowered.com/app/2950790/IRON_NEST_Heavy_Turret_Simulator/">
    <img src="https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2950790/467cd309f0ba64b432367910801e56fe01e03373/capsule_616x353.jpg?t=1786639727" alt="IRON NEST: Heavy Turret Simulator" width="616" />
  </a>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-c9a437" alt="MIT license" /></a>
  <img src="https://img.shields.io/badge/Vue%203-Vite%20%2B%20TypeScript-6e7f64" alt="Vue 3 + Vite + TypeScript" />
  <img src="https://img.shields.io/badge/bundle-~38%20kB%20gzip-2b2a24" alt="Bundle size" />
</p>

Unofficial fan-made **ballistic calculator** for
[IRON NEST: Heavy Turret Simulator](https://store.steampowered.com/app/2950790/IRON_NEST_Heavy_Turret_Simulator/).
Type azimuth and distance, get the required gun elevation instantly, and manage
shot cards for both guns — all from the keyboard, styled after the in-game
ballistic machine.

## Features

- **Instant ballistics** — elevation is computed live from distance and powder
  charges using the in-game model (`elevation° = meters × 0.012 / charges`,
  60° max elevation, charges 1–6, 5 km of range per charge, 30 km max).
- **Auto charge selection** — always picks the lowest charge that can reach the
  target; click a higher charge to override, click again to return to auto.
- **Shot cards** — each logged shot becomes a paper card like the in-game
  clipboard: shell type, powder charges, elevation and azimuth. Cards land on
  Gun 1 / Gun 2 alternately, or all on one gun. Drag cards between guns,
  delete with ✕.
- **Volley history** — reset archives the board as a volley inside the current
  match; matches and volleys persist locally in the browser.
- **Keyboard-first** — `Enter` advances azimuth → distance → logs the shot,
  `Tab` jumps between azimuth and distance, `R` resets and saves the volley,
  `C` switches the target gun, `Esc` returns to the azimuth field. No mouse
  needed.
- **English / Spanish**, no accounts, no tracking, fully static.

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

- [IRON NEST: Heavy Turret Simulator](https://store.steampowered.com/app/2950790/IRON_NEST_Heavy_Turret_Simulator/)
  by Nick Nieuwoudt and Dominik Latos — also on
  [Wikipedia](https://en.wikipedia.org/wiki/Iron_Nest) and the
  [community wiki](https://iron-nest.fandom.com/).
- Ballistic model cross-checked against the community FCC by
  [Joe Oakley](https://github.com/JoeOakley52/UNOFFICIAL-Iron-Nest-FCC).
- This is an unofficial fan project, not affiliated with or endorsed by the
  developers of IRON NEST. All game names and trademarks belong to their
  respective owners.

## License

[MIT](LICENSE)
