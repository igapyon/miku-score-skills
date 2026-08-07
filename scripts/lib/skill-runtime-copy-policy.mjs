import path from "node:path";

const developmentOnlyPathSegments = new Set([
  ".github",
  ".git",
  ".mikuscore-build",
  "__tests__",
  "screenshots",
  "test",
  "tests",
  "workplace"
]);
const developmentOnlyFileNames = new Set([
  ".DS_Store",
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
