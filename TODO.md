# TODO

## Recent Documentation Updates

- [x] Fix `.gitignore` so repo-root `/mikuscore/` is ignored without also ignoring `skills/mikuscore/`.
- [x] Add `ABC Quick Handling` guidance to `skills/mikuscore/references/workflow/composition-and-output.md`.
- [x] Clarify that repo-root `mikuscore/` is the default working location only when the workflow needs repository files and the user did not specify another location.
- [x] Add `docs/images/mikuscore-ogp.png` to `README.md`.

## Miku-soft Standard Maintenance

- [x] Treat the vendored runtime as an explicit transition state in README, `SKILL.md`, references, and development notes.
- [x] Exclude development-only files from the bundle and verify its contents, isolated CLI routes, structured usage diagnostics, and reproducible ZIP hash in `npm test`.
- [ ] Receive a self-contained upstream `mikuscore.mjs` runtime artifact and move normal skill packaging to `skills/mikuscore/runtime/`.
- [ ] When upstream provides a suitable Java CLI artifact, receive it as peer `mikuscore.jar`, add Java-preferred / Node-fallback runtime selection, and remove the vendored source tree from the bundle.

## Upstream Follow-up

- [x] Reflect the current upstream sync state in the repo notes.
  - Latest subtree sync on 2026-04-18:
    - `vendor/mikuscore` was updated to upstream `devel` tip `2a3df2b8`
  - Current state:
    - upstream CLI now also includes `abc -> midi` and `MEI` / `LilyPond` <-> `MusicXML` conversion updates from the latest pull
    - upstream CLI is now documented as `convert` / `render` / `state`
    - upstream now carries `vendor/mikuscore/src/ts/cli-api.ts` directly
    - `state validate-command` / `state apply-command` support `selector` / `anchor_selector` resolution in upstream `cli-api.ts`
    - no repo-local carry remains in `vendor/mikuscore/src/ts/cli-api.ts`
  - Verification result:
    - `npm --prefix vendor/mikuscore run build` passes
    - `npm run test` passes, including isolated bundle CLI conversion
    - root `npm run build` also passes and produces the skill bundle zip

- [ ] Send upstream follow-up for the CLI spec test timeout regression.
  - Current downstream carry:
    - `vendor/mikuscore/tests/unit/mikuscore-cli.spec.ts` keeps `15000` timeout on the stdin `abc -> musicxml` case and the stdin `render svg` case
  - Why it matters:
    - this repository's GitHub Actions release build runs `npm --prefix vendor/mikuscore run build`
    - those CLI tests are part of upstream `test:build`, so removing the timeout budget can become a CI degradation on slower runners
  - Desired follow-up:
    - restore the `15000` timeout upstream, or otherwise keep equivalent timeout budget for those CLI smoke cases

- [ ] Prepare and send upstream follow-up wording about `vendor/mikuscore/index.html`.
  - Current downstream note:
    - `vendor/mikuscore/index.html` was included in local changes while adjusting the release ZIP date handling in this repository
  - Desired follow-up:
    - prepare wording that asks upstream to handle the `index.html` update on the `mikuscore` side
    - send that wording upstream instead of carrying the landing-page update here by default
