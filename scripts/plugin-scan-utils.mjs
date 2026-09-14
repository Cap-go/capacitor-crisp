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

export function readText(p) {
  if (!fs.existsSync(p)) {
    return "";
  }
  return fs.readFileSync(p, "utf8");
}

export function exists(p) {
  return fs.existsSync(p);
}

export function parsePluginDirArg(argv) {
  const out = { dir: process.cwd() };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dir" || a === "--pluginDir") {
      out.dir = path.resolve(argv[++i] || ".");
      continue;
    }
  }
  return out;
}

export function walkFiles(rootDir, exts, options = {}) {
  const skipDirs = options.skipDirs ?? SKIP_DIRS;
  const skipFile = options.skipFile ?? (() => false);
  const out = [];
  const stack = [rootDir];
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (error) {
      if (process.env.DEBUG_PLUGIN_SCAN === "1") {
        console.debug(`[plugin-scan] skip unreadable dir ${dir}: ${error?.message || error}`);
      }
      continue;
    }
    for (const e of entries) {
      if (e.isDirectory()) {
        if (skipDirs.has(e.name)) continue;
        stack.push(path.join(dir, e.name));
        continue;
      }
      if (!e.isFile()) continue;
      const full = path.join(dir, e.name);
      if (skipFile(full)) continue;
      for (const ext of exts) {
        if (e.name.endsWith(ext)) {
          out.push(full);
          break;
        }
      }
    }
  }
  out.sort();
  return out;
}

export function lineLooksCommentOnly(line) {
  const t = line.trim();
  return t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") || t.startsWith("#");
}

export function loadPluginPackage(pluginDir) {
  const pkgPath = path.join(pluginDir, "package.json");
  if (!exists(pkgPath)) {
    return { error: `missing package.json in ${pluginDir}`, exitCode: 2 };
  }
  try {
    return { pkg: JSON.parse(readText(pkgPath)), pkgPath };
  } catch (e) {
    return { error: `invalid package.json (${pkgPath}): ${e?.message || e}`, exitCode: 2 };
  }
}
