# File Workflow Examples

Use these examples when the user asks for a concrete `miku-score` file workflow.
They are response-shape examples, not normative CLI transcripts.

## `ABC -> MusicXML`

Preferred answer shape:

- output: `miku-score/state/202604140930-score.musicxml`
- route: `ABC -> MusicXML`
- verification: file exists and includes `<score-partwise`

## `ABC -> SVG`

Preferred answer shape:

- output: `miku-score/output/202604140930-score.svg`
- intermediate: `miku-score/state/202604140930-score.musicxml`
- route: `ABC -> MusicXML -> SVG`
- verification: file exists and begins with `<svg`

## `MusicXML -> MIDI`

Preferred answer shape:

- output: `miku-score/output/202604140930-score.mid`
- route: `MusicXML -> MIDI`
- verification: file exists and is non-empty

## `MusicXML -> ABC`

Preferred answer shape:

- output: `miku-score/state/202604140930-score.abc`
- route: `MusicXML -> ABC`
- verification: file exists and contains an `X:` header
