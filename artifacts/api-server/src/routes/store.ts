import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, productsTable, ordersTable, categoriesTable, brandsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/store/stats", async (_req, res): Promise<void> => {
  const [products, orders, categories, brands] = await Promise.all([
    db.select().from(productsTable),
    db.select().from(ordersTable).orderBy(ordersTable.createdAt),
    db.select().from(categoriesTable),
    db.select().from(brandsTable),
  ]);

  const recentOrders = orders.slice(-5).reverse().map((o) => ({
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
  }));

  res.json({
    totalProducts: products.length,
    totalOrders: orders.length,
    totalBrands: brands.length,
    totalCategories: categories.length,
    featuredCount: products.filter((p) => p.isFeatured).length,
    newArrivalsCount: products.filter((p) => p.isNewArrival).length,
    recentOrders,
  });
});

export default router;
