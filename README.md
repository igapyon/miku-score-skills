# miku-score-skills

`miku-score-skills` is an Agent Skills repository for working with `miku-score` as a score conversion and rendering engine.

The main user-facing idea is simple:

- say `miku-score` explicitly
- let the agent keep the conversion flow inside `miku-score`
- get back the generated file or the concrete diagnostics result

This repository is centered on [`skills/igapyon-miku-score`](./skills/igapyon-miku-score).

## What It Is For

Typical uses:

- convert `ABC`, `MusicXML`, `MIDI`, `MuseScore`, `MEI`, and `LilyPond` data through documented `miku-score` routes
- render score material to `SVG`
- explain `miku-score`-specific diagnostics and conversion-loss behavior
- keep AI-facing full-score handoff aligned with the current `ABC` policy while keeping canonical score handling aligned with `MusicXML`

This repository is not trying to replace the `miku-score` browser UI or turn the skill into a generic notation assistant.

## How To Invoke It

In conversation, start by naming `igapyon-miku-score`, `miku-score`, or
`miku-score-skills`. The former names `mikuscore` and `mikuscore-skills`
remain compatibility triggers for the same installed skill.

Examples:

- `miku-score で ABC から MusicXML に変換して`
- `miku-score で LilyPond から MusicXML に変換して`
- `miku-score で MusicXML から MEI にしたい`
- `miku-score でこの譜面を SVG にして`
- `miku-score で MIDI から MusicXML にしたい`
- `miku-score の diagnostics の見方を教えて`
- `miku-score の AI handoff はなぜ ABC なの?`

## Install And Local Verification

### Normal Install

Build a distributable bundle:

```bash
npm run build:bundle
```

Then place the generated bundle contents under your skill home root.

This bundle includes:

- `skills/igapyon-miku-score`
- `skills/igapyon-miku-score/vendor/miku-score`
- `skills/igapyon-miku-score/vendor/miku-score/node_modules` for runtime use

That means the installed `skills/igapyon-miku-score` directory is intended to be self-contained enough to find its vendored runtime.

Expected layout:

```text
<skill-home>/
  skills/
    igapyon-miku-score/
      SKILL.md
      agents/
      references/
      vendor/
        miku-score/
          README.md
          docs/
          scripts/
          src/
          node_modules/
```

Typical skill-home locations:

- Codex: `~/.codex/skills/igapyon-miku-score`
- GitHub Copilot: `~/.copilot/skills/igapyon-miku-score`
- Claude: `~/.claude/skills/igapyon-miku-score`

### Runtime And Transition State

The current bundle requires Node.js 20 or later to run the bundled CLI.

The current Skills release line is `0.6.x`. Its Node transition runtime is
fixed at `miku-score` `v0.6.1`; do not adopt upstream `v0.7.0` or later in this
line without an explicitly approved version-line update. Java `v0.6.1` is the
matching peer compatibility reference, but its JAR is not bundled yet.

`vendor/miku-score` is the current documented transition runtime, not the long-term package shape. The bundle now excludes development-only files and verifies isolated CLI behavior, but it still receives the Node runtime from the vendored upstream tree. The target shape is `skills/igapyon-miku-score/runtime/miku-score.mjs`, plus `miku-score.jar` when upstream provides a suitable Java CLI artifact. Until then, do not add new runtime lookup paths or skill-local conversion logic.

### Repo-Local Verification

For local validation inside this repository:

```bash
npm test
npm run install:local
```

`npm test` verifies:

- skill structure
- isolated bundle execution
- vendored CLI conversion smoke behavior

`npm run install:local` syncs the skill into repo-local `.codex/skills/igapyon-miku-score` and includes the current vendored transition runtime and its runtime dependencies inside the skill directory.

After that, start a new Codex session and invoke `miku-score` explicitly.

Compatibility triggers remain available during the documented migration period;
see [docs/miku-score-migration.md](docs/miku-score-migration.md). They do not
install a second skill directory.

## Documents

For repository-specific development notes:

- [docs/development.md](docs/development.md)
- [docs/agent-skill-design.md](docs/agent-skill-design.md)
