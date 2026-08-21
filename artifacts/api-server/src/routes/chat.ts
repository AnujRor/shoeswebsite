import { Router } from "express";
import OpenAI from "openai";

const router = Router();

function getOpenAI() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");
  return new OpenAI({
    apiKey,
    baseURL: process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1",
  });
}

const SYSTEM_PROMPT = `Tum OZY Sneakers website ke customer support assistant ho. Tumhara kaam sirf OZY Sneakers ke baare mein madad karna hai.

OZY Sneakers ke baare mein yeh information hai:
- Premium quality sneakers ki ek brand hai
- Instagram: Ozy_sneakers1223
- WhatsApp: 79000-51580 aur 90534-74158
- Brands: Nike, Onitsuka Tiger aur aur bhi
- Products: running shoes, casual sneakers, lifestyle footwear
- Website par products browse, cart aur order karne ki suvidha hai
- Kisi bhi product ya order ke liye WhatsApp par contact kar sakte hain

Strict rules:
1. Sirf OZY Sneakers se related sawaalon ka jawab do.
2. Agar koi kuch aur pooche (politics, general knowledge, coding, koi bhi doosra topic) to politely mana kar do aur kaho "Bhai, main sirf OZY Sneakers ke baare mein help kar sakta hoon."
3. Kabhi baat na karo ki tum kaunsa AI ho, kaunsa model ho, ya kaunsi technology use ho rahi hai. Agar koi pooche to kaho "Main OZY Sneakers ka assistant hoon."
4. Apne jawab short aur friendly rakhna.
5. Hamesha Indian Hinglish mein jawab do — jaise dost baat karta hai, natural aur casual. Example: "Bhai", "yaar", "bilkul", "ekdum sahi", "koi baat nahi" jaisi expressions use karo.
6. Greeting hamesha "Jai Shree Ram" se shuru karo agar pehli baar baat ho rahi ho.`;

router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body as {
      messages: { role: "user" | "assistant"; content: string }[];
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "messages array required" });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await getOpenAI().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_completion_tokens: 512,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    console.error("Chat error:", err);
    res.write(`data: ${JSON.stringify({ error: "Kuch problem aayi, dobara try karein." })}\n\n`);
    res.end();
  }
});

export default router;
