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

export function readText(p, trustedRoot) {
  if (trustedRoot && !isInsideRoot(trustedRoot, p)) {
    return "";
  }
  if (!fs.existsSync(p)) {
    return "";
  }
  return fs.readFileSync(p, "utf8");
}

export function exists(p, trustedRoot) {
  if (trustedRoot && !isInsideRoot(trustedRoot, p)) {
    return false;
  }
  return fs.existsSync(p);
}

export function parsePluginDirArg(argv) {
  const cwd = path.resolve(process.cwd());
  let dir = cwd;
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dir" || a === "--pluginDir") {
      dir = path.resolve(cwd, argv[++i] || ".");
      break;
    }
  }
  if (!isInsideRoot(cwd, dir)) {
    return {
      error: "--dir must resolve inside the current working directory",
      exitCode: 2,
      dir: cwd,
    };
  }
  return { dir };
}

export function walkFiles(rootDir, exts, options = {}) {
  const skipDirs = options.skipDirs ?? SKIP_DIRS;
  const skipFile = options.skipFile ?? (() => false);
  const trustedRoot = path.resolve(rootDir);
  const out = [];
  const stack = [trustedRoot];
  while (stack.length) {
    const dir = stack.pop();
    if (!isInsideRoot(trustedRoot, dir)) {
      continue;
    }
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
        const nextDir = path.join(dir, e.name);
        if (!isInsideRoot(trustedRoot, nextDir)) continue;
        stack.push(nextDir);
        continue;
      }
      if (!e.isFile()) continue;
      const full = path.join(dir, e.name);
      if (!isInsideRoot(trustedRoot, full)) continue;
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
  const trustedRoot = path.resolve(pluginDir);
  const pkgPath = path.join(trustedRoot, "package.json");
  if (!exists(pkgPath, trustedRoot)) {
    return { error: `missing package.json in ${trustedRoot}`, exitCode: 2 };
  }
  try {
    return { pkg: JSON.parse(readText(pkgPath, trustedRoot)), pkgPath };
  } catch (e) {
    return { error: `invalid package.json (${pkgPath}): ${e?.message || e}`, exitCode: 2 };
  }
}
