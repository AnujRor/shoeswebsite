---
name: Replit preview HMR websocket
description: Vite HMR websocket connections can produce false browser console errors in the proxied Replit preview.
---

When the Replit preview reports a failed Vite HMR websocket but the app itself loads correctly, disable Vite HMR for the preview rather than treating the warning as an application runtime failure.

**Why:** The proxied preview may not expose the local development websocket endpoint reliably, while REST/API requests and the rendered app continue to work.

**How to apply:** Confirm the browser log and workflow are otherwise clean, then use `server.hmr: false` in the affected Vite app and verify with a fresh preview.