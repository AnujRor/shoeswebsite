# SEO Setup — Ozy Sneakers

Har page ke liye Meta Title aur Meta Description — innhe frontend `react-helmet-async` ke `<Helmet>` block mein use kiya gaya hai.

> **Kya use hota hai:** `react-helmet-async` (pacakage: `react-helmet-async@2.0.5`) — poori app `App.tsx` mein `<HelmetProvider>` se wrap ki gayi hai. Har page component apne `<Helmet>` block mein title/description set karta haai.

## Home
Meta Title: Shoe Shop in Pundri Kaithal | Ozy Sneakers – Sports, Casual & Formal Shoes
Meta Description: Looking for a shoe shop near Pundri, Kaithal? Ozy Sneakers has sports shoes, sneakers, casual shoes and formal shoes for men, women and kids. Best shoe store in Kaithal, Haryana.

## Collection
Meta Title: Buy Shoes Online in Kaithal | Sports Shoes, Sneakers & Casuals – Ozy Sneakers
Meta Description: Want to buy shoes in Kaithal or Pundri? Browse sports shoes, sneakers, casual and formal shoes at Ozy Sneakers - genuine quality, all sizes available for men and women.

## Gallery
Meta Title: Latest Shoe Designs & New Arrivals | Ozy Sneakers Pundri
Meta Description: Check out new shoe designs, latest sneakers and trending footwear styles available at Ozy Sneakers, Pundri, Kaithal. New stock updated regularly.

## About
Meta Title: Best Shoe Shop in Pundri Kaithal | About Ozy Sneakers
Meta Description: Ozy Sneakers is known as one of the best shoe shops in Pundri, Kaithal, Haryana - trusted for genuine quality shoes and fair prices since our start.

## Contact
Meta Title: Ozy Sneakers Contact Number & Address | Pundri, Kaithal
Meta Description: Need shoe shop contact details in Pundri, Kaithal? Call or WhatsApp Ozy Sneakers for shoe availability, price and store address.

---

## JSON-LD (Structured Data)
**Kaunsa page:** `Home.tsx`
**Type:** schema.org `ShoeStore`
- Business name: **Ozy Sneakers**
- Address: **Pundri, Kaithal, Haryana**
- Geo coordinates (shop location)
- Opening hours + WhatsApp contact (`+91 79000-51580`)
- Search engines (Google) ko business detail samajhne mein madad karta hai — rich result/SERP mein business info dikh sakti hai.

## Product Detail (dynamic meta)
**Kaunsa page:** `ProductDetail.tsx` (`/products/:id`)
- Title: `<product name> | Ozy Sneakers Pundri Kaithal`
- Description: product name + category + "Ozy Sneakers Pundri Kaithal, Haryana"
- Har product ke liye auto-dynamic — alag se likhne ki zaroorat nahi.

## robots.txt
**Jagah:** `artifacts/ozy-snaker/public/robots.txt`
- `User-agent: *` → `Allow: /` (poori site crawl hone do)
- `Sitemap: https://ozy-sneakers-frontend.vercel.app/sitemap.xml` reference

## sitemap.xml
**Jagah:** `artifacts/ozy-snaker/public/sitemap.xml`
- Host: `https://ozy-sneakers-frontend.vercel.app`
- URLs include: `/`, `/shoes`, `/products`, `/gallery`, `/about`, `/contact` (chin changefreq + priority ke saath)
- Google Search Console ko submit karne ke liye: `sitemap.xml`

## Product Image Alt Text
Descriptive alt text (shoe type + "Ozy Sneakers Pundri Kaithal") — in files:
- `ProductCard.tsx` — `${product.name} - {category} shoes at Ozy Sneakers Pundri Kaithal`
- `ProductDetail.tsx` — main image + thumbnails (product name views)
- `Cart.tsx` — cart item product
- `Home.tsx` — classics slide shoe images
- `ShoesCategory.tsx` — brand shoe grids
- `Gallery.tsx` — shoe design galleries

## Note (SPA limitation)
Yeh **client-side SPA** hai — meta tags browser mein JS run hone ke baad render hote hain. Google aur modern crawlers JS render kar lete hain, isliye SEO dikhega. Koi SSR (server-side rendering) nahi hai; agar aur solid SEO chahiye toh prerender/SSG option hai.
