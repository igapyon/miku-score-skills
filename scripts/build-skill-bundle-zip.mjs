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
const defaultSourceDateEpoch = 946684800;

main();

function main() {
  if (!fs.existsSync(bundleRoot)) {
    throw new Error("missing bundle/mikuscore-skills. run build:bundle first.");
  }

  fs.rmSync(zipPath, { force: true });
  const archiveDate = resolveArchiveDate();
  setTreeTimestamps(bundleRoot, archiveDate);
  const archiveEntries = listArchiveEntries(bundleRoot);

  const result = spawnSync("zip", ["-X", "-q", zipPath, "-@"], {
    cwd: bundleRoot,
    encoding: "utf8",
    input: `${archiveEntries.join("\n")}\n`,
    env: {
      ...process.env,
      TZ: "UTC"
    }
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

function resolveArchiveDate() {
  const sourceDateEpoch = Number.parseInt(
    process.env.SOURCE_DATE_EPOCH || `${defaultSourceDateEpoch}`,
    10
  );
  if (!Number.isInteger(sourceDateEpoch) || sourceDateEpoch < 315532800) {
    throw new Error("SOURCE_DATE_EPOCH must be an integer Unix timestamp on or after 1980-01-01.");
  }
  return new Date(sourceDateEpoch * 1000);
}

function setTreeTimestamps(targetPath, timestamp) {
  const entries = fs.readdirSync(targetPath, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name));

  for (const entry of entries) {
    const entryPath = path.resolve(targetPath, entry.name);
    if (entry.isDirectory()) {
      setTreeTimestamps(entryPath, timestamp);
    }
    fs.utimesSync(entryPath, timestamp, timestamp);
  }
  fs.utimesSync(targetPath, timestamp, timestamp);
}

function listArchiveEntries(rootPath, relativePath = "") {
  const entries = [];
  const targetPath = path.resolve(rootPath, relativePath);
  const relativeDirectory = relativePath ? `${relativePath}/` : "";
  if (relativeDirectory) {
    entries.push(relativeDirectory);
  }

  for (const entry of fs.readdirSync(targetPath, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))) {
    const entryRelativePath = path.posix.join(relativePath, entry.name);
    if (entry.isDirectory()) {
      entries.push(...listArchiveEntries(rootPath, entryRelativePath));
    } else {
      entries.push(entryRelativePath);
    }
  }
  return entries;
}
