import { configDotenv } from "dotenv";
import path from "path";

// Load .env from workspace root without overriding Replit-managed values.
const envFile = configDotenv({
  path: path.resolve(import.meta.dirname, "../../../.env"),
  override: false,
});

// Gmail is intentionally portable with the project: prefer its .env values
// over a same-named Replit Secret, while leaving all other env precedence
// unchanged.
for (const key of ["GMAIL_USER", "GMAIL_APP_PASSWORD"] as const) {
  const value = envFile.parsed?.[key];
  if (value) process.env[key] = value;
}

import app from "./app";
import { logger } from "./lib/logger";

// On Replit PORT is injected automatically.
// Locally it falls back to 3000.
const port = Number(process.env["PORT"] ?? "3000");

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${process.env["PORT"]}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
