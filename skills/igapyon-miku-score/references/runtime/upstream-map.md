# Upstream Map

Use this reference when you need the authoritative `miku-score` runtime and documentation locations.

## Preferred Runtime Search Order

When this skill is running from the development repository, prefer:

- `vendor/miku-score`

When this skill is running from an installed skill bundle, check this location first:

- `skills/igapyon-miku-score/vendor/miku-score`

Do not treat a missing workspace-root `vendor/miku-score` as immediate failure in bundle installs.
Check the skill-local vendored runtime before concluding that dependencies are missing.

## Transition Status

The vendored runtime tree, including its selected Node dependencies, is the current documented transition state. Bundle scripts exclude development-only files and smoke-test this runtime in isolation.

The current received upstream source state is `miku-score` `v0.6.1` at tag
commit `a8adc1998237f7b371cae75728afec7dd1795977`. Its CLI exposes
`--version` without requiring normal operation arguments.

This Skills release line deliberately remains on `0.6.x`. Do not adopt the
upstream Node `v0.7.0` line without an explicitly approved version-line update.
The matching Java `v0.6.1` Release is a peer compatibility reference; its JAR
has not yet been received as a bundled skill runtime artifact.

Do not add another runtime lookup path while this transition state remains active. The target shape is a received upstream `skills/igapyon-miku-score/runtime/miku-score.mjs` artifact, with a peer `miku-score.jar` only when upstream provides a suitable Java CLI artifact. That migration must remove the vendored source tree from normal skill packaging rather than introducing a second product workflow.

## Runtime Entrypoints

- `vendor/miku-score/scripts/miku-score-cli.mjs`
  - primary CLI entrypoint in the development repository
- `skills/igapyon-miku-score/vendor/miku-score/scripts/miku-score-cli.mjs`
  - bundled install location
- `vendor/miku-score/scripts/lib/load-cli-api.mjs`
  - CLI loader used by the runtime
- `vendor/miku-score/src/ts/cli-api.ts`
  - upstream CLI API source for `convert` / `render` / `state`
  - includes selector-aware `state validate-command` / `state apply-command` helpers

## Primary Upstream Docs

- `vendor/miku-score/README.md`
- `vendor/miku-score/docs/AI_INTERACTION_POLICY.md`
- `vendor/miku-score/docs/spec/SPEC.md`
- `vendor/miku-score/docs/spec/ARCHITECTURE.md`
- `vendor/miku-score/docs/spec/DIAGNOSTICS.md`
- `vendor/miku-score/docs/spec/ABC_IO.md`
- `vendor/miku-score/docs/spec/ABC_STANDARD_COVERAGE.md`
- `vendor/miku-score/docs/spec/MIDI_IO.md`
- `vendor/miku-score/docs/spec/MUSESCORE_IO.md`
- `vendor/miku-score/docs/spec/CLI_STEP1.md`
- `vendor/miku-score/docs/spec/COMMAND_CATALOG.md`

## Working Assumption

For the current product contract:

- keep `MusicXML` as the canonical internal score source
- use `ABC` for current generative-AI full-score handoff
- use the CLI/runtime path for supported conversion and render steps before inventing alternate flows
