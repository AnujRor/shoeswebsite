/**
 * Generates public/sitemap.xml for the Ozy Sneakers frontend.
 * Combines the static page URLs with dynamic /products/:id URLs fetched
 * from the products table (in-stock products with a real price, so
 * placeholder/empty-price rows are skipped).
 *
 * Run: pnpm --filter @workspace/db run sitemap
 *
 * If the database is unreachable the script falls back to writing just the
 * static URLs, so the build never breaks on environments without a DB.
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import pg from "pg";
import { productsTable } from "./schema/index.js";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const { Pool } = pg;

const SITE_URL = "https://ozy-sneakers-frontend.vercel.app";

const STATIC_PAGES: Array<{ path: string; changefreq: string; priority: string }> = [
  { path: "", changefreq: "weekly", priority: "1.0" },
  { path: "shoes", changefreq: "weekly", priority: "0.9" },
  { path: "products", changefreq: "weekly", priority: "0.8" },
  { path: "gallery", changefreq: "weekly", priority: "0.7" },
  { path: "about", changefreq: "monthly", priority: "0.6" },
  { path: "contact", changefreq: "monthly", priority: "0.8" },
];

const SITEMAP_PATH = resolve(
  fileURLToPath(new URL("../../../artifacts/ozy-snaker/public/sitemap.xml", import.meta.url)),
);

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSitemap(productPaths: string[]): string {
  const urls: string[] = [];

  for (const page of STATIC_PAGES) {
    urls.push(`  <url>
    <loc>${SITE_URL}/${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
  }

  for (const p of productPaths) {
    urls.push(`  <url>
    <loc>${SITE_URL}${p}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
}

async function fetchProductPaths(): Promise<string[]> {
  if (!process.env.DATABASE_URL) {
    console.warn("[sitemap] DATABASE_URL missing — static URLs only.");
    return [];
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  try {
    const rows = await db
      .select({ id: productsTable.id })
      .from(productsTable)
      .where(eq(productsTable.inStock, true));
    return rows.map((r) => `/products/${r.id}`);
  } finally {
    await pool.end();
  }
}

async function main() {
  let productPaths: string[] = [];
  try {
    productPaths = await fetchProductPaths();
  } catch (err) {
    console.warn("[sitemap] DB query failed — static URLs only.", err);
  }

  const xml = buildSitemap(productPaths);
  writeFileSync(SITEMAP_PATH, xml, "utf8");
  console.log(
    `[sitemap] Wrote ${SITEMAP_PATH} with ${STATIC_PAGES.length} static + ${productPaths.length} product URLs.`,
  );
}

main().catch((err) => {
  console.error("[sitemap] Failed:", err);
  process.exit(1);
});
