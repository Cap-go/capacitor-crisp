#!/usr/bin/env node
/**
 * Capacitor 9 removed/deprecated native API guard for plugin packages.
 *
 * Fails CI when plugin sources still call APIs removed in Capacitor 9.
 * See https://capacitorjs.com/docs/next/updating/plugins/9-0
 *
 * Package.swift is not scanned (Cordova SPM product dependency is allowed on Cap 8).
 */

import path from "node:path";
import {
  exists,
  lineLooksCommentOnly,
  loadPluginPackage,
  parsePluginDirArg,
  readText,
  walkFiles,
} from "./plugin-scan-utils.mjs";

/** @type {{ id: string; exts: string[]; needles?: string[]; re?: RegExp; match?: (line: string) => boolean; hint: string }[]} */
const RULES = [
  {
    id: "plugin-call-hasOption",
    exts: [".java", ".kt", ".swift"],
    needles: [".hasOption("],
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
    needles: [".isSaved("],
    hint: "Use isKeptAlive() instead of isSaved().",
  },
  {
    id: "plugin-call-isReleased",
    exts: [".java", ".kt"],
    needles: [".isReleased("],
    hint: "isReleased() was removed; released calls are managed by the bridge.",
  },
  {
    id: "plugin-getConfigValue",
    exts: [".java", ".kt", ".swift"],
    needles: [".getConfigValue("],
    hint: "Use getConfig() and typed PluginConfig accessors.",
  },
  {
    id: "android-native-plugin-annotation",
    exts: [".java", ".kt"],
    needles: ["@NativePlugin"],
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
    needles: ["getSavedCall()"],
    hint: "Use Bridge.getSavedCall(String) with a callback id.",
  },
  {
    id: "android-freeSavedCall",
    exts: [".java", ".kt"],
    needles: ["freeSavedCall("],
    hint: "Use PluginCall.release(Bridge) instead of freeSavedCall().",
  },
  {
    id: "android-https-interceptor-start",
    exts: [".java", ".kt"],
    needles: ["CAPACITOR_HTTPS_INTERCEPTOR_START"],
    hint: "Use CAPACITOR_HTTP_INTERCEPTOR_START instead.",
  },
  {
    id: "ios-cap-bridge-class",
    exts: [".swift"],
    needles: ["CAPBridge."],
    hint: "CAPBridge was removed; use Cap 9 replacements (ApplicationDelegateProxy, Notification.Name, etc.).",
  },
  {
    id: "ios-cap-notifications-enum",
    exts: [".swift"],
    needles: ["CAPNotifications"],
    hint: "Use Notification.Name.capacitor* constants instead of CAPNotifications.",
  },
  {
    id: "ios-https-interceptor-start",
    exts: [".swift"],
    needles: ["httpsInterceptorStartIdentifier"],
    hint: "Use httpInterceptorStartIdentifier instead.",
  },
  {
    id: "ios-getPluginConfigValue",
    exts: [".swift"],
    needles: [".getPluginConfigValue("],
    hint: "Use getPluginConfig(_:) instead.",
  },
];

function lineMatchesRule(line, rule) {
  if (rule.match?.(line)) {
    return true;
  }
  if (rule.needles?.some((needle) => line.includes(needle))) {
    return true;
  }
  return Boolean(rule.re?.test(line));
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
  const lines = readText(filePath, trustedRoot).split(/\r?\n/);
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

const allExts = [...new Set(RULES.flatMap((r) => r.exts))];
const scanRoots = collectScanRoots(pluginDir, loaded.pkg);
if (!scanRoots.length) {
  process.exit(0);
}

const skipFile = (full) => path.basename(full) === "Package.swift";
const violations = [];
for (const root of scanRoots) {
  const files = walkFiles(root, allExts, { skipFile });
  for (const file of files) {
    const ext = path.extname(file);
    const rulesForExt = RULES.filter((r) => r.exts.includes(ext));
    if (!rulesForExt.length) continue;
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
