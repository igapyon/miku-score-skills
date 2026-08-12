#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const buildScriptPath = path.resolve(repoRoot, "scripts/build-skill-bundle.mjs");
const buildZipScriptPath = path.resolve(repoRoot, "scripts/build-skill-bundle-zip.mjs");
const packageJson = JSON.parse(fs.readFileSync(path.resolve(repoRoot, "package.json"), "utf8"));
const zipPath = path.resolve(
  repoRoot,
  `bundle/igapyon-miku-score-skills-${packageJson.version}.zip`
);
const forbiddenPathSegments = new Set([
  ".github",
  ".git",
  ".miku-score-build",
  ".tsbuildinfo",
  ".DS_Store",
  "__tests__",
  "screenshots",
  "test",
  "tests",
  "workplace"
]);

const ABC_SAMPLE = [
  "X:1",
  "T:Bundle Smoke",
  "M:4/4",
  "L:1/4",
  "K:C",
  "C D E F"
].join("\n");

main();

function main() {
  execFileSync("node", [buildScriptPath], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  verifyBundleContents();
  verifyZipDeterminism();

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "miku-score-bundle-test-"));
  try {
    const isolatedSkillsRoot = path.resolve(tempRoot, "skills");
    fs.cpSync(path.resolve(repoRoot, "bundle/miku-score-skills/skills"), isolatedSkillsRoot, {
      recursive: true
    });

    const isolatedCliPath = path.resolve(
      isolatedSkillsRoot,
      "igapyon-miku-score/vendor/miku-score/scripts/miku-score-cli.mjs"
    );
    const bundledRuntimeVersion = JSON.parse(fs.readFileSync(
      path.resolve(
        isolatedSkillsRoot,
        "igapyon-miku-score/vendor/miku-score/package.json"
      ),
      "utf8"
    )).version;
    const versionOutput = runCli(isolatedCliPath, ["--version"], "");
    if (versionOutput.stdout.trim() !== bundledRuntimeVersion) {
      throw new Error(
        `isolated bundle --version returned ${JSON.stringify(versionOutput.stdout.trim())}, expected ${bundledRuntimeVersion}`
      );
    }
    const output = runCli(
      isolatedCliPath,
      [
        "convert",
        "--from",
        "abc",
        "--to",
        "musicxml",
        "--diagnostics",
        "json"
      ],
      ABC_SAMPLE
    );

    if (!output.stdout.includes("<score-partwise")) {
      throw new Error("isolated bundle conversion did not produce MusicXML output");
    }
    const conversionDiagnostics = JSON.parse(output.stderr);
    if (conversionDiagnostics.ok !== true || conversionDiagnostics.status !== "success") {
      throw new Error("isolated bundle conversion did not return success diagnostics");
    }

    const outputDirectory = path.resolve(tempRoot, "miku-score/output");
    fs.mkdirSync(outputDirectory, { recursive: true });
    const svgPath = path.resolve(outputDirectory, "bundle-smoke.svg");
    runCli(
      isolatedCliPath,
      ["render", "svg", "--from", "abc", "--out", svgPath],
      ABC_SAMPLE
    );
    if (!fs.readFileSync(svgPath, "utf8").includes("<svg")) {
      throw new Error("isolated bundle render did not write SVG output");
    }

    const usageFailure = spawnSync(
      "node",
      [
        isolatedCliPath,
        "convert",
        "--from",
        "abc",
        "--diagnostics",
        "json"
      ],
      {
        cwd: tempRoot,
        input: ABC_SAMPLE,
        encoding: "utf8"
      }
    );
    if (usageFailure.status !== 2) {
      throw new Error(`isolated bundle usage failure returned ${usageFailure.status}, expected 2`);
    }
    const usageDiagnostics = JSON.parse(usageFailure.stderr);
    if (usageDiagnostics.error_type !== "usage_error" || usageDiagnostics.error_code !== "missing_from_to") {
      throw new Error("isolated bundle usage failure did not preserve structured diagnostics");
    }

    process.stdout.write("[test] isolated bundle CLI convert, render, and diagnostics passed\n");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

function verifyBundleContents() {
  const bundleSkillRoot = path.resolve(repoRoot, "bundle/miku-score-skills/skills/igapyon-miku-score");
  const legacyBundleSkillRoot = path.resolve(repoRoot, "bundle/miku-score-skills/skills/mikuscore");
  if (fs.existsSync(legacyBundleSkillRoot)) {
    throw new Error("bundle must not contain a legacy skills/mikuscore directory");
  }
  const requiredPaths = [
    "SKILL.md",
    "index.json",
    "references/INDEX.md",
    "vendor/miku-score/scripts/miku-score-cli.mjs",
    "vendor/miku-score/LICENSE",
    "vendor/miku-score/THIRD-PARTY-NOTICES.md"
  ];
  for (const relativePath of requiredPaths) {
    if (!fs.existsSync(path.resolve(bundleSkillRoot, relativePath))) {
      throw new Error(`bundle is missing required path: ${relativePath}`);
    }
  }
  assertNoForbiddenPaths(bundleSkillRoot, "bundle");
}

function verifyZipDeterminism() {
  execFileSync("node", [buildZipScriptPath], { cwd: repoRoot, encoding: "utf8" });
  const firstHash = hashFile(zipPath);
  execFileSync("node", [buildZipScriptPath], { cwd: repoRoot, encoding: "utf8" });
  const secondHash = hashFile(zipPath);
  if (firstHash !== secondHash) {
    throw new Error(`bundle zip is not reproducible: ${firstHash} != ${secondHash}`);
  }

  const archiveEntries = execFileSync("unzip", ["-Z1", zipPath], {
    cwd: repoRoot,
    encoding: "utf8"
  }).trim().split("\n").filter(Boolean);
  for (const archiveEntry of archiveEntries) {
    assertNoForbiddenPath(archiveEntry, "zip");
  }
  process.stdout.write("[test] bundle contents and zip determinism passed\n");
}

function runCli(cliPath, args, input) {
  const result = spawnSync("node", [cliPath, ...args], {
    input,
    encoding: "utf8"
  });
  if (result.status !== 0) {
    throw new Error(`isolated CLI command failed: ${args.join(" ")}\n${result.stderr}`);
  }
  return result;
}

function assertNoForbiddenPaths(rootPath, label) {
  for (const entry of fs.readdirSync(rootPath, { withFileTypes: true })) {
    const entryPath = path.resolve(rootPath, entry.name);
    assertNoForbiddenPath(entry.name, label);
    if (entry.isDirectory()) {
      assertNoForbiddenPaths(entryPath, label);
    }
  }
}

function assertNoForbiddenPath(relativePath, label) {
  const pathSegments = relativePath.split(/[\\/]/).filter(Boolean);
  const forbiddenPathSegment = pathSegments.find((segment) => forbiddenPathSegments.has(segment));
  if (forbiddenPathSegment) {
    throw new Error(`${label} contains excluded development path: ${relativePath}`);
  }
}

function hashFile(targetPath) {
  return createHash("sha256").update(fs.readFileSync(targetPath)).digest("hex");
}
