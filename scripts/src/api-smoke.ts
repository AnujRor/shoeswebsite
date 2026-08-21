const baseUrl = process.env.API_BASE_URL ?? "http://localhost:8080";

const checks = [
  { path: "/api/healthz", requiredKeys: ["status"] },
  { path: "/api/products", requiredKeys: [] },
  { path: "/api/products/featured", requiredKeys: [] },
  { path: "/api/products/new-arrivals", requiredKeys: [] },
  { path: "/api/products/best-sellers", requiredKeys: [] },
  { path: "/api/categories", requiredKeys: [] },
  { path: "/api/brands", requiredKeys: [] },
  { path: "/api/store/stats", requiredKeys: ["totalProducts", "totalOrders"] },
];

for (const check of checks) {
  const response = await fetch(`${baseUrl}${check.path}`);
  if (!response.ok) {
    throw new Error(`${check.path} returned HTTP ${response.status}`);
  }

  const body: unknown = await response.json();
  if (body === null || typeof body !== "object") {
    throw new Error(`${check.path} returned a non-object response`);
  }

  for (const key of check.requiredKeys) {
    if (!(key in body)) {
      throw new Error(`${check.path} response is missing "${key}"`);
    }
  }

  console.log(`✓ ${check.path}`);
}

console.log(`API smoke checks passed for ${baseUrl}`);

export {};