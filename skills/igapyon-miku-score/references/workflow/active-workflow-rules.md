# Active Workflow Rules

Use this reference when `miku-score` is already active and the next request is a follow-up.

## Follow-up Handling

- treat follow-up requests as part of the same conversion-oriented workflow unless the user clearly exits that context
- resolve short format words in `miku-score` terms when that is the natural continuation
- prefer `convert`, `render`, `diagnostics`, `format-guidance`, and `workflow` handling over generic music-software advice
- if multiple format names appear, identify `source` and `target` before giving guidance or executing the step
- if the user already started from a `miku-score` request, do not drift into generic notation-tool comparisons unless asked
- do not turn a normal conversion or render request into a runtime-inspection task unless the actual runtime path has failed

## Active-Context Discipline

- keep intermediate `ABC` and `MusicXML` internal when possible
- do not ask the user to manually pass an intermediate file back into the same active workflow if the runtime can continue internally
- if a visible final deliverable and an intermediate artifact are both possible, prefer the final deliverable unless the user explicitly wants the intermediate file
- keep progress updates short during straightforward conversions

## Product Boundary Discipline

- explain format pairs through `MusicXML` when that matches the `miku-score` product model
- keep `MusicXML` as the canonical internal score source
- keep `ABC` as the current AI-facing full-score boundary
- do not promise textual XML identity
- do not erase `experimental` labels from `MEI` or `LilyPond`
- do not overstate compressed `.mscz` CLI support when the docs scope the CLI to `.mscx`-style text
- do not answer a `miku-score` workflow question as though the user asked about a generic DAW or engraving suite
