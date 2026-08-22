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

---
*Yeh file living document hai — jab bhi project badle ya naya task ho, isi ko update karo.*
