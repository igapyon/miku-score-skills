# TODO

## Identity Migration

- [x] Prepare Issue #32's `miku-score-skills` / `igapyon-miku-score` migration,
  including the new source and bundle paths, generated skill index, activation
  contract, and repo-local deployment.
- [ ] Remove compatibility triggers only through a separately approved,
  tested breaking-change migration; see `docs/miku-score-migration.md`.

## Recent Documentation Updates

- [x] Fix `.gitignore` so repo-root `/miku-score/` is ignored without also ignoring `skills/igapyon-miku-score/`.
- [x] Add `ABC Quick Handling` guidance to `skills/igapyon-miku-score/references/workflow/composition-and-output.md`.
- [x] Clarify that repo-root `miku-score/` is the default working location only when the workflow needs repository files and the user did not specify another location.
- [x] Add `docs/images/miku-score-ogp.png` to `README.md`.

## Miku-soft Standard Maintenance

- [x] Treat the vendored runtime as an explicit transition state in README, `SKILL.md`, references, and development notes.
- [x] Exclude development-only files from the bundle and verify its contents, isolated CLI routes, structured usage diagnostics, and reproducible ZIP hash in `npm test`.
- [ ] Receive a self-contained upstream `miku-score.mjs` runtime artifact and move normal skill packaging to `skills/igapyon-miku-score/runtime/`.
- [ ] When upstream provides a suitable Java CLI artifact, receive it as peer `miku-score.jar`, add Java-preferred / Node-fallback runtime selection, and remove the vendored source tree from the bundle.

## Upstream Follow-up

- [x] Reflect the current upstream sync state in the repo notes.
  - Latest received upstream source state on 2026-08-09:
    - `vendor/miku-score` was updated to `v0.6.1` tag
      `a8adc1998237f7b371cae75728afec7dd1795977`
  - Current state:
    - the primary Node CLI entrypoint is `scripts/miku-score-cli.mjs`
    - `miku-score --version` returns `0.6.1` without normal command arguments
    - upstream CLI now also includes `abc -> midi` and `MEI` / `LilyPond` <-> `MusicXML` conversion updates from the latest pull
    - upstream CLI is now documented as `convert` / `render` / `state`
    - upstream now carries `vendor/miku-score/src/ts/cli-api.ts` directly
    - `state validate-command` / `state apply-command` support `selector` / `anchor_selector` resolution in upstream `cli-api.ts`
    - no repo-local carry remains in `vendor/miku-score/src/ts/cli-api.ts`
  - Verification result:
    - `npm --prefix vendor/miku-score run build` passes
    - `npm run test` passes, including isolated bundle CLI conversion
    - root `npm run build` also passes and produces the skill bundle zip

- [ ] Send upstream follow-up for the CLI spec test timeout regression.
  - Current downstream carry:
    - `vendor/miku-score/tests/unit/miku-score-cli.spec.ts` keeps `15000` timeout coverage for its CLI error and diagnostics path
  - Why it matters:
    - this repository's GitHub Actions release build runs `npm --prefix vendor/miku-score run build`
    - those CLI tests are part of upstream `test:build`, so removing the timeout budget can become a CI degradation on slower runners
  - Desired follow-up:
    - restore the `15000` timeout upstream, or otherwise keep equivalent timeout budget for those CLI smoke cases

- [ ] Prepare and send upstream follow-up wording about `vendor/miku-score/index.html`.
  - Current downstream note:
    - `vendor/miku-score/index.html` was included in local changes while adjusting the release ZIP date handling in this repository
  - Desired follow-up:
    - prepare wording that asks upstream to handle the `index.html` update on the `miku-score` side
    - send that wording upstream instead of carrying the landing-page update here by default
