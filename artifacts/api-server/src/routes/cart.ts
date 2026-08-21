import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, cartItemsTable, productsTable } from "@workspace/db";
import {
  AddToCartBody,
  UpdateCartItemParams,
  UpdateCartItemBody,
  RemoveCartItemParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function buildCart() {
  const items = await db.select().from(cartItemsTable).orderBy(cartItemsTable.createdAt);
  const formatted = items.map((item) => ({
    ...item,
    price: parseFloat(item.price),
  }));
  const total = formatted.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = formatted.reduce((sum, item) => sum + item.quantity, 0);
  return { items: formatted, total, itemCount };
}

router.get("/cart", async (_req, res): Promise<void> => {
  const cart = await buildCart();
  res.json(cart);
});

router.delete("/cart", async (_req, res): Promise<void> => {
  await db.delete(cartItemsTable);
  res.json({ items: [], total: 0, itemCount: 0 });
});

router.post("/cart/items", async (req, res): Promise<void> => {
  const parsed = AddToCartBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, parsed.data.productId));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  // Check if same product+size+color already in cart
  const existingItems = await db.select().from(cartItemsTable)
    .where(eq(cartItemsTable.productId, parsed.data.productId));

  const match = existingItems.find(
    (item) => item.size === parsed.data.size && item.color === (parsed.data.color ?? null)
  );

  if (match) {
    await db
      .update(cartItemsTable)
      .set({ quantity: match.quantity + parsed.data.quantity })
      .where(eq(cartItemsTable.id, match.id));
  } else {
    await db.insert(cartItemsTable).values({
      productId: parsed.data.productId,
      productName: product.name,
      productImageUrl: product.imageUrl,
      price: String(parseFloat(product.price)),
      size: parsed.data.size,
      color: parsed.data.color ?? null,
      quantity: parsed.data.quantity,
    });
  }

  const cart = await buildCart();
  res.json(cart);
});

router.patch("/cart/items/:itemId", async (req, res): Promise<void> => {
  const params = UpdateCartItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateCartItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.quantity <= 0) {
    await db.delete(cartItemsTable).where(eq(cartItemsTable.id, params.data.itemId));
  } else {
    await db
      .update(cartItemsTable)
      .set({ quantity: parsed.data.quantity })
      .where(eq(cartItemsTable.id, params.data.itemId));
  }

  const cart = await buildCart();
  res.json(cart);
});

router.delete("/cart/items/:itemId", async (req, res): Promise<void> => {
  const params = RemoveCartItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(cartItemsTable).where(eq(cartItemsTable.id, params.data.itemId));
  const cart = await buildCart();
  res.json(cart);
});

export default router;
