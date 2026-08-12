# Diagnostics Handling

Use this reference when the user asks about warnings, errors, unsupported behavior, or conversion loss.

## Hard Errors

- unknown or ambiguous `source` / `target` when the workflow depends on that distinction
- claims that conflict with normative specs under `vendor/miku-score/docs/spec/*`
- unsupported or out-of-scope conversion or editing behavior presented as if it were implemented
- unsupported format-pair shortcuts presented as if they were documented product behavior

## Soft Warnings

- round-trip loss risk
- experimental-format limitations
- CLI scope caveats such as `.mscx` vs compressed `.mscz`
- metadata or diagnostics fields that exist to expose lossy conversion boundaries

## Explanation Rules

- explain what `miku-score` preserves first
- then explain what is not guaranteed
- keep semantic preservation separate from textual preservation
- when useful, point to the relevant spec family such as `DIAGNOSTICS`, `SPEC`, `ABC_IO`, `MIDI_IO`, `MUSESCORE_IO`, or `ABC_STANDARD_COVERAGE`
- on soft warnings, continue the workflow and report them concisely rather than treating them as terminal failures
- for output placement or reporting shape, defer to `workflow/output-location-rules.md`
