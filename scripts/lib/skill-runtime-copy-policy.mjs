import path from "node:path";

const developmentOnlyPathSegments = new Set([
  ".github",
  ".git",
  ".miku-score-build",
  "__tests__",
  "screenshots",
  "test",
  "tests",
  "workplace"
]);
const developmentOnlyFileNames = new Set([
  ".DS_Store",
  ".tsbuildinfo",
  ".gitignore"
]);

export function shouldCopySkillRuntimePath(sourceRoot, sourcePath) {
  const relativePath = path.relative(sourceRoot, sourcePath);
  if (!relativePath) {
    return true;
  }

  return !relativePath.split(path.sep).some((segment) => {
    return developmentOnlyPathSegments.has(segment)
      || developmentOnlyFileNames.has(segment);
  });
}
