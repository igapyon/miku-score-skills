#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { shouldCopySkillRuntimePath } from "./lib/skill-runtime-copy-policy.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const bundleRoot = path.resolve(repoRoot, "bundle/miku-score-skills");
const bundleSkillsRoot = path.resolve(bundleRoot, "skills");
const sourceSkillRoot = path.resolve(repoRoot, "skills/igapyon-miku-score");
const upstreamRoot = path.resolve(repoRoot, "vendor/miku-score");
const upstreamPackageLockPath = path.resolve(upstreamRoot, "package-lock.json");
const upstreamNodeModulesRoot = path.resolve(upstreamRoot, "node_modules");
const bundleSkillRoot = path.resolve(bundleSkillsRoot, "igapyon-miku-score");
const bundleSkillVendorRoot = path.resolve(bundleSkillRoot, "vendor");
const bundledUpstreamRoot = path.resolve(bundleSkillVendorRoot, "miku-score");
const bundledUpstreamNodeModulesRoot = path.resolve(bundledUpstreamRoot, "node_modules");

main();

function main() {
  ensureSourceExists(sourceSkillRoot, "skills/igapyon-miku-score");
  ensureSourceExists(upstreamRoot, "vendor/miku-score");
  ensureSourceExists(upstreamPackageLockPath, "vendor/miku-score/package-lock.json");
  ensureSourceExists(upstreamNodeModulesRoot, "vendor/miku-score/node_modules");

  fs.rmSync(bundleRoot, { recursive: true, force: true });
  fs.mkdirSync(bundleSkillsRoot, { recursive: true });

  fs.cpSync(sourceSkillRoot, bundleSkillRoot, {
    recursive: true,
    filter(sourcePath) {
      return shouldCopySkillRuntimePath(sourceSkillRoot, sourcePath);
    }
  });
  fs.mkdirSync(bundleSkillVendorRoot, { recursive: true });
  fs.cpSync(upstreamRoot, bundledUpstreamRoot, {
    recursive: true,
    filter(sourcePath) {
      const relativePath = path.relative(upstreamRoot, sourcePath);
      if (!relativePath) return true;
      return !relativePath.split(path.sep).includes("node_modules")
        && shouldCopySkillRuntimePath(upstreamRoot, sourcePath);
    }
  });
  copyRuntimeDependencies();

  process.stdout.write([
    "[build:bundle] generated bundle/miku-score-skills",
    "[build:bundle] copy this directory's contents under your skill home root",
    "[build:bundle] included:",
    "  - skills/igapyon-miku-score",
    "  - skills/igapyon-miku-score/vendor/miku-score (transition runtime; development-only files excluded)",
    "  - skills/igapyon-miku-score/vendor/miku-score/node_modules (runtime only)"
  ].join("\n"));
  process.stdout.write("\n");
}

function ensureSourceExists(targetPath, label) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`missing source directory: ${label}`);
  }
}

function copyRuntimeDependencies() {
  const packageLock = JSON.parse(fs.readFileSync(upstreamPackageLockPath, "utf8"));
  const packages = packageLock.packages || {};
  const requiredPackages = collectRequiredPackages(packages, ["jsdom", "typescript"]);

  fs.mkdirSync(bundledUpstreamNodeModulesRoot, { recursive: true });
  for (const packageName of requiredPackages) {
    const sourceDir = path.resolve(upstreamNodeModulesRoot, packageName);
    ensureSourceExists(sourceDir, `vendor/miku-score/node_modules/${packageName}`);
    fs.cpSync(sourceDir, path.resolve(bundledUpstreamNodeModulesRoot, packageName), {
      recursive: true,
      filter(sourcePath) {
        return shouldCopySkillRuntimePath(sourceDir, sourcePath);
      }
    });
  }
}

function collectRequiredPackages(packages, roots) {
  const pending = [...roots];
  const required = new Set();

  while (pending.length > 0) {
    const packageName = pending.pop();
    if (!packageName || required.has(packageName)) {
      continue;
    }

    const packageKey = `node_modules/${packageName}`;
    const packageInfo = packages[packageKey];
    if (!packageInfo) {
      throw new Error(`vendor/miku-score/package-lock.json missing entry for ${packageKey}`);
    }

    required.add(packageName);
    for (const dependencyName of Object.keys(packageInfo.dependencies || {})) {
      pending.push(dependencyName);
    }
  }

  return Array.from(required).sort((left, right) => left.localeCompare(right));
}
