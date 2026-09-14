#!/usr/bin/env node
/**
 * Capacitor 9 removed/deprecated native API guard for plugin packages.
 *
 * Fails CI when plugin sources still call APIs removed in Capacitor 9.
 * See https://capacitorjs.com/docs/next/updating/plugins/9-0
 *
 * Package.swift is not scanned (Cordova SPM product dependency is allowed on Cap 8).
 *
 * Usage:
 *   node scripts/check-cap9-deprecated.mjs
 *   node scripts/check-cap9-deprecated.mjs --dir path/to/plugin
 */

import fs from "node:fs";
import path from "node:path";

const SKIP_DIRS = new Set([
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

/** @type {{ id: string; exts: string[]; re: RegExp; hint: string }[]} */
const RULES = [
  {
    id: "plugin-call-hasOption",
    exts: [".java", ".kt", ".swift"],
    re: /\.hasOption\s*\(/,
    hint: "Use typed accessors (getString, getInt, etc.) instead of hasOption.",
  },
  {
    id: "plugin-call-save",
    exts: [".java", ".kt"],
    re: /\b(?:call|[A-Za-z_][A-Za-z0-9_]*Call)\.save\s*\(\s*\)/,
    hint: "Use setKeepAlive(true) instead of PluginCall.save().",
  },
  {
    id: "plugin-call-isSaved",
    exts: [".java", ".kt"],
    re: /\b(?:call|[A-Za-z_][A-Za-z0-9_]*Call)\.isSaved\s*\(\s*\)/,
    hint: "Use isKeptAlive() instead of isSaved().",
  },
  {
    id: "plugin-call-isReleased",
    exts: [".java", ".kt"],
    re: /\b(?:call|[A-Za-z_][A-Za-z0-9_]*Call)\.isReleased\s*\(\s*\)/,
    hint: "isReleased() was removed; released calls are managed by the bridge.",
  },
  {
    id: "plugin-getConfigValue",
    exts: [".java", ".kt", ".swift"],
    re: /\.getConfigValue\s*\(/,
    hint: "Use getConfig() and typed PluginConfig accessors.",
  },
  {
    id: "android-native-plugin-annotation",
    exts: [".java", ".kt"],
    re: /@NativePlugin\b/,
    hint: "Use @CapacitorPlugin instead of @NativePlugin.",
  },
  {
    id: "android-saveCall",
    exts: [".java", ".kt"],
    re: /\bsaveCall\s*\(/,
    hint: "Use Bridge.saveCall(PluginCall) or PluginCall.setKeepAlive(true).",
  },
  {
    id: "android-getSavedCall-no-arg",
    exts: [".java", ".kt"],
    re: /\bgetSavedCall\s*\(\s*\)/,
    hint: "Use Bridge.getSavedCall(String) with a callback id.",
  },
  {
    id: "android-freeSavedCall",
    exts: [".java", ".kt"],
    re: /\bfreeSavedCall\s*\(/,
    hint: "Use PluginCall.release(Bridge) instead of freeSavedCall().",
  },
  {
    id: "android-https-interceptor-start",
    exts: [".java", ".kt"],
    re: /\bCAPACITOR_HTTPS_INTERCEPTOR_START\b/,
    hint: "Use CAPACITOR_HTTP_INTERCEPTOR_START instead.",
  },
  {
    id: "ios-cap-bridge-class",
    exts: [".swift"],
    re: /\bCAPBridge\./,
    hint: "CAPBridge was removed; use Cap 9 replacements (ApplicationDelegateProxy, Notification.Name, etc.).",
  },
  {
    id: "ios-cap-notifications-enum",
    exts: [".swift"],
    re: /\bCAPNotifications\b/,
    hint: "Use Notification.Name.capacitor* constants instead of CAPNotifications.",
  },
  {
    id: "ios-https-interceptor-start",
    exts: [".swift"],
    re: /\bhttpsInterceptorStartIdentifier\b/,
    hint: "Use httpInterceptorStartIdentifier instead.",
  },
  {
    id: "ios-getPluginConfigValue",
    exts: [".swift"],
    re: /\.getPluginConfigValue\s*\(/,
    hint: "Use getPluginConfig(_:) instead.",
  },
];

function readText(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
}

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function parseArgs(argv) {
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

function walkFiles(rootDir, exts) {
  const out = [];
  const stack = [rootDir];
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      if (e.isDirectory()) {
        if (SKIP_DIRS.has(e.name)) continue;
        stack.push(path.join(dir, e.name));
        continue;
      }
      if (!e.isFile()) continue;
      const full = path.join(dir, e.name);
      if (path.basename(full) === "Package.swift") continue;
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

function lineLooksCommentOnly(line) {
  const t = line.trim();
  return t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") || t.startsWith("#");
}

function scanFile(filePath, rulesForExt) {
  const hits = [];
  const lines = readText(filePath).split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (lineLooksCommentOnly(line)) continue;
    for (const rule of rulesForExt) {
      if (rule.re.test(line)) {
        hits.push({ rule, line: i + 1, text: line.trim() });
      }
    }
  }
  return hits;
}

function collectScanRoots(pluginDir, pkg) {
  const cap = typeof pkg.capacitor === "object" && pkg.capacitor ? pkg.capacitor : {};
  const roots = [];
  if (cap.android) {
    const androidSrc = path.join(pluginDir, "android", "src");
    if (exists(androidSrc)) roots.push(androidSrc);
  }
  if (cap.ios) {
    const iosSources = path.join(pluginDir, "ios", "Sources");
    const iosDir = path.join(pluginDir, "ios");
    if (exists(iosSources)) roots.push(iosSources);
    else if (exists(iosDir)) roots.push(iosDir);
  }
  return roots;
}

const args = parseArgs(process.argv);
const pluginDir = args.dir;
const pkgPath = path.join(pluginDir, "package.json");

if (!exists(pkgPath)) {
  console.error(`[cap9-deprecated] ERROR: missing package.json in ${pluginDir}`);
  process.exit(2);
}

let pkg;
try {
  pkg = JSON.parse(readText(pkgPath));
} catch (e) {
  console.error(`[cap9-deprecated] ERROR: invalid package.json (${pkgPath}): ${e?.message || e}`);
  process.exit(2);
}

const cap = typeof pkg.capacitor === "object" && pkg.capacitor ? pkg.capacitor : {};
if (!cap.android && !cap.ios) {
  process.exit(0);
}

const allExts = [...new Set(RULES.flatMap((r) => r.exts))];
const scanRoots = collectScanRoots(pluginDir, pkg);
if (!scanRoots.length) {
  process.exit(0);
}

const violations = [];
for (const root of scanRoots) {
  const files = walkFiles(root, allExts);
  for (const file of files) {
    const ext = path.extname(file);
    const rulesForExt = RULES.filter((r) => r.exts.includes(ext));
    if (!rulesForExt.length) continue;
    for (const hit of scanFile(file, rulesForExt)) {
      violations.push({ file, ...hit });
    }
  }
}

if (!violations.length) {
  process.exit(0);
}

const relDir = path.relative(process.cwd(), pluginDir) || ".";
console.error(`[cap9-deprecated] FAIL in ${relDir}`);
for (const v of violations) {
  const relFile = path.relative(pluginDir, v.file);
  console.error(`- ${relFile}:${v.line} [${v.rule.id}] ${v.text}`);
  console.error(`  ${v.rule.hint}`);
}
process.exit(1);
