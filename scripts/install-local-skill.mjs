#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { shouldCopySkillRuntimePath } from "./lib/skill-runtime-copy-policy.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const sourceSkillRoot = path.resolve(repoRoot, "skills/mikuscore");
const upstreamRoot = path.resolve(repoRoot, "vendor/mikuscore");
const upstreamPackageLockPath = path.resolve(upstreamRoot, "package-lock.json");
const upstreamNodeModulesRoot = path.resolve(upstreamRoot, "node_modules");
const localCodexSkillsRoot = path.resolve(repoRoot, ".codex/skills");
const targetSkillRoot = path.resolve(localCodexSkillsRoot, "mikuscore");
const targetUpstreamRoot = path.resolve(targetSkillRoot, "vendor", "mikuscore");
const targetUpstreamNodeModulesRoot = path.resolve(targetUpstreamRoot, "node_modules");

main();

function main() {
  ensureSourceExists(sourceSkillRoot, "skills/mikuscore");
  ensureSourceExists(upstreamRoot, "vendor/mikuscore");
  ensureSourceExists(upstreamPackageLockPath, "vendor/mikuscore/package-lock.json");
  ensureSourceExists(upstreamNodeModulesRoot, "vendor/mikuscore/node_modules");

  fs.mkdirSync(localCodexSkillsRoot, { recursive: true });
  fs.rmSync(targetSkillRoot, { recursive: true, force: true });
  fs.cpSync(sourceSkillRoot, targetSkillRoot, {
    recursive: true,
    filter(sourcePath) {
      return shouldCopySkillRuntimePath(sourceSkillRoot, sourcePath);
    }
  });
  fs.mkdirSync(path.resolve(targetSkillRoot, "vendor"), { recursive: true });
  fs.cpSync(upstreamRoot, targetUpstreamRoot, {
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
    "[install:local] synced skill into repo-local Codex home",
    `[install:local] source: ${path.relative(repoRoot, sourceSkillRoot)}`,
    `[install:local] target: ${path.relative(repoRoot, targetSkillRoot)}`,
    "[install:local] included filtered vendor/mikuscore transition runtime under the skill directory",
    "[install:local] included vendor/mikuscore/node_modules (runtime only)"
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

  fs.mkdirSync(targetUpstreamNodeModulesRoot, { recursive: true });
  for (const packageName of requiredPackages) {
    const sourceDir = path.resolve(upstreamNodeModulesRoot, packageName);
    ensureSourceExists(sourceDir, `vendor/mikuscore/node_modules/${packageName}`);
    fs.cpSync(sourceDir, path.resolve(targetUpstreamNodeModulesRoot, packageName), {
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
      throw new Error(`vendor/mikuscore/package-lock.json missing entry for ${packageKey}`);
    }

    required.add(packageName);
    for (const dependencyName of Object.keys(packageInfo.dependencies || {})) {
      pending.push(dependencyName);
    }
  }

  return Array.from(required).sort((left, right) => left.localeCompare(right));
}
