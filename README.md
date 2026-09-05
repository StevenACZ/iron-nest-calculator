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
  `Tab` and `Shift+Tab` move through every control, `R` resets and saves the volley,
  `C` switches the target gun, `Esc` returns to the azimuth field. No mouse
  needed.
- **English / Spanish**, no accounts, no tracking, fully static.

## Development

```sh
bun install --frozen-lockfile
bun run dev       # local dev server
bun run verify    # format + type-check + build + SEO + dependency audit
bun run build     # production build only
bun run preview   # serve the production build
```

Requires Bun 1.4.1 and Node.js 22.19 or newer. Vue 3 + Vite + TypeScript, zero runtime dependencies beyond Vue. All artwork
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

## Repository structure

- `src/components/`: calculator, shot cards, history and SVG instruments.
- `src/lib/ballistics.ts`: the fictional game's calculation rules.
- `src/lib/store.ts`: browser-local matches and volleys.
- `src/lib/i18n.ts`: English and Spanish interface copy.
- `scripts/verify-seo.mjs`: generated metadata, sitemap and asset checks.

`bun.lock` is the only dependency lockfile. Run `bun run format` and `bun run verify` before a change is published. Production builds are static; no server account or database is required. The deployment workflow verifies the public homepage and sitemap after publishing.

Use Q/E or the arrow keys while a charge button is focused to adjust the charge. Standard Tab navigation remains available to leave the calculator, select ammunition, change language and open history. All calculations are for the video game only.
