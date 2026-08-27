/**
 * Idempotent seed script — safe to run multiple times.
 * Inserts brands, categories, and initial products if they don't already exist.
 * Run: pnpm --filter @workspace/db run seed
 */

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { brandsTable, categoriesTable, productsTable } from "./schema/index.js";
import { sql, eq } from "drizzle-orm";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// Idempotent insert helpers
async function upsertBrand(name: string, slug: string) {
  await db
    .insert(brandsTable)
    .values({ name, slug, productCount: 0 })
    .onConflictDoNothing(); // unique on slug
}

async function upsertCategory(name: string, slug: string) {
  await db
    .insert(categoriesTable)
    .values({ name, slug, productCount: 0 })
    .onConflictDoNothing(); // unique on slug
}

// Products have no unique constraint — guard by name check
async function insertProductIfMissing(data: typeof productsTable.$inferInsert) {
  const existing = await db
    .select({ id: productsTable.id })
    .from(productsTable)
    .where(eq(productsTable.name, data.name))
    .limit(1);
  if (existing.length === 0) {
    await db.insert(productsTable).values(data);
    console.log(`  ✓ Inserted: ${data.name}`);
  } else {
    console.log(`  – Already exists: ${data.name}`);
  }
}

async function seed() {
  console.log("Seeding brands...");
  await upsertBrand("Nike", "nike");
  await upsertBrand("Onitsuka Tiger", "onitsuka-tiger");
  await upsertBrand("Jordan", "jordan");

  console.log("Seeding categories...");
  await upsertCategory("Sneakers", "sneakers");

  console.log("Seeding products...");

  await insertProductIfMissing({
    name: "Nike Air Force 1 Low Chocolate",
    description:
      "Nike Air Force 1 Low in rich chocolate brown suede with white stitching details and BAPE collab accents. A bold statement sneaker.",
    price: "12500.00",
    category: "Sneakers",
    brand: "Nike",
    imageUrl: "/api/assets/1000059259_1785474466110.jpg",
    images: ["/api/assets/1000059259_1785474466110.jpg"],
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
    colors: ["Chocolate Brown", "White"],
    inStock: true,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    rating: "4.8",
    reviewCount: 24,
  });

  await insertProductIfMissing({
    name: "Onitsuka Tiger Mexico 66 Cream",
    description:
      "Classic Onitsuka Tiger Mexico 66 in cream/beige with khaki stripe detailing and gum sole. Timeless retro Japanese style.",
    price: "9500.00",
    category: "Sneakers",
    brand: "Onitsuka Tiger",
    imageUrl: "/api/assets/1000059256_1785474466112.jpg",
    images: ["/api/assets/1000059256_1785474466112.jpg"],
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43"],
    colors: ["Cream", "Khaki"],
    inStock: true,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    rating: "4.7",
    reviewCount: 18,
  });

  await insertProductIfMissing({
    name: "Onitsuka Tiger Mexico 66 Black",
    description:
      "Iconic Onitsuka Tiger Mexico 66 in clean black leather with white stripe detailing. A sleek everyday classic.",
    price: "9500.00",
    category: "Sneakers",
    brand: "Onitsuka Tiger",
    imageUrl: "/api/assets/1000059253_1785474466113.jpg",
    images: ["/api/assets/1000059253_1785474466113.jpg"],
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43"],
    colors: ["Black", "White"],
    inStock: true,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    rating: "4.9",
    reviewCount: 31,
  });

  await insertProductIfMissing({
    name: "Jordan",
    description:
      "Jordan sneakers — premium quality, iconic style.",
    price: "0.00",
    category: "Sneakers",
    brand: "Jordan",
    imageUrl: "/api/assets/jordan_1.jpg",
    images: ["/api/assets/jordan_1.jpg"],
    sizes: [],
    colors: [],
    inStock: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    rating: "0.0",
    reviewCount: 0,
  });

  console.log("Syncing brand and category product counts...");
  await db.execute(
    sql`UPDATE brands SET product_count = (SELECT COUNT(*) FROM products WHERE products.brand = brands.name)`,
  );
  await db.execute(
    sql`UPDATE categories SET product_count = (SELECT COUNT(*) FROM products WHERE products.category = categories.name)`,
  );

  console.log("Seed complete.");
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
