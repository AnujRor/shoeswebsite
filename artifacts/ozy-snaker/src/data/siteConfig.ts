/**
 * Shared site configuration — canonical base URL etc.
 * Vercel frontend domain (prototype base), API on Render.
 */

export const SITE_URL = "https://ozy-sneakers-frontend.vercel.app";

/**
 * Build an absolute canonical URL for a route path.
 * Example: canonicalUrl("/shoes") → "https://ozy-sneakers-frontend.vercel.app/shoes"
 */
export function canonicalUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}
