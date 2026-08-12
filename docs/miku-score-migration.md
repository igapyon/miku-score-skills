# miku-score Identity Migration

The canonical repository name is `miku-score-skills`; the canonical installed
Agent Skill identity is `igapyon-miku-score` at
`skills/igapyon-miku-score/`.

## Trigger policy

Formal triggers are `igapyon-miku-score`, `miku-score`, and
`miku-score-skills`. The compatibility triggers `mikuscore` and
`mikuscore-skills` activate the same `igapyon-miku-score` skill. No legacy
`skills/mikuscore/` directory or duplicate implementation is permitted.

Compatibility triggers remain until a separately approved breaking-change
migration verifies that users have been notified, the formal triggers have
been distributed in a release, and removing the compatibility assertions has
its own tested rollout. This migration does not set that removal date.

## Legacy-name allowlist

The following residual uses of `mikuscore` are intentional:

- the two compatibility triggers above;
- dated `docs/miku-soft-*-v20260425.md` design snapshots, which preserve the
  terminology used at publication time; and
- internal filenames such as `miku-score-cli.mjs` and `.miku-score-build` inside
  the transition runtime at `vendor/miku-score/`, plus root test and copy-policy
  references that verify those implementation details are excluded or reached
  correctly. They are not Agent Skill identities.
- the negative structure assertion that ensures `skills/mikuscore/` is absent.

All repository/package names, source and installed skill paths, bundle paths,
release ZIP names, and local deployment paths use the canonical names.
