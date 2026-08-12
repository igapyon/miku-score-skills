#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const requiredPaths = [
  "skills/igapyon-miku-score/SKILL.md",
  "skills/igapyon-miku-score/agents/openai.yaml",
  "skills/igapyon-miku-score/index.json",
  "skills/igapyon-miku-score/references/INDEX.md",
  "docs/agent-skill-design.md",
  "docs/development.md",
  "vendor/miku-score/README.md"
];

main();

function main() {
  const missing = requiredPaths.filter((relativePath) => {
    return !fs.existsSync(path.resolve(repoRoot, relativePath));
  });

  if (missing.length > 0) {
    throw new Error(`missing required paths:\n${missing.map((item) => `- ${item}`).join("\n")}`);
  }

  if (fs.existsSync(path.resolve(repoRoot, "skills/mikuscore"))) {
    throw new Error("legacy skills/mikuscore directory must not exist");
  }

  const skillText = fs.readFileSync(
    path.resolve(repoRoot, "skills/igapyon-miku-score/SKILL.md"),
    "utf8"
  );
  const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(repoRoot, "package.json"), "utf8")
  );
  if (packageJson.name !== "miku-score-skills") {
    throw new Error(`unexpected package name: ${packageJson.name}`);
  }
  const requiredActivationContract = [
    "name: igapyon-miku-score",
    "Formal triggers are `igapyon-miku-score`, `miku-score`, and `miku-score-skills`.",
    "Compatibility triggers are `mikuscore` and `mikuscore-skills`",
    "Do not trigger from format names alone."
  ];
  const missingActivationContract = requiredActivationContract.filter((fragment) => !skillText.includes(fragment));
  if (missingActivationContract.length > 0) {
    throw new Error(`missing activation contract:\n${missingActivationContract.map((item) => `- ${item}`).join("\n")}`);
  }

  process.stdout.write("[test] skill structure looks valid\n");
}
