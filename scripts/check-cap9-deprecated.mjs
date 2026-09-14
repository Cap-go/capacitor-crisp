#!/usr/bin/env node
/**
 * Capacitor 9 removed/deprecated native API guard for plugin packages.
 * See https://capacitorjs.com/docs/next/updating/plugins/9-0
 * Package.swift is not scanned (Cordova SPM product dependency is allowed on Cap 8).
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  exists,
  lineLooksCommentOnly,
  loadPluginPackage,
  parsePluginDirArg,
  readText,
  walkFiles,
} from "./plugin-scan-utils.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));

function lineMatchesRule(line, rule) {
  if (rule.excludeNeedles?.some((needle) => line.includes(needle))) {
    return false;
  }
  return rule.needles.some((needle) => line.includes(needle));
}

function collectScanRoots(pluginDir, pkg) {
  const cap = typeof pkg.capacitor === "object" && pkg.capacitor ? pkg.capacitor : {};
  const roots = [];
  if (cap.android) {
    const androidSrc = path.join(pluginDir, "android", "src");
    if (exists(androidSrc, pluginDir)) roots.push(androidSrc);
  }
  if (cap.ios) {
    const iosSources = path.join(pluginDir, "ios", "Sources");
    const iosDir = path.join(pluginDir, "ios");
    if (exists(iosSources, pluginDir)) roots.push(iosSources);
    else if (exists(iosDir, pluginDir)) roots.push(iosDir);
  }
  return roots;
}

function scanFile(filePath, rulesForExt, trustedRoot) {
  const hits = [];
  const content = readText(filePath, trustedRoot);
  if (!content) return hits;
  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (lineLooksCommentOnly(line)) continue;
    for (const rule of rulesForExt) {
      if (lineMatchesRule(line, rule)) {
        hits.push({ rule, line: i + 1, text: line.trim() });
      }
    }
  }
  return hits;
}

const parsedDir = parsePluginDirArg(process.argv);
if (parsedDir.error) {
  console.error(`[cap9-deprecated] ERROR: ${parsedDir.error}`);
  process.exit(parsedDir.exitCode);
}

const pluginDir = parsedDir.dir;
const loaded = loadPluginPackage(pluginDir);
if (loaded.error) {
  console.error(`[cap9-deprecated] ERROR: ${loaded.error}`);
  process.exit(loaded.exitCode);
}

const cap = typeof loaded.pkg.capacitor === "object" && loaded.pkg.capacitor ? loaded.pkg.capacitor : {};
if (!cap.android && !cap.ios) {
  process.exit(0);
}

let rules;
try {
  rules = JSON.parse(readText(path.join(scriptDir, "cap9-deprecated-rules.json"), pluginDir));
} catch (error) {
  console.error(
    `[cap9-deprecated] ERROR: invalid ${path.join(scriptDir, "cap9-deprecated-rules.json")}: ${error?.message || error}`,
  );
  process.exit(2);
}
if (!Array.isArray(rules) || !rules.length) {
  console.error(`[cap9-deprecated] ERROR: missing rules in ${path.join(scriptDir, "cap9-deprecated-rules.json")}`);
  process.exit(2);
}

const allExts = [...new Set(rules.flatMap((r) => r.exts))];
const scanRoots = collectScanRoots(pluginDir, loaded.pkg);
const skipFile = (full) => path.basename(full) === "Package.swift";
const violations = [];

for (const root of scanRoots) {
  for (const file of walkFiles(root, allExts, { skipFile })) {
    const ext = path.extname(file);
    const rulesForExt = rules.filter((r) => r.exts.includes(ext));
    for (const hit of scanFile(file, rulesForExt, pluginDir)) {
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
