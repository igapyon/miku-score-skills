---
name: mikuscore
description: Use only when the user explicitly says `mikuscore` or clearly asks for mikuscore-specific score conversion, diagnostics, AI handoff, or CLI workflows. This skill handles mikuscore conversion execution, format guidance, diagnostics interpretation, ABC-centric AI handoff guidance, and mikuscore workflow rules; do not auto-activate it for generic music theory, generic MIDI editing, or general notation discussion.
---

# Mikuscore

Use this skill for `mikuscore`-specific score conversion, rendering, diagnostics, AI handoff, and workflow guidance.
Treat `mikuscore` as a conversion engine with a product contract, not as a generic notation discussion mode.

The stable framing is:

- canonical score source remains `MusicXML`
- current generative-AI full-score handoff and new-score generation use `ABC`
- the documented `ABC` baseline is `ABC standard 2.2`
- some `ABC` standard features remain partially implemented or unimplemented

## Activation

`mikuscore` is opt-in by default.
Do not trigger from format names alone.

Start `mikuscore` mode when at least one of these is true:

- the user explicitly names `mikuscore`
- the user clearly asks for `mikuscore`-specific behavior such as its `MusicXML-first` policy, `ABC` AI handoff policy, diagnostics model, or CLI workflow
- the recent conversation is already inside an active `mikuscore` workflow started from an explicit trigger

Without one of these triggers, do not force `mikuscore` just because the request mentions `MusicXML`, `ABC`, `MIDI`, `MuseScore`, `MEI`, `LilyPond`, `VSQX`, `xml`, or score conversion.
In that case, answer normally or ask a brief clarifying question.

## Core Stance

- prefer agent-internal execution over visible handoff whenever the runtime can continue internally
- keep intermediate score artifacts off-screen unless the user explicitly asks to inspect them
- once an active `mikuscore` workflow has started, keep follow-up work inside `mikuscore` terms when that remains the natural continuation
- use the vendored `mikuscore` CLI or documented runtime flow before falling back to ad-hoc rewrites, one-off converters, or generic music-tool advice
- move from route selection to execution quickly on straightforward file-producing requests
- present generated outputs first and keep process narration short

## Product Contract

- preserve `mikuscore`'s split framing in explanations: canonical `MusicXML` internally, `ABC` for the current AI-facing full-score boundary
- prefer `MusicXML` as the canonical explanation axis across format pairs
- prefer `ABC` when the question is specifically about current AI-facing score exchange
- explain limitations as diagnostics, coverage gaps, or format-scope constraints
- distinguish `supported`, `experimental`, `future`, and `non-goal` areas explicitly
- when docs conflict, prefer `vendor/mikuscore/docs/spec/*` over README-level summaries
- do not describe `mikuscore` as a feature-complete score engraving editor
- do not imply structural repairs or guarantees that the current specs do not define

## Operations

Prefer the reusable upstream CLI and documented runtime flow exposed by the vendored `mikuscore`.
Use those before direct file reads, hand-written rewrites, or UI-oriented flows.

Primary workflow categories:

- `convert`: execute or explain source-to-target conversion in `mikuscore` terms
- `render`: produce user-facing render outputs such as `SVG`
- `diagnostics`: explain warnings, errors, preservation, and conversion loss
- `format-guidance`: explain how a format is positioned inside the current product contract
- `ai-handoff`: explain why current generative-AI full-score handoff uses `ABC`
- `workflow`: explain CLI, build, test, bundle, and local verification usage

## Runtime Discipline

For explicit `mikuscore` convert/render requests, first attempt the vendored CLI or documented vendored runtime flow before broad repository exploration or generic tool discovery.

Use this order:

1. read this `SKILL.md`
2. check the vendored `mikuscore` runtime first
3. use the vendored CLI or documented runtime flow immediately if present
4. only if that path is missing or unusable, search for alternatives

For this repository:

- in the development repo, prefer `vendor/mikuscore`
- in bundled installs, prefer the skill-local `vendor/mikuscore`
- do not search broadly through the workspace before checking the vendored runtime
- do not conclude that runtime dependencies are missing until the bundled skill-local runtime path has also been checked

The vendored tree is a documented transition runtime. Do not add further runtime lookup paths or skill-local conversion logic around it. When upstream provides `runtime/mikuscore.mjs` or `runtime/mikuscore.jar`, use those declared artifacts according to the updated runtime reference.

## Conversion Discipline

- identify `source` and `target` first
- current documented CLI pairs include `ABC <-> MusicXML`, `ABC -> MIDI`, `MIDI -> MusicXML`, `MusicXML <-> MEI`, `MusicXML <-> LilyPond`, and `MusicXML <-> MuseScore`
- keep `MEI` and `LilyPond` marked as experimental when explaining them
- explain or execute routes through `MusicXML` when that matches the documented product model
- resolve short follow-up format requests such as `svg`, `musicxml`, `abc`, `midi`, `mei`, `lilypond`, or `mscx` as `mikuscore` conversion or render requests when that is the natural continuation of the active workflow
- when the user wants `SVG` from an `ABC`-friendly request, prefer `ABC -> MusicXML -> SVG` unless a better direct path is clearly documented
- do not show raw intermediate `ABC` or `MusicXML` unless the user explicitly asks to inspect them or the runtime path has failed
- do not turn a normal conversion request into a runtime-inspection task unless the actual conversion path has failed

## Output Discipline

Unless the user asks for another location, use a workspace-local `mikuscore/` tree:

- state-like or handoff artifacts -> `mikuscore/state/`
- final deliverables -> `mikuscore/output/`
- temporary files -> `mikuscore/tmp/`

For file-producing conversions:

- report the primary generated file first
- mention intermediate files only after the primary output
- use repo-relative paths or clickable file links, not bare filenames
- include a one-line route or command summary
- include one concrete verification fact if you claim success
- do not surface `/tmp/...` paths unless they are the user-facing output

Preferred close-out shape:

1. primary generated file path
2. optional intermediate file path(s)
3. one-line route summary such as `ABC -> MusicXML -> SVG`
4. one concrete verification fact
5. optional next adjustment

## Error Model

Treat these as hard errors:

- unknown or ambiguous `source` / `target` when the workflow depends on that distinction
- unsupported format-pair claims
- claims that conflict with normative specs under `vendor/mikuscore/docs/spec/*`
- unsupported or out-of-scope behavior presented as if it were implemented

Treat these as soft warnings:

- round-trip loss risk
- experimental-format caveats
- CLI scope caveats such as `.mscx` vs compressed `.mscz`
- metadata or diagnostics notes that expose lossy conversion boundaries

On soft warnings, continue and report them concisely.

## Boundaries

- do not pretend `mikuscore` replaces a full notation editor
- do not claim textual XML identity guarantees that the specs reject
- do not claim unsupported or future format flows are already stable
- do not collapse a `mikuscore` workflow question into generic music software advice when `mikuscore`-specific guidance is needed

## References

Read these only when needed:

- [references/INDEX.md](references/INDEX.md) for workflow, runtime, output, and example references
