#!/usr/bin/env node
/**
 * Capacitor 9 removed/deprecated native API guard for plugin packages.
 *
 * See https://capacitorjs.com/docs/next/updating/plugins/9-0
 * Package.swift is not scanned (Cordova SPM product dependency is allowed on Cap 8).
 */

import fs from "node:fs";
import path from "node:path";

const PLUGIN_DIR = path.resolve(process.cwd());
const SKIP_GLOB = ["**/node_modules/**", "**/example-app/**"];

/** @type {{ id: string; exts: string[]; match: (line: string) => boolean; hint: string }[]} */
const RULES = [
  {
    id: "plugin-call-hasOption",
    exts: [".java", ".kt", ".swift"],
    match: (line) => line.includes(".hasOption("),
    hint: "Use typed accessors (getString, getInt, etc.) instead of hasOption.",
  },
  {
    id: "plugin-call-save",
    exts: [".java", ".kt"],
    match: (line) => /\b(?:call|[A-Za-z_][A-Za-z0-9_]*Call)\.save\s*\(\s*\)/.test(line),
    hint: "Use setKeepAlive(true) instead of PluginCall.save().",
  },
  {
    id: "plugin-call-isSaved",
    exts: [".java", ".kt"],
    match: (line) => line.includes(".isSaved("),
    hint: "Use isKeptAlive() instead of isSaved().",
  },
  {
    id: "plugin-call-isReleased",
    exts: [".java", ".kt"],
    match: (line) => line.includes(".isReleased("),
    hint: "isReleased() was removed; released calls are managed by the bridge.",
  },
  {
    id: "plugin-getConfigValue",
    exts: [".java", ".kt", ".swift"],
    match: (line) => line.includes(".getConfigValue("),
    hint: "Use getConfig() and typed PluginConfig accessors.",
  },
  {
    id: "android-native-plugin-annotation",
    exts: [".java", ".kt"],
    match: (line) => line.includes("@NativePlugin"),
    hint: "Use @CapacitorPlugin instead of @NativePlugin.",
  },
  {
    id: "android-saveCall",
    exts: [".java", ".kt"],
    match: (line) => line.includes("saveCall(") && !line.includes("Bridge.saveCall("),
    hint: "Use Bridge.saveCall(PluginCall) or PluginCall.setKeepAlive(true).",
  },
  {
    id: "android-getSavedCall-no-arg",
    exts: [".java", ".kt"],
    match: (line) => line.includes("getSavedCall()"),
    hint: "Use Bridge.getSavedCall(String) with a callback id.",
  },
  {
    id: "android-freeSavedCall",
    exts: [".java", ".kt"],
    match: (line) => line.includes("freeSavedCall("),
    hint: "Use PluginCall.release(Bridge) instead of freeSavedCall().",
  },
  {
    id: "android-https-interceptor-start",
    exts: [".java", ".kt"],
    match: (line) => line.includes("CAPACITOR_HTTPS_INTERCEPTOR_START"),
    hint: "Use CAPACITOR_HTTP_INTERCEPTOR_START instead.",
  },
  {
    id: "ios-cap-bridge-class",
    exts: [".swift"],
    match: (line) => line.includes("CAPBridge."),
    hint: "CAPBridge was removed; use Cap 9 replacements (ApplicationDelegateProxy, Notification.Name, etc.).",
  },
  {
    id: "ios-cap-notifications-enum",
    exts: [".swift"],
    match: (line) => line.includes("CAPNotifications"),
    hint: "Use Notification.Name.capacitor* constants instead of CAPNotifications.",
  },
  {
    id: "ios-https-interceptor-start",
    exts: [".swift"],
    match: (line) => line.includes("httpsInterceptorStartIdentifier"),
    hint: "Use httpInterceptorStartIdentifier instead.",
  },
  {
    id: "ios-getPluginConfigValue",
    exts: [".swift"],
    match: (line) => line.includes(".getPluginConfigValue("),
    hint: "Use getPluginConfig(_:) instead.",
  },
];

function readPackageJson() {
  const pkgPath = path.join(PLUGIN_DIR, "package.json");
  if (!fs.existsSync(pkgPath)) {
    console.error(`[cap9-deprecated] ERROR: missing package.json in ${PLUGIN_DIR}`);
    process.exit(2);
  }
  try {
    return JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  } catch (error) {
    console.error(`[cap9-deprecated] ERROR: invalid package.json: ${error?.message || error}`);
    process.exit(2);
  }
}

function lineLooksCommentOnly(line) {
  const t = line.trim();
  return t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") || t.startsWith("#");
}

function collectScanRoots(pkg) {
  const cap = typeof pkg.capacitor === "object" && pkg.capacitor ? pkg.capacitor : {};
  const roots = [];
  if (cap.android) {
    const androidSrc = path.join(PLUGIN_DIR, "android", "src");
    if (fs.existsSync(androidSrc)) roots.push(androidSrc);
  }
  if (cap.ios) {
    const iosSources = path.join(PLUGIN_DIR, "ios", "Sources");
    const iosDir = path.join(PLUGIN_DIR, "ios");
    if (fs.existsSync(iosSources)) roots.push(iosSources);
    else if (fs.existsSync(iosDir)) roots.push(iosDir);
  }
  return roots;
}

function listSourceFiles(root, exts) {
  const files = [];
  for (const ext of exts) {
    const relPaths = fs.globSync(`**/*${ext}`, { cwd: root, exclude: SKIP_GLOB });
    for (const rel of relPaths) {
      if (path.basename(rel) === "Package.swift") continue;
      files.push(path.join(root, rel));
    }
  }
  return [...new Set(files)].sort();
}

function scanFile(filePath, rulesForExt) {
  const hits = [];
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (lineLooksCommentOnly(line)) continue;
    for (const rule of rulesForExt) {
      if (rule.match(line)) {
        hits.push({ rule, line: i + 1, text: line.trim() });
      }
    }
  }
  return hits;
}

const pkg = readPackageJson();
const cap = typeof pkg.capacitor === "object" && pkg.capacitor ? pkg.capacitor : {};
if (!cap.android && !cap.ios) {
  process.exit(0);
}

const allExts = [...new Set(RULES.flatMap((r) => r.exts))];
const scanRoots = collectScanRoots(pkg);
const violations = [];

for (const root of scanRoots) {
  for (const file of listSourceFiles(root, allExts)) {
    const ext = path.extname(file);
    const rulesForExt = RULES.filter((r) => r.exts.includes(ext));
    violations.push(...scanFile(file, rulesForExt).map((hit) => ({ file, ...hit })));
  }
}

if (!violations.length) {
  process.exit(0);
}

console.error("[cap9-deprecated] FAIL");
for (const v of violations) {
  const relFile = path.relative(PLUGIN_DIR, v.file);
  console.error(`- ${relFile}:${v.line} [${v.rule.id}] ${v.text}`);
  console.error(`  ${v.rule.hint}`);
}
process.exit(1);
