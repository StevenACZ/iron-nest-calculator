# Iron Nest Calculator

Static Vue companion for the fictional game IRON NEST: Heavy Turret Simulator. Public site: https://ironnest.stevenacz.com/. Preserve the visual identity and the in-game calculation model.

- Use Bun 1.4.1 and the tracked `bun.lock`; do not introduce another lockfile.
- Keep ballistic math in `src/lib/ballistics.ts`, browser persistence in `src/lib/store.ts`, and both interface languages in `src/lib/i18n.ts`.
- Preserve storage compatibility and all existing keyboard shortcuts. Tab and Shift+Tab must reach and leave every control; no focus traps outside dialogs.
- Keep selected states accessible and use semantic buttons with visible focus. Respect reduced motion.
- Keep the site static and offline after load. No analytics, accounts, external runtime scripts or new map services.
- Update public metadata and visible copy together. Never invent ratings, reviews or performance claims.
- Run `bun run format` and `bun run verify` before commits or deployment; verify the public homepage and sitemap afterward.
- Use Conventional Commits. Do not commit secrets, personal data, caches, build output or local deployment paths.
