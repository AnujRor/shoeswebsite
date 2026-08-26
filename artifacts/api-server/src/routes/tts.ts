import { Router } from "express";

const router = Router();

const CARTESIA_URL = "https://api.cartesia.ai/tts/bytes";
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

router.post("/tts", async (req, res) => {
  const apiKey = process.env.CARTESIA_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "TTS service is not configured" });
    return;
  }

  const { text } = (req.body ?? {}) as { text?: string };
  const transcript = typeof text === "string" ? text.trim().slice(0, 800) : "";
  if (!transcript) {
    res.status(400).json({ error: "text required" });
    return;
  }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);

      const resp = await fetch(CARTESIA_URL, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
          "Cartesia-Version": "2025-04-16",
        },
        body: JSON.stringify({
          model_id: process.env.CARTESIA_MODEL_ID ?? "sonic-3",
          transcript,
          voice: {
            mode: "id",
            id: process.env.CARTESIA_VOICE_ID ?? "4877b818-c7fe-4c89-b1cf-eadf8e23da72",
          },
          language: process.env.CARTESIA_LANGUAGE ?? "hi",
          output_format: { container: "mp3", bit_rate: 128000, sample_rate: 44100 },
        }),
      });

      clearTimeout(timer);

      if (resp.ok) {
        const audio = Buffer.from(await resp.arrayBuffer());
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Cache-Control", "no-store");
        res.send(audio);
        return;
      }

      const status = resp.status;
      if (status === 429 || status >= 500) {
        if (attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAY_MS * (attempt + 1));
          continue;
        }
        console.error("TTS upstream error:", status, await resp.text());
        res.status(502).json({ error: "TTS provider error" });
        return;
      }

      console.error("TTS upstream error:", status, await resp.text());
      res.status(502).json({ error: "TTS provider error" });
      return;
    } catch (err: any) {
      if (err?.name === "AbortError" && attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * (attempt + 1));
        continue;
      }
      console.error("TTS error:", err);
      res.status(500).json({ error: "TTS failed" });
      return;
    }
  }
});

export default router;
