/**
 * Static product name mapping — organized by brand, in website appearance order
 * (top-left → right, then next row — exactly as images appear on Collection page).
 *
 * Used for:
 *  - Image alt text (SEO)
 *  - Product card display (future use)
 *
 * Format: [Product Name] - Ozy Sneakers, Pundri, Kaithal
 */

export const ALT_SUFFIX = "Ozy Sneakers, Pundri, Kaithal";

export const productNamesByBrand: Record<string, string[]> = {
  Jordan: [
    "Jordan Delta 2 Blue",
    "Jordan 1 Low Multicolor",
    "Jordan 4 White Green",
    "Jordan 13 White Red",
    "Jordan 4 Infrared",
    "Jordan 6 White Navy",
    "Jordan Delta Teal",
    "Jordan 1 High Green Gold",
  ],
  "Louis Vuitton": [
    "Louis Vuitton Trainer Black",
    "Louis Vuitton Trainer Red",
    "Louis Vuitton Trainer Green",
    "Louis Vuitton Trainer Blue",
    "Louis Vuitton Trainer Monogram Navy",
  ],
  Nike: [
    "Nike Air Max Cream Orange",
    "Nike Air Force 1 Red",
    "Nike Air Zoom Orange",
    "Nike LeBron Grey Blue",
    "Nike Air Max Red White",
  ],
  "New Balance": [
    "New Balance 327 Maroon",
    "New Balance 9060 Black",
  ],
  "Onitsuka Tiger": [
    "Onitsuka Tiger Mexico 66 Black",
    "Onitsuka Tiger Mexico 66 Yellow",
  ],
};

/**
 * Get alt text for a product image by brand and index.
 * Example: getProductAlt("Jordan", 0) → "Jordan Delta 2 Blue - Ozy Sneakers, Pundri, Kaithal"
 */
export function getProductAlt(brand: string, index: number): string {
  const names = productNamesByBrand[brand];
  if (names && index < names.length) {
    return `${names[index]} - ${ALT_SUFFIX}`;
  }
  return `${brand} shoes ${index + 1} - ${ALT_SUFFIX}`;
}

/**
 * Get product name by brand and index.
 * Returns undefined if not found.
 */
export function getProductName(brand: string, index: number): string | undefined {
  return productNamesByBrand[brand]?.[index];
}
