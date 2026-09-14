import fs from "node:fs";
import path from "node:path";

export const SKIP_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  ".build",
  ".gradle",
  "Pods",
  "DerivedData",
  ".swiftpm",
  ".git",
  "example-app",
]);

export function isInsideRoot(root, target) {
  const resolvedRoot = path.resolve(root);
  const resolvedTarget = path.resolve(target);
  const rel = path.relative(resolvedRoot, resolvedTarget);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}

export function readText(filePath, trustedRoot) {
  if (trustedRoot && !isInsideRoot(trustedRoot, filePath)) {
    return "";
  }
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    if (process.env.DEBUG_PLUGIN_SCAN === "1") {
      console.debug(`[plugin-scan] skip unreadable file ${filePath}: ${error?.message || error}`);
    }
    return "";
  }
}

export function exists(filePath, trustedRoot) {
  if (trustedRoot && !isInsideRoot(trustedRoot, filePath)) {
    return false;
  }
  return fs.existsSync(filePath);
}

export function parsePluginDirArg(_argv) {
  return { dir: path.resolve(process.cwd()) };
}

function readDirEntries(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch (error) {
    if (process.env.DEBUG_PLUGIN_SCAN === "1") {
      console.debug(`[plugin-scan] skip unreadable dir ${dir}: ${error?.message || error}`);
    }
    return [];
  }
}

function pushMatchingFile(fullPath, fileName, exts, skipFile, out) {
  if (skipFile(fullPath)) return;
  for (const ext of exts) {
    if (fileName.endsWith(ext)) {
      out.push(fullPath);
      return;
    }
  }
}

function visitEntry(entry, dir, trustedRoot, skipDirs, exts, skipFile, stack, out) {
  const full = path.join(dir, entry.name);
  if (!isInsideRoot(trustedRoot, full)) return;
  if (entry.isDirectory()) {
    if (!skipDirs.has(entry.name)) stack.push(full);
    return;
  }
  if (!entry.isFile()) return;
  pushMatchingFile(full, entry.name, exts, skipFile, out);
}

export function walkFiles(rootDir, exts, options = {}) {
  const skipDirs = options.skipDirs ?? SKIP_DIRS;
  const skipFile = options.skipFile ?? (() => false);
  const trustedRoot = path.resolve(rootDir);
  if (!fs.existsSync(trustedRoot)) {
    return [];
  }
  const out = [];
  const stack = [trustedRoot];
  while (stack.length) {
    const dir = stack.pop();
    if (!isInsideRoot(trustedRoot, dir)) continue;
    for (const entry of readDirEntries(dir)) {
      visitEntry(entry, dir, trustedRoot, skipDirs, exts, skipFile, stack, out);
    }
  }
  return [...new Set(out)].sort((a, b) => a.localeCompare(b));
}

export function lineLooksCommentOnly(line) {
  const t = line.trim();
  return t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") || t.startsWith("#");
}

export function loadPluginPackage(pluginDir) {
  const trustedRoot = path.resolve(pluginDir);
  const pkgPath = path.join(trustedRoot, "package.json");
  if (!exists(pkgPath, trustedRoot)) {
    return { error: `missing package.json in ${trustedRoot}`, exitCode: 2 };
  }
  try {
    return { pkg: JSON.parse(readText(pkgPath, trustedRoot)), pkgPath };
  } catch (error) {
    return { error: `invalid package.json (${pkgPath}): ${error?.message || error}`, exitCode: 2 };
  }
}
