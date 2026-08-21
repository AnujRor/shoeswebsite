import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, ordersTable } from "@workspace/db";
import {
  CreateOrderBody,
  GetOrderParams,
  ListOrdersResponse,
  CreateOrderResponse,
  GetOrderResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function formatOrder(o: typeof ordersTable.$inferSelect) {
  return {
    ...o,
    total: parseFloat(o.total),
    createdAt: o.createdAt.toISOString(),
    items: (o.items as Array<{
      id: number;
      productId: number;
      productName: string;
      price: number;
      size: string;
      color: string | null;
      quantity: number;
    }>),
  };
}

router.get("/orders", async (_req, res): Promise<void> => {
  const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
  res.json(ListOrdersResponse.parse(orders.map(formatOrder)));
});

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const total = parsed.data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orderItems = parsed.data.items.map((item, index) => ({
    id: index + 1,
    productId: item.productId,
    productName: String(item.productId),
    price: item.price,
    size: item.size,
    color: item.color ?? null,
    quantity: item.quantity,
  }));

  const [order] = await db.insert(ordersTable).values({
    customerName: parsed.data.customerName,
    customerEmail: parsed.data.customerEmail,
    customerPhone: parsed.data.customerPhone,
    address: parsed.data.address,
    notes: parsed.data.notes ?? null,
    items: orderItems,
    total: String(total),
    status: "pending",
  }).returning();

  res.status(201).json(CreateOrderResponse.parse(formatOrder(order)));
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, params.data.id));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(GetOrderResponse.parse(formatOrder(order)));
});

export default router;
