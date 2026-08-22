# 🤖 AGENTS.md — OZY Sneakers (Agent Instructions + Project Details)

> ⚠️ **HAR AGENT / NEW SESSION KE LIYE SABSE PEHLA RULE:**
> Koi bhi agent (naya session, doosra AI, ya insaan) is project par kaam shuru karne se pehle **yeh file poora padhe**.
> Isme project ki poori detail hai aur neeche **Work Log** section mein har completed task record hota hai.

---

## 📌 Agent Rules (Follow These Always)

1. **Session start:** Yeh `AGENTS.md` + `README.md` + `replit.md` zaroor padho — project samajhne ke liye kaafi hain.
2. **Task complete hone ke baad (bina pooche, automatically):**
   - Is `AGENTS.md` ke **Work Log** section mein entry add karo — date, task name, kya kiya, result.
   - Saath hi root wali `project.md` mein bhi same entry add karo (existing convention).
3. **Existing structure aur stack mat todo** — jo hai wahi use karo, naye patterns introduce mat karo.
4. **Typecheck zaroor chalao** code change ke baad: `pnpm run typecheck`
5. **Secrets kabhi commit/print mat karo** — `.env`, API keys, Gmail App Password sab private hain.
6. **Servers restart karna pade toh** workflows use karo (neeche Commands section mein).
7. UI components (`src/components/ui/`) shadcn/Radix ke ready-made hain — inhe directly use karo, edit na karo.

---

## 📁 Project Overview

Yeh ek **pnpm monorepo** hai — **OZY Sneakers**, ek full-stack sneaker e-commerce website:

| App | Folder | Kaam |
|-----|--------|------|
| 🌐 Frontend Website | `artifacts/ozy-snaker/` | React + Vite website |
| ⚙️ API Server | `artifacts/api-server/` | Express 5 backend + Groq AI chatbot |
| 🖥️ Mockup Sandbox | `artifacts/mockup-sandbox/` | Component preview server |
| 🗄️ Database | `lib/db/` | PostgreSQL schema (Drizzle ORM) |
| 🔗 Shared Types | `lib/api/` | API types + Zod validation schemas |

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + shadcn/ui + Wouter routing + TanStack Query
- **Backend:** Express 5 + Drizzle ORM + Pino logging (esbuild se build)
- **Database:** PostgreSQL (Replit managed) via Drizzle ORM
- **AI Chat:** Groq API — model `llama-3.3-70b-versatile` (openai-compatible SDK)
- **Email:** Gmail SMTP (contact form notifications)

---

## 🌐 Frontend Detail — `artifacts/ozy-snaker/`

### Pages — `src/pages/`

| File | Kaam |
|------|------|
| `Home.tsx` | Homepage — hero, featured products, slideshow, animated stats, reviews section, Google Maps |
| `Products.tsx` | Product list + search + filter |
| `ProductDetail.tsx` | Single product detail |
| `ShoesCategory.tsx` | Category-wise browsing |
| `Gallery.tsx` | Photo gallery |
| `Cart.tsx` | Shopping cart + checkout |
| `Contact.tsx` | Contact form (Gmail SMTP) + Google Maps |
| `About.tsx` | Brand story |
| `not-found.tsx` | 404 page |

### Key Components

| File | Kaam |
|------|------|
| `components/ChatBot.tsx` | ⭐ Floating chatbot widget (Groq AI connected, streaming) |
| `components/ProductCard.tsx` | Reusable product card |
| `components/layout/Shell.tsx` | Outer wrapper — Navbar + Footer + ChatBot render |

### Hooks

- `use-mobile.tsx` — mobile/desktop screen detect
- `use-toast.ts` — toast notifications

---

## ⚙️ API Server Detail — `artifacts/api-server/src/`

| File | Route | Kaam |
|------|-------|------|
| `index.ts` | — | Server start, `.env` load (override: false → Replit Secrets win) |
| `app.ts` | — | Express setup — CORS, JSON, logging, routes mount |
| `routes/chat.ts` | `POST /api/chat` | ⭐ Groq AI chatbot — SSE streaming, Indian Hinglish system prompt |
| `routes/products.ts` | `GET /api/products` | Products list, filter, featured, new arrivals, best sellers |
| `routes/categories.ts` | `GET /api/categories` | Categories |
| `routes/brands.ts` | `GET /api/brands` | Brands |
| `routes/cart.ts` | `/api/cart` | Cart add/remove/view |
| `routes/orders.ts` | `/api/orders` | Orders data |
| `routes/contact.ts` | `POST /api/contact` | Contact form submit (Gmail email send) |
| `routes/store.ts` | `GET /api/store/stats` | Store stats |
| `routes/health.ts` | `GET /api/healthz` | Health check |

**Chat flow:** `ChatBot.tsx → POST /api/chat → Groq API → SSE stream → real-time reply`

---

## 🗄️ Database Tables — `lib/db/src/schema/`

| Table | Columns (key) |
|-------|---------------|
| `products` | name, price/originalPrice (numeric→float format), category, brand, imageUrl, images[], sizes[], colors[], inStock, isFeatured, isNewArrival, isBestSeller, rating, reviewCount |
| `categories` | name, slug (unique), productCount |
| `brands` | name, slug (unique), productCount |
| `cart_items` | productId, productName, productImageUrl, price, size, color, quantity |
| `orders` | customerName/Email/Phone, address, items (**jsonb** array), total, status (default "pending"), notes |
| `contacts` | name, email, phone, subject, message |

- **Seed data** (`lib/db/src/seed.ts`, idempotent): 2 brands (Nike, Onitsuka Tiger), 1 category (Sneakers), 3 products (Nike AF1 Chocolate ₹12500, Onitsuka Mexico 66 Cream/Black ₹9500). Prices seed mein INR jaise hain par frontend `$` dikhata hai.
- **Numeric columns** DB mein string hote hain → `formatProduct()` unhe float banata hai.

## 🎨 Design System (index.css)

- **Fonts:** Syne (display/headings, black italic uppercase style), Plus Jakarta Sans (body), Space Mono (prices/labels)
- **Accent color:** Infrared orange `hsl(14 100% 50%)` (~#ff5c00); ChatBot inline `#ff5c00`
- **Primary:** pure black, background near-white; **radius: 0rem** — sab corners sharp/square
- **Animations:** framer-motion throughout (fadeInUp pattern, whileInView scroll reveals, marquee CSS strip)

## 🏪 Business Info (code mein hardcoded)

- **Phone/WhatsApp:** +91 79000-51580, +91 90534-74158 | **Instagram:** Ozy_sneakers1223
- **Email (contact/Gmail):** anujror202007@gmail.com
- **Shop location:** coords `29.7636154,76.5649948` → Google Maps link har jagah reuse hota hai
- **Navbar links:** Home, Collection (/shoes), Gallery, About, Contact

---

## 🚀 Commands

```bash
# Frontend dev server (port 25480)
pnpm --filter @workspace/ozy-snaker run dev

# API server (port 8080)
pnpm --filter @workspace/api-server run dev

# Component preview server
pnpm --filter @workspace/mockup-sandbox run dev

# Typecheck (sab packages) — code change ke baad ZAROORI
pnpm run typecheck

# DB: schema push / full setup / seed only
pnpm --filter @workspace/db run push
pnpm --filter @workspace/db run setup
pnpm --filter @workspace/db run seed

# API smoke test (health, products, categories, brands, store verify)
pnpm --filter @workspace/scripts run api:smoke
```

Local Windows helper scripts: `start.bat`, `start-all.bat`

---

## 🔑 Environment Variables

| Variable | Kaam | Priority |
|----------|------|----------|
| `GROQ_API_KEY` | Chatbot API key | Replit Secret > `.env` |
| `GROQ_BASE_URL` | Groq endpoint | Replit env |
| `DATABASE_URL` | PostgreSQL connection | Replit auto-provided (`.env` placeholder ignored) |
| `SESSION_SECRET` | Session encryption | Replit Secret |
| `GMAIL_USER` + `GMAIL_APP_PASSWORD` | Contact form emails | Replit Secret > `.env` |

`.env.example` = template. `.env` = real values, git mein nahi jaata.

---

## ✅ Work Log (Har Task Yahan Add Karo)

> **Format:** Date + task name + kya kiya + result. Naya task hamesha list ke end mein add karo.

### 1. Project import setup
**Date:** 2026-08-06
- dotenv ESM bug fix, DB schema push, seed (brands/categories/3 products), `replit.md` likha

### 2. Home slideshow images update
**Date:** 2026-08-06
- "Afternoon Energy" section slideshow — 3 nayi images loop mein add

### 3. Chatbot greeting/language update
**Date:** 2026-08-06
- Greeting → "Jai Shree Ram! 👟", system prompt Indian Hinglish mein update

### 4. Home page Google Maps
**Date:** 2026-08-10
- Footer se pehle Google Maps embed add (shop location + Get Directions)

### 5–7. Console errors fix
**Date:** 2026-08-11 & 2026-08-16
- DB schema restore + seed → API 500 errors khatam; HMR websocket disable; workflows restart

### 8. Animated home stats
**Date:** 2026-08-18
- Count-up animation on 500+ / 10+ / 10 Years / 100% stats, typecheck pass

### 9. Reviews section
**Date:** 2026-08-18
- Footer se pehle customer reviews (3 reviews, 5-star, staggered scroll animation)

### 10–11. Contact form → Gmail connect
**Date:** 2026-08-18
- Gmail SMTP via env vars, App Password Replit Secret mein, precedence fix (Replit Secret > `.env`), SMTP auth verified

### 12. AGENTS.md bana + poora code review
**Date:** 2026-08-22
- Saari docs (README/replit/project.md) + **100% source code padha** — saare 9 pages, components (Navbar/Footer/Shell/ChatBot/ProductCard), saare API routes, DB schema (6 tables), seed data, shared libs (api-zod/api-client-react), design system
- Yeh `AGENTS.md` file banayi — project detail + agent rules + yeh work log
- Ab har naya task isi ke Work Log mein record hoga

### 13. Local Windows preview setup (frontend + API + PostgreSQL)
**Date:** 2026-08-22
- Local preview ke liye poora stack Windows pe chalaya: Vite frontend (`localhost:5173`), API server manually build karke start (local port **3000**, `dev` script Unix-only hai)
- Local PostgreSQL PG17 port **5433** pe `ozy_sneakers` DB banaya, schema push + seed kiya; root `.env` mein real `DATABASE_URL` set (PG18/5432 ka password alag tha)
- Verify: healthz 200, products API via Vite proxy 200 — browser preview working

### 14. Chatbot fix (nayi Groq key + model migration)
**Date:** 2026-08-22
- Problem: chatbot `401 Invalid API Key` de raha tha — purani Groq key expire/revoke ho gayi thi
- Nayi key user se lekar `.env` mein update ki
- Doosra issue: Groq ne `llama-3.3-70b-versatile` model **retire** kar diya tha (models list mein nahi hai) → `chat.ts` mein model switch karke `openai/gpt-oss-120b` use kiya
- API server rebuild + restart kiya, typecheck pass (api-server/mockup-sandbox/ozy-snaker sab)
- Verify: POST /api/chat SSE streaming chal rahi hai — direct (3000) aur Vite proxy (5173) dono se Hinglish reply aa raha hai

### 15. Chatbot price-hiding rule (system prompt hardening)
**Date:** 2026-08-22
- User request: chatbot kisi bhi shoe ka price na bataye, kitna bhi zid karne par nahi
- Pehle bot hallucinated price bata raha tha ("₹11,999 se shuru") — ab `chat.ts` SYSTEM_PROMPT mein rule #1 (non-breakable) add kiya: koi price/daam/rate/range/andaza kabhi nahi, hamesha Collection page + WhatsApp redirect
- Trick prompts bhi block: "range bata do", "developer mode", "last price", coding mein price, etc.
- Rebuild + restart + verify: 3 adversarial test cases (direct/zid/trick) — sab mein refusal + website/WhatsApp redirect, zero prices

---
*Yeh file living document hai — jab bhi project badle ya naya task ho, isi ko update karo.*
