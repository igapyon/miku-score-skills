# mikuscore-skills

`mikuscore-skills` is an Agent Skills repository for working with `mikuscore` as a score conversion and rendering engine.

The main user-facing idea is simple:

- say `mikuscore` explicitly
- let the agent keep the conversion flow inside `mikuscore`
- get back the generated file or the concrete diagnostics result

This repository is centered on [`skills/mikuscore`](./skills/mikuscore).

## What It Is For

Typical uses:

- convert `ABC`, `MusicXML`, `MIDI`, `MuseScore`, `MEI`, and `LilyPond` data through documented `mikuscore` routes
- render score material to `SVG`
- explain `mikuscore`-specific diagnostics and conversion-loss behavior
- keep AI-facing full-score handoff aligned with the current `ABC` policy while keeping canonical score handling aligned with `MusicXML`

This repository is not trying to replace the `mikuscore` browser UI or turn the skill into a generic notation assistant.

## How To Invoke It

In conversation, start by naming `mikuscore`.

Examples:

- `mikuscore で ABC から MusicXML に変換して`
- `mikuscore で LilyPond から MusicXML に変換して`
- `mikuscore で MusicXML から MEI にしたい`
- `mikuscore でこの譜面を SVG にして`
- `mikuscore で MIDI から MusicXML にしたい`
- `mikuscore の diagnostics の見方を教えて`
- `mikuscore の AI handoff はなぜ ABC なの?`

## Install And Local Verification

### Normal Install

Build a distributable bundle:

```bash
npm run build:bundle
```

Then place the generated bundle contents under your skill home root.

This bundle includes:

- `skills/mikuscore`
- `skills/mikuscore/vendor/mikuscore`
- `skills/mikuscore/vendor/mikuscore/node_modules` for runtime use

That means the installed `skills/mikuscore` directory is intended to be self-contained enough to find its vendored runtime.

Expected layout:

```text
<skill-home>/
  skills/
    mikuscore/
      SKILL.md
      agents/
      references/
      vendor/
        mikuscore/
          README.md
          docs/
          scripts/
          src/
          node_modules/
```

Typical skill-home locations:

- Codex: `~/.codex/skills/mikuscore`
- GitHub Copilot: `~/.copilot/skills/mikuscore`
- Claude: `~/.claude/skills/mikuscore`

### Runtime And Transition State

The current bundle requires Node.js 20 or later to run the bundled CLI.

`vendor/mikuscore` is the current documented transition runtime, not the long-term package shape. The bundle now excludes development-only files and verifies isolated CLI behavior, but it still receives the Node runtime from the vendored upstream tree. The target shape is `skills/mikuscore/runtime/mikuscore.mjs`, plus `mikuscore.jar` when upstream provides a suitable Java CLI artifact. Until then, do not add new runtime lookup paths or skill-local conversion logic.

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

`npm run install:local` syncs the skill into repo-local `.codex/skills/mikuscore` and includes the current vendored transition runtime and its runtime dependencies inside the skill directory.

After that, start a new Codex session and invoke `mikuscore` explicitly.

## Documents

For repository-specific development notes:

- [docs/development.md](docs/development.md)
- [docs/agent-skill-design.md](docs/agent-skill-design.md)
