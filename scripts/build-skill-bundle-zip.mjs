#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const bundleParentRoot = path.resolve(repoRoot, "bundle");
const bundleDirName = "mikuscore-skills";
const bundleRoot = path.resolve(bundleParentRoot, bundleDirName);
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(repoRoot, "package.json"), "utf8")
);
const zipFileName = `igapyon-mikuscore-skills-${packageJson.version}.zip`;
const zipPath = path.resolve(bundleParentRoot, zipFileName);

main();

function main() {
  if (!fs.existsSync(bundleRoot)) {
    throw new Error("missing bundle/mikuscore-skills. run build:bundle first.");
  }

  fs.rmSync(zipPath, { force: true });

  const result = spawnSync("zip", ["-qr", zipPath, "skills"], {
    cwd: bundleRoot,
    encoding: "utf8"
  });

  if (result.status !== 0) {
    throw new Error(result.stderr?.trim() || "zip command failed");
  }

  process.stdout.write([
    `[build:bundle:zip] generated bundle/${zipFileName}`,
    "[build:bundle:zip] archive root:",
    "  - skills/"
  ].join("\n"));
  process.stdout.write("\n");
}
