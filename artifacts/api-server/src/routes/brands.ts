import { Router, type IRouter } from "express";
import { db, brandsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/brands", async (_req, res): Promise<void> => {
  const brands = await db.select().from(brandsTable).orderBy(brandsTable.name);
  res.json(brands);
});

export default router;
