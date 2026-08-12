# Conversion Routing

Use this reference when the user asks for conversion, rendering, or a short format-only follow-up.

## Default Routing Process

1. identify `source`
2. identify `target`
3. choose the documented `miku-score` route
4. execute it if the request is straightforward and file-producing
5. answer with the output path first

## Preferred Routes

- `ABC -> MusicXML`
- `MusicXML -> ABC`
- `ABC -> MIDI`
- `MIDI -> MusicXML`
- `MusicXML -> MIDI`
- `MEI -> MusicXML`
- `MusicXML -> MEI`
- `LilyPond -> MusicXML`
- `MusicXML -> LilyPond`
- `MuseScore (.mscx-style text) -> MusicXML`
- `MusicXML -> MuseScore (.mscx-style text)`
- `MusicXML -> SVG`
- `ABC -> MusicXML -> SVG`

Prefer these routes unless the authoritative docs describe a better direct path.

## Follow-up Format Interpretation

Inside an active `miku-score` workflow, short format requests should usually map to the corresponding next conversion or render step.

- `svg` -> render the current score as `SVG`
- `musicxml` -> export or normalize as `MusicXML`
- `abc` -> export the current score as `ABC`
- `midi` -> export the current score as `MIDI`
- `mei` -> export the current score as `MEI`
- `lilypond` or `ly` -> export the current score as `LilyPond`
- `mscx` or `musescore` -> export the current score as text-style `MuseScore`

If the request could mean either a visible final deliverable or an intermediate artifact, prefer the visible final deliverable unless the user explicitly asks to inspect the intermediate file.

## CLI-First Rule

- use the vendored `miku-score` CLI when the request is a straightforward supported conversion or render
- prefer explicit `--from`, `--to`, `--in`, and `--out` flags when file paths are known
- if `SVG` is required, prefer rendering from `MusicXML`
- do not switch to hand-written score rewrites when the documented CLI path can handle the request

## Scope Caveats

- keep compressed `.mscz` caveats explicit when the CLI docs scope support to `.mscx`-style text
- keep `MEI` and `LilyPond` marked as experimental
- do not imply undocumented direct format-pair shortcuts when the documented route goes through `MusicXML`
