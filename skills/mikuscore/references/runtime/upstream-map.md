# Upstream Map

Use this reference when you need the authoritative `mikuscore` runtime and documentation locations.

## Preferred Runtime Search Order

When this skill is running from the development repository, prefer:

- `vendor/mikuscore`

When this skill is running from an installed skill bundle, check this location first:

- `skills/mikuscore/vendor/mikuscore`

Do not treat a missing workspace-root `vendor/mikuscore` as immediate failure in bundle installs.
Check the skill-local vendored runtime before concluding that dependencies are missing.

## Transition Status

The vendored runtime tree, including its selected Node dependencies, is the current documented transition state. Bundle scripts exclude development-only files and smoke-test this runtime in isolation.

Do not add another runtime lookup path while this transition state remains active. The target shape is a received upstream `skills/mikuscore/runtime/mikuscore.mjs` artifact, with a peer `mikuscore.jar` only when upstream provides a suitable Java CLI artifact. That migration must remove the vendored source tree from normal skill packaging rather than introducing a second product workflow.

## Runtime Entrypoints

- `vendor/mikuscore/scripts/mikuscore-cli.mjs`
  - primary CLI entrypoint in the development repository
- `skills/mikuscore/vendor/mikuscore/scripts/mikuscore-cli.mjs`
  - bundled install location
- `vendor/mikuscore/scripts/lib/load-cli-api.mjs`
  - CLI loader used by the runtime
- `vendor/mikuscore/src/ts/cli-api.ts`
  - upstream CLI API source for `convert` / `render` / `state`
  - includes selector-aware `state validate-command` / `state apply-command` helpers

## Primary Upstream Docs

- `vendor/mikuscore/README.md`
- `vendor/mikuscore/docs/AI_INTERACTION_POLICY.md`
- `vendor/mikuscore/docs/spec/SPEC.md`
- `vendor/mikuscore/docs/spec/ARCHITECTURE.md`
- `vendor/mikuscore/docs/spec/DIAGNOSTICS.md`
- `vendor/mikuscore/docs/spec/ABC_IO.md`
- `vendor/mikuscore/docs/spec/ABC_STANDARD_COVERAGE.md`
- `vendor/mikuscore/docs/spec/MIDI_IO.md`
- `vendor/mikuscore/docs/spec/MUSESCORE_IO.md`
- `vendor/mikuscore/docs/spec/CLI_STEP1.md`
- `vendor/mikuscore/docs/spec/COMMAND_CATALOG.md`

## Working Assumption

For the current product contract:

- keep `MusicXML` as the canonical internal score source
- use `ABC` for current generative-AI full-score handoff
- use the CLI/runtime path for supported conversion and render steps before inventing alternate flows
