# Output Location Rules

Use this reference when the skill writes user-facing files.

## Default Output Tree

Unless the user explicitly requests another location, write generated files under the workspace-local `miku-score/` tree.

- state-like or handoff artifacts -> `miku-score/state/`
- final deliverables -> `miku-score/output/`
- temporary intermediates -> `miku-score/tmp/`

## Standard Mapping

- `ABC` drafts or normalized `ABC` exports -> `miku-score/state/`
- `MusicXML` intermediates or canonical exports -> `miku-score/state/`
- final `SVG`, `MIDI`, or `MuseScore` deliverables -> `miku-score/output/`
- scratch files or troubleshooting outputs -> `miku-score/tmp/`

## Naming

- use `YYYYMMDDHHmm-<kind>.<ext>` by default
- reuse the same timestamp prefix when one request produces multiple related artifacts
- create target directories first when needed

Examples:

- `miku-score/state/202604140930-score.abc`
- `miku-score/state/202604140930-score.musicxml`
- `miku-score/output/202604140930-score.svg`

## Required Defaults

- pass an explicit `--out` path when the CLI supports it
- keep primary outputs and intermediate outputs separate when both are user-visible

## Forbidden Defaults

- workspace root outputs such as `./score.svg`
- user-facing artifacts under `skills/igapyon-miku-score/...`
- scattered outputs with incremented suffixes when one shared timestamp prefix would be clearer
