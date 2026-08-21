# 🟠 OZY Sneakers — Project README

> Yeh file project ki poori structure explain karti hai — har file kya hai, kya kaam karti hai, aur kahan kya configure hai.

---

## 📁 Project Overview

Yeh ek **pnpm monorepo** hai jisme 2 main applications hain:

| App | Folder | Kaam |
|-----|--------|------|
| 🌐 Frontend Website | `artifacts/ozy-snaker/` | OZY Sneakers ki website (React + Vite) |
| ⚙️ API Server | `artifacts/api-server/` | Backend server (Express + Groq chatbot) |

---

## 🌐 Frontend — `artifacts/ozy-snaker/`

### Entry Points

| File | Kaam |
|------|------|
| `index.html` | Website ka main HTML file — favicon aur React app load hota hai |
| `src/main.tsx` | React app start hota hai yahan se |
| `src/App.tsx` | Saare pages ka routing (`/`, `/products`, `/cart`, `/about`, etc.) |
| `src/index.css` | Global styling — Tailwind CSS + theme colors |
| `vite.config.ts` | Vite dev server ka config — port, base path, HMR settings |

### Pages — `src/pages/`

| File | Kaam |
|------|------|
| `Home.tsx` | Homepage — hero section, featured products, best sellers |
| `Products.tsx` | Saare products ki list, search aur filter |
| `ProductDetail.tsx` | Ek product ki detail page |
| `ShoesCategory.tsx` | Category ke hisaab se shoes browse karna |
| `Gallery.tsx` | Photo gallery page |
| `Cart.tsx` | Shopping cart — items aur checkout |
| `Contact.tsx` | Contact form aur social links |
| `About.tsx` | Brand ki story / about us page |
| `not-found.tsx` | 404 error page |

### Components — `src/components/`

| File | Kaam |
|------|------|
| `ChatBot.tsx` | ⭐ Floating chatbot widget — OZY Assistant (Groq AI se connected) |
| `ProductCard.tsx` | Product ka reusable card/tile |
| `layout/Navbar.tsx` | Top navigation bar |
| `layout/Footer.tsx` | Footer — links, contact info |
| `layout/Shell.tsx` | Page ka outer wrapper — Navbar + Footer + ChatBot sab yahan render hote hain |

### Hooks — `src/hooks/`

| File | Kaam |
|------|------|
| `use-mobile.tsx` | Screen size detect karta hai (mobile ya desktop) |
| `use-toast.ts` | Toast notifications ka logic |

### UI Components — `src/components/ui/`

> Yeh shadcn/Radix UI ke ready-made components hain — buttons, dialogs, cards, forms, etc.
> Inhe directly use karo, edit karne ki zaroorat nahi.

---

## ⚙️ API Server — `artifacts/api-server/`

### Main Files — `src/`

| File | Kaam |
|------|------|
| `index.ts` | Server start hota hai — `.env` file load karta hai, port set karta hai |
| `app.ts` | Express setup — CORS, JSON parsing, logging, sab routes mount karta hai |
| `lib/logger.ts` | Pino logger — development mein colored output, production mein JSON |

### Routes — `src/routes/`

| File | Route | Kaam |
|------|-------|------|
| `index.ts` | — | Saare routes ek jagah register karta hai |
| `health.ts` | `GET /api/healthz` | Server alive hai ya nahi check karta hai |
| `products.ts` | `GET /api/products` | Products ki list, filter, featured, new arrivals, best sellers |
| `categories.ts` | `GET /api/categories` | Product categories |
| `brands.ts` | `GET /api/brands` | Brands list |
| `cart.ts` | `/api/cart` | Cart items add/remove/view |
| `orders.ts` | `/api/orders` | Orders ka data |
| `contact.ts` | `POST /api/contact` | Contact form submit |
| `store.ts` | `GET /api/store/stats` | Store ki general info/stats |
| `chat.ts` | `POST /api/chat` | ⭐ **Groq AI chatbot** — streaming response |

---

## 🤖 Groq AI Chatbot — Sab Kuch Yahan Hai

### Groq Kya Hai?

**Groq** ek AI company hai jo ultra-fast language models run karti hai. Iska API OpenAI jaisa hi hai lekin bahut fast hota hai.

### Model

```
llama-3.3-70b-versatile
```

> Yeh ek open-source Llama model hai jo Groq ke infrastructure pe run hota hai.
> File: `artifacts/api-server/src/routes/chat.ts` — **line ~44**

### API Key Kahan Hai?

| Jagah | Detail |
|-------|--------|
| **Replit Secret** (primary) | `GROQ_API_KEY` — Replit ke Secrets panel mein set hai ✅ |
| **`.env` file** (local backup) | Root mein `.env` file — local development ke liye |
| **`.env.example`** | Template file — real key nahi, sirf example |

> ⚠️ **Important:** Replit Secret ka value `.env` se zyada important hai — agar dono set hain toh Replit Secret hi use hoga.

### Chat Route Kaise Kaam Karta Hai?

```
User message → POST /api/chat → Groq API → SSE stream → ChatBot.tsx
```

1. Frontend `ChatBot.tsx` message send karta hai `/api/chat` pe
2. `chat.ts` Groq ko request karta hai llama model se
3. Groq word-by-word (streaming) response deta hai
4. Response real-time mein chatbot mein dikhta hai

### System Prompt (Chatbot ka Character)

> Chatbot sirf OZY Sneakers ke baare mein baat karta hai — koi aur topic nahi. Hinglish mein reply karta hai.
> File: `artifacts/api-server/src/routes/chat.ts`

---

## 🔑 Environment Variables

| Variable | Kahan Set Hai | Kaam |
|----------|--------------|------|
| `GROQ_API_KEY` | Replit Secrets + `.env` | Groq AI chatbot ke liye API key |
| `SESSION_SECRET` | Replit Secrets | Session encryption ke liye |
| `DATABASE_URL` | `.env` (local) | PostgreSQL database connection |
| `PORT` | Auto (Replit) | Frontend server ka port (25480) |
| `API_PORT` | Auto (Replit) | API server ka port (8080) |
| `BASE_PATH` | Auto (Replit) | Frontend ka URL base path |
| `GROQ_BASE_URL` | `.replit` file | Groq API endpoint URL |

---

## 📂 Public Assets — `artifacts/ozy-snaker/public/`

| File | Kaam |
|------|------|
| `bot-avatar.jpg` | Chatbot ka robot icon (floating animated button) |
| `favicon.png` | Browser tab pe dikhne wala OZY logo |
| Baaki images | Product aur brand images |

---

## 🗂️ Root Level Files

| File | Kaam |
|------|------|
| `pnpm-workspace.yaml` | Monorepo config — kaun se folders workspace mein hain |
| `package.json` | Root package — typecheck/build scripts |
| `tsconfig.json` | TypeScript base config |
| `.env.example` | Environment variables ka template |
| `.env` | Real environment variables (git mein nahi hoga — private) |
| `.gitignore` | Git se kya ignore karna hai |
| `.replit` | Replit platform config — workflows, deployment, secrets |
| `README.md` | Yeh file 📄 |

---

## 🚀 Workflows (Servers)

| Workflow | Command | Port |
|----------|---------|------|
| `artifacts/ozy-snaker: web` | `pnpm --filter @workspace/ozy-snaker run dev` | 25480 |
| `artifacts/api-server: API Server` | `pnpm --filter @workspace/api-server run dev` | 8080 |

---

## 🔗 API Routing

Replit platform dono servers ko ek domain pe route karta hai:

```
yourdomain.replit.dev/        → Frontend (ozy-snaker, port 25480)
yourdomain.replit.dev/api/... → API Server (port 8080)
```

---

## 📦 Shared Libraries — `lib/`

| Package | Kaam |
|---------|------|
| `lib/db/` | Database schema (Drizzle ORM) |
| `lib/api/` | Shared API types aur Zod validation schemas |

---

*Last updated: August 2026*
