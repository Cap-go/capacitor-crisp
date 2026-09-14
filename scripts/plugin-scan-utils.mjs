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
  if (!fs.existsSync(trustedRoot)) {
    return [];
  }
  const ignore = [...skipDirs].map((name) => `**/${name}/**`);
  const out = [];
  for (const ext of exts) {
    const matches = fs.globSync(`**/*${ext}`, {
      cwd: trustedRoot,
      exclude: ignore,
    });
    for (const rel of matches) {
      const full = path.join(trustedRoot, rel);
      if (!isInsideRoot(trustedRoot, full)) continue;
      if (skipFile(full)) continue;
      out.push(full);
    }
  }
  return [...new Set(out)].sort();
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
