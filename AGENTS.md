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

### 16. Reviews section redesign
**Date:** 2026-08-22
- Home page reviews section (footer ke upar) redesign: 3 static cards → **12 sneaker-relevant reviews** (product tags ke saath) dual infinite marquee mein — row 1 left scroll, row 2 right scroll, hover pe pause, edge fades, initials avatar + spring stars + "Bought:" product tag per card
- `index.css` mein `marquee-reverse` keyframes + `.reviews-track/.reviews-track-reverse/.reviews-marquee` classes + prefers-reduced-motion support add kiya
- Heading ke neeche "4.9 Average Rating · 500+ Happy Customers" mono line add kiya; typecheck pass, Vite HMR se live update verified

### 17. Local website preview start
**Date:** 2026-08-24
- User ko website ka local preview dikhaya — PostgreSQL (5433) pehle se chal raha tha, API server (port 3000) + Vite frontend (port 5173) separate cmd windows mein start kiye (`start-all.bat` wale commands se)
- Verify: healthz 200, products API via Vite proxy 200 (3 items), browser mein `http://localhost:5173` khola

### 18. Reviews section color rebalance (website theme match)
**Date:** 2026-08-24
- Problem: reviews section mein har jagah orange/red tha (bg glow, particles, avatar, stars, Verified Buyer tag, hover glow) — upar se `rgba(220,38,38)` red use hua jo site ke infrared orange `#ff5c00` se bhi match nahi karta
- Fix (kuch add kiye bina, sirf recolor): red animated gradient → subtle neutral white glow; particles accent → white/20; label ka red textShadow glow hata diya; card hover orange border + red shadow → white border/bg; avatar orange → monochrome white; "Verified Buyer" accent → white/45; top hover line ab solid accent (orange-500 gradient mix hataya)
- Orange ab sirf intentional jagah bacha: section label, heading word "Sneakerheads", rating-line + card stars, hover line — website ke black/white + sparing accent pattern jaisa
- Typecheck pass; frontend restart karke verify kiya (API proxy OK), browser `#reviews` pe khola

### 19. Reviews content rewrite (offline shop + real feel)
**Date:** 2026-08-24
- Problem: reviews online shop jaise the — "2 din delivery", "WhatsApp pe order", "online order", "quick delivery" — jabki OZY offline shop hai; upar se AI-written generic praise lag raha tha
- Saare 12 reviews rewrite kiye in-store experience par: shop aake pairs try karna, staff/bhaiya ka behaviour, first copy vs original ka bharosa, size try karke perfect fit, family ke liye shopping, Ratia local reference, 2-saal purana loyal customer, dost refer
- Natural Hinglish tone rakhi (imperfect grammar + specific details) taaki real Google-review jaisa lage, AI nahi
- Card label "Bought:" → "Picked up:" (in-store vibe); layout/design untouched
- Typecheck pass; HMR se live verify

### 20. Console 503 error fix (servers down tha)
**Date:** 2026-08-24
- User ko browser console mein `503 Service Unavailable` error mil raha tha
- Diagnosis: external resources (Google Fonts ×2, Maps embed) sab 200 OK the; asli problem yeh thi ki **API server (3000) + frontend (5173) dono band ho gaye the** (cmd windows close) — khula browser page /api/* requests pe Vite proxy se 503/502-style errors dikhata raha
- Fix: dono servers restart kiye (`start-all.bat` commands), phir poora endpoint sweep verify — favicon/og-image statics + saare API routes (products/categories/brands/cart/orders/store stats/healthz) **sab 200**
- Note: agar user cmd windows band kare toh yehi error wapas aayega — servers chalu rakho ya refresh karo jab servers up hon

### 21. Contact form 503 fix (GMAIL_USER missing)
**Date:** 2026-08-24
- User ko `POST /api/contact 503` error mil raha tha (custom-fetch.ts:363 se fetch)
- Diagnosis: `contact.ts` line 39 mein `createTransporter()` tab null return karta hai jab `GMAIL_USER`/`GMAIL_APP_PASSWORD` env missing ho → server khud 503 "Email service is not configured" deta hai; local `.env` check kiya (values print kiye bina) — `GMAIL_APP_PASSWORD` present tha par **`GMAIL_USER` missing** tha (Replit pe tha, local Windows `.env` mein kabhi add nahi hua)
- Fix: `.env` mein `GMAIL_USER=anujror202007@gmail.com` (business email, code mein already public) add kiya + backend restart (port 3000 kill karke same command se start)
- Verify: real POST `/api/contact` via Vite proxy → **200 success**, contact DB mein save + Gmail SMTP email bhi send ho gaya
- Note: contact form test se owner inbox mein ek test email aata hai

### 22. Reviews section background image
**Date:** 2026-08-24
- User request: reviews section ke plain dark background mein achi si image/theme ho website ke hisab se
- Website ka existing pattern follow kiya (jaise hero/slideshow): `statsBg` image (`image_1784883327092.png` — pehle se imported tha par unused) ko cover bg layer banaya + heavy dark gradient overlay (94%→84%→96% black) taaki cards readable rahen aur sirf subtle texture dikhe
- Baaki sab untouched: white ambient glow, particles, monochrome + accent color scheme (task #18 wala)
- Typecheck pass; HMR se live

### 23. Review cards size chhota kiya
**Date:** 2026-08-24
- User request: review cards bade lag rahe the, chhote karne the
- Card width `w-[300px] sm:w-[360px]` → `w-[250px] sm:[290px]`; padding `p-6` → `p-4`; avatar `h-11 w-11 text-sm` → `h-9 w-9 text-xs`
- Review text ab `text-sm`, name `text-sm`, footer spacing `mt-6 pt-4` → `mt-3 pt-3`, cards ke beech gap `gap-5` → `gap-4`
- Typecheck pass; HMR se live

### 24. Review cards mein product image backgrounds
**Date:** 2026-08-24
- User ko section abhi bhi plain lag raha tha — har review card ke **andar** uski shoe ki image background chahiye thi
- `CustomerReview` type mein `image` field add kiya; har review ko relevant image di: AF1 → `product1`, Mexico 66 → `product2/product3`, Basketball/Running/Lifestyle/Training/Casual → category images (`catBasketball/catRunning/catLifestyle/catTraining`) — sab pehle se imported assets
- Card JSX mein cover image layer + dark gradient overlay (72%→90% black) taaki text readable rahe; card pe `overflow-hidden`, content pe `relative z-10`
- Section ka statsBg background + glow/particles waise hi rakhe
- Typecheck pass; HMR se live

### 25. Review cards minimal (sirf review + naam)
**Date:** 2026-08-24
- User request: card mein text zyada hai — sirf naam aur review hona chahiye, aur kuch nahi
- Card se hataya: initials avatar, 5 stars, "✓ Verified Buyer", "Picked up: product" tag; unused `Star` import bhi nikala (kahin aur use nahi hota tha)
- Card ab = review quote + neeche "— Name" (hairline divider ke saath); image bg + overlay + hover accent line same rakhe
- Data arrays mein `product` field ab bhi hai par render nahi hota (agar future mein tags wapas chahiye ho)
- Typecheck pass; HMR se live

### 26. Google review invite card (reviews section mein)
**Date:** 2026-08-24
- User ne offline shop ke liye customer reviews lene ka option manga; 4 preview mockups (11 variants) dikhane ke baad **Option B — Invite Card** select hua
- Reviews section mein marquee rows ke baad card add kiya: white square mein multicolor Google G logo + framer-motion ripple rings, "Visit Pasand Aayi? 👟" heading (Aayi accent orange), mono subtext ("Bas 2 minute do..."), white "Write a Google Review →" button (hover: orange bg + lift + arrow slide)
- `googleReviewUrl` constant Home.tsx top pe — abhi shop ka existing maps short link (`https://maps.app.goo.gl/o6bLhxxsyr9JjLQ99`) use ho raha hai; asli direct review link (`https://g.page/r/<ID>/review`) Google Business Profile se lena hai jab user de
- Card scroll pe fade-in hota hai (whileInView); typecheck pass; HMR se live

### 27. Footer background image
**Date:** 2026-08-24
- User request: footer ka plain black background boring hai — website ke hisab se acha background chahiye
- Website ka established pattern follow kiya: `heroBg` image (hero wali hi) cover bg layer + heavy dark gradient overlay (94%→85%→96% black) — hero aur footer same image se open/close hote hain (bookend effect), text readable rehta hai
- Footer `relative overflow-hidden` banaya, content container pe `relative z-10`; har page pe dikhega (Shell sab pages pe footer render karta hai)
- Typecheck pass; HMR se live

### 28. Website preview start (servers down the)
**Date:** 2026-08-25
- User ko website preview chahiye tha; PostgreSQL (5433) pehle se chal raha tha par API server (3000) + frontend (5173) dono band the
- Dono servers `start-all.bat` wale commands se separate cmd windows mein start kiye
- Verify: healthz 200, products API direct + Vite proxy dono se 200; browser mein `http://localhost:5173` khula

### 29. Chatbot voice replies (Cartesia TTS integration)
**Date:** 2026-08-25
- User request: chatbot jawab text ke saath-saath bolke bhi sunaye (Cartesia TTS key di)
- `CARTESIA_API_KEY` root `.env` mein add kiya; `.env.example` mein template update kiya
- `routes/tts.ts` banaya — `POST /api/tts` proxy route: frontend text → Cartesia `sonic-3` model + Daniel voice (male assistant, `hi` language) → MP3 audio bytes
- Retry logic add kiya: max 2 retries with 1.5s×attempt backoff; 15s AbortController timeout per request
- Cartesia `sonic-2` model sunsetted hai (400 error) → `sonic-3` use kiya; `hi` (Hindi) language support verify kiya

### 30. Chatbot voice playback fix (frontend rebuild + route mount)
**Date:** 2026-08-26
- Problem: Task #29 ka backend `tts.ts` ban gaya tha par frontend ChatBot.tsx mein voice code missing tha (revert/lost), aur `routes/index.ts` mein ttsRouter mount nahi hua tha
- `routes/index.ts` mein `ttsRouter` import + `router.use(ttsRouter)` add kiya — ab `POST /api/tts` live hai
- `ChatBot.tsx` mein complete voice playback rebuild kiya:
  - 🔊/🔇 toggle button in chat header — localStorage (`ozy_voice_on`) se persist hota hai
  - Stream ke dauran `streamBufferRef` accumulate karta hai, punctuation (`.!?`) ya newline pe sentence split hota hai
  - `flushToVoice`: complete sentences queue mein push, incomplete last sentence buffer mein rehta hai; stream done pe remaining sab flush
  - `pumpVoice` async loop: queue se sentence → `cleanForTTS` (emojis/markdown/URLs hatao) → `POST /api/tts` → MP3 blob → `Audio()` play → ended → 600ms cooldown → next
  - `generationRef` pattern: naye message ya chat band par generation++ → purana audio + queue cancel
  - Voice toggle off ya chat close pe `stopVoice` call — audio + queue sab clean
- Typecheck pass (api-server, ozy-snaker, mockup-sandbox, scripts — sab green)

### 31. Chatbot voice change (Daniel → custom voice)
**Date:** 2026-08-26
- User ne apni pasand ki Cartesia voice ID di: `4877b818-c7fe-4c89-b1cf-eadf8e23da72`
- `tts.ts` mein default voice ID `47c38ca4...` (Daniel) → `4877b818...` (user's choice) change ki
- API server rebuild + restart kiya; TTS test OK — nayi voice se audio aa raha hai (43KB mp3)

### 32. Chatbot voice speed fix (pre-fetch + faster splitting)
**Date:** 2026-08-26
- Problem: chatbot bahut slow bol raha tha — pehla word bolne mein bhi deri, sentences ke beech 600ms gap + TTS call latency
- Root causes: (a) sirf `.!?` pe hi sentence split hota tha (b) 600ms fixed cooldown (c) next sentence pre-fetch nahi hota tha
- Fix: `splitSentences` mein comma bhi split point — sentence jaldi ready hota hai; cooldown 600ms → 150ms; `prefetchedRef` pattern — next sentence ka TTS current play hone ke saath hi fetch hota hai → gap sirf network latency
- Typecheck pass

### 33. Chatbot 3D robot SVG icon (bot-avatar.jpg replace)
**Date:** 2026-08-26
- User request: existing `bot-avatar.jpg` image hatao, pure SVG se 3D robot icon banao — lightweight, sharp, kisi external image ki zaroorat nahi
- ChatBot.tsx toggle button mein `<img>` tag hatake inline SVG robot design kiya:
  - Robot head with antenna (pulsing orange glow), two cyan LED eyes with specular highlights, LED strip mouth (animated breathe), side bolts, body with pulsing chest light, arms
  - 3D depth: dual-tone gradients (headGrad/faceGrad), inner shadows, ground shadow ellipse
  - Hover 3D effect: `perspective(400px)` container + `rotateY(25deg) rotateX(-10deg) scale(1.1)` on mouseenter, smooth transition back
  - Float animation same rakha (`botFloat`), glow effect updated for SVG (`drop-shadow`)
- Close/X button unchanged, sab kuch kaam karta hai: TTS, text chat, open/close, voice toggle
- Typecheck pass

### 34. Chatbot size bada + white glow
**Date:** 2026-08-26
- Chat window: `max-w-sm` → `max-w-md` → `max-w-lg` (aur bada); message area `maxHeight: 420px→500px`, `minHeight: 280px→340px`
- Robot icon glow: orange `rgba(255,92,0)` → white `rgba(255,255,255)` — default + hover states dono
- Position: `left-4` → `right-4` — chat window + toggle button dono ab right side
- Close button orange glow same rakha
- Typecheck pass

### 35. Single-command dev setup (backend + frontend ek saath)
**Date:** 2026-08-29
- User request: backend (3000) + frontend (5173) ek hi command se chalu ho, alag-alag cmd windows nahi
- **Root `dev.mjs`** banaya — `pnpm dev` (or `pnpm run dev`) se dono ek saath start hote hain:
  - API server sirf tab build hota hai jab `dist/index.mjs` missing ho ya source newer ho (mtime check — `artifacts/api-server/src`, `lib/api-zod`, `lib/db` watch); pehli baar 86s, uske baad instant
  - Backend: `node --enable-source-maps --env-file=<root>\.env dist/index.mjs` (root .env ko Node `--env-file` se load — `configDotenv` override:false ke saath DATABASE_URL set nahi karta, isliye flag zaroori)
  - Frontend: root se `node artifacts/ozy-snaker/node_modules/vite/bin/vite.js --config vite.config.ts --host 0.0.0.0` (pnpm dev script Unix-only hai, isliye Vite bin direct spawn hota hai)
  - Dono same console mein spawn — ek Ctrl+C dono band, ek child exit ho toh doosra bhi kill
- Root `package.json` mein `"dev": "node dev.mjs"` script add kiya; `start-all.bat` ko bhi single-command (`call pnpm run dev`) bana diya
- Koi naya dependency nahi add ki (preinstall Unix-only hai isliye pnpm install na karwana pada)
- Verify: `pnpm dev` ek window se — healthz 200, products via Vite proxy 200, dono ports LISTENING

### 36. Vercel white screen fix (ERR_CONTENT_DECODING_FAILED)
**Date:** 2026-09-01
- User ne website Vercel pe live host kiya, par visit karne pe **white screen** + console mein `ERR_CONTENT_DECODING_FAILED`
- Root cause: `artifact/ozy-snaker/vercel.json` mein sirf API rewrite tha — koi **buildCommand / outputDirectory** nahi tha, aur root directory sahi set nahi thi. Isliye Vercel compiled build ki jagah raw/source files serve kar raha tha → browser decode nahi kar pa raha → white screen
- Aise hi critical: project ek **pnpm monorepo** hai — frontend `@workspace/ozy-snaker` workspace package (`@workspace/api-client-react`) import karta hai, jo `artifact/ozy-snaker/` ke bahar `lib/` mein hai. Isliye Vercel ki **Root Directory monorepo root** (`.`) honi chahiye, warna workspace packages resolve nahi honge aur build fail hoga
- Fix:
  - **Root `vercel.json`** banaya (authoritative — subfolder wale ko revert kiya):
    - `buildCommand`: `pnpm --filter @workspace/ozy-snaker run build`
    - `outputDirectory`: `artifacts/ozy-snaker/dist/public` (kyunki `vite.config.ts` ka outDir `dist/public` hai — wahi `index.html` milta hai)
    - API rewrite (Render) pehle, phir SPA fallback `/(.*)` → `/index.html` (client-side routing ke liye)
- Locally verify: poora production build (`pnpm --filter @workspace/ozy-snaker run build`) ~2min mein success hua, `dist/public/index.html` bana aur correct absolute `/assets/index-*.js|css` reference karta hai
- **User ke liye Vercel dashboard steps:** Root Directory = `.` (monorepo), Node ~20+, Default (pnpm via pnpm-lock.yaml), commit + push karke naya deploy; Render pe API already chal rahi hai
- Note: `zipFile.zip` + ander ka `vercel.json` purana hai — abhi relevant nahi

---
*Yeh file living document hai — jab bhi project badle ya naya task ho, isi ko update karo.*
