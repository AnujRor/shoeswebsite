#!/usr/bin/env node
// Starts the API server + Vite frontend with a single command: pnpm dev
//
// - Builds the API server only when dist is missing or source changed
// - Loads root .env via Node's --env-file (same as start-all.bat used to)
// - Spawns both processes in the same console so one Ctrl+C stops both

import { spawn } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const API_DIR = path.join(ROOT, "artifacts", "api-server");
const WEB_DIR = path.join(ROOT, "artifacts", "ozy-snaker");
const ENV_FILE = path.join(ROOT, ".env");
const API_DIST = path.join(API_DIR, "dist", "index.mjs");
const VITE_BIN = path.join(WEB_DIR, "node_modules", "vite", "bin", "vite.js");

// Folders whose changes require an API server rebuild.
const BUILD_INPUTS = [
  path.join(API_DIR, "src"),
  path.join(ROOT, "lib", "api-zod"),
  path.join(ROOT, "lib", "db"),
];

const children = new Set();

function newestMtime(dirPath) {
  if (!existsSync(dirPath)) return 0;
  let newest = 0;
  for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      newest = Math.max(newest, newestMtime(full));
    } else {
      newest = Math.max(newest, statSync(full).mtimeMs);
    }
  }
  return newest;
}

function needsBuild() {
  if (!existsSync(API_DIST)) return true;
  const distMtime = statSync(API_DIST).mtimeMs;
  return BUILD_INPUTS.some((dir) => newestMtime(dir) > distMtime);
}

function runBuild() {
  console.log("[dev] Building API server...");
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["build.mjs"], {
      cwd: API_DIR,
      stdio: "inherit",
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`API server build failed (exit ${code})`));
    });
  });
}

function start(label, command, args, opts) {
  console.log(`[dev] Starting ${label}...`);
  const child = spawn(command, args, { stdio: "inherit", ...opts });
  children.add(child);
  child.on("exit", (code) => {
    console.log(
      `[dev] ${label} stopped (exit code ${code ?? 0}). Shutting down the other process...`,
    );
    for (const other of children) {
      if (other !== child && other.exitCode === null) other.kill();
    }
    process.exit(code ?? 0);
  });
  return child;
}

function shutdown(signal) {
  console.log(`\n[dev] ${signal} received, stopping servers...`);
  for (const child of children) {
    if (child.exitCode === null) child.kill();
  }
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

async function main() {
  console.log("==============================================");
  console.log("  OZY Sneakers — Backend + Frontend (single)  ");
  console.log("==============================================");

  if (existsSync(ENV_FILE)) {
    console.log(`[dev] Using env file: ${ENV_FILE}`);
  } else {
    console.warn("[dev] WARNING: root .env not found! Copy .env.example.");
  }

  if (needsBuild()) {
    await runBuild();
  } else {
    console.log("[dev] API server already built — skipping build.");
  }

  start(
    "API server (http://localhost:3000)",
    process.execPath,
    [
      "--enable-source-maps",
      `--env-file=${ENV_FILE}`,
      path.join(API_DIR, "dist", "index.mjs"),
    ],
    { cwd: API_DIR },
  );

  start(
    "Frontend (http://localhost:5173)",
    process.execPath,
    [VITE_BIN, "--config", "vite.config.ts", "--host", "0.0.0.0"],
    { cwd: WEB_DIR },
  );

  console.log("\n[dev] Both servers running. Ctrl+C stops them together.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});