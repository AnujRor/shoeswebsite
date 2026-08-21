import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Root of the pnpm workspace
// In dev (ts-node): __dirname = artifacts/api-server/src → 3 levels up
// In prod (built):  __dirname = artifacts/api-server/dist → 3 levels up
// Either way: artifacts/api-server/{src|dist} → artifacts/api-server → artifacts → workspace root
const ATTACHED_ASSETS_DIR = path.resolve(__dirname, "..", "..", "..", "attached_assets");

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve product images from the workspace attached_assets directory
app.use("/api/assets", express.static(ATTACHED_ASSETS_DIR));

app.use("/api", router);

export default app;
