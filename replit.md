# Ozy Sneakers

A full-stack sneaker e-commerce web app for OZY Sneakers, featuring a product catalog, cart, orders, a gallery, and an AI-powered Hinglish/English customer support chat bot powered by Groq.

## Stack

- **Frontend** (`artifacts/ozy-snaker`): React + Vite + Tailwind CSS + shadcn/ui + Wouter routing + TanStack Query
- **API Server** (`artifacts/api-server`): Express 5 + Drizzle ORM + Pino logging, built with esbuild
- **Database** (`lib/db`): PostgreSQL (Replit managed) via Drizzle ORM
- **AI Chat**: Groq API (llama-3.3-70b-versatile) via openai-compatible SDK

## Running the project

All three workflows start automatically:

| Workflow | Command |
|---|---|
| `artifacts/ozy-snaker: web` | `pnpm --filter @workspace/ozy-snaker run dev` |
| `artifacts/api-server: API Server` | `pnpm --filter @workspace/api-server run dev` |
| `artifacts/mockup-sandbox: Component Preview Server` | `pnpm --filter @workspace/mockup-sandbox run dev` |

## Environment variables

The API server loads `.env` from the workspace root at startup (with `override: false` so Replit Secrets always win). The `.env` file provides:

- `GROQ_API_KEY` — Groq API key for the AI chat assistant
- `GROQ_BASE_URL` — Groq base URL (set to `https://api.groq.com/openai/v1` in Replit env)
- `DATABASE_URL` — provided automatically by Replit (placeholder in `.env` is ignored)
- `SESSION_SECRET` — stored as a Replit Secret

## Database

Schema lives in `lib/db/src/schema/`. To push schema changes:
```
pnpm --filter @workspace/db run push
```

For a clean, repeatable database setup, apply the checked-in migration and seed data:
```
pnpm --filter @workspace/db run setup
```

To seed initial data (brands, categories, products) without applying migrations:
```
pnpm --filter @workspace/db run seed
```

To verify the running API's database-backed endpoints:
```
pnpm --filter @workspace/scripts run api:smoke
```

## User preferences

- Keep existing project structure and stack
- Har task complete hone ke baad `project.md` mein entry add karo — date, task name, aur kya kiya. Yeh automatically karna hai, bina pooche.
