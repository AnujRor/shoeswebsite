import { Router, type IRouter } from "express";
import { Resend } from "resend";
import { db, contactsTable } from "@workspace/db";
import { SubmitContactBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const resend = new Resend(process.env.RESEND_API_KEY);
const ownerEmail = process.env.CONTACT_EMAIL ?? "anujror202007@gmail.com";

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // Save to database
  await db.insert(contactsTable).values({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    subject: parsed.data.subject ?? null,
    message: parsed.data.message,
  });

  // Send email notification via Resend
  if (!process.env.RESEND_API_KEY) {
    logger.error("Resend API key not configured");
    res.status(503).json({ error: "Email service is not configured." });
    return;
  }

  try {
    await resend.emails.send({
      from: "Ozy Snaker Contact <onboarding@resend.dev>",
      to: ownerEmail,
      subject: `New Contact: ${parsed.data.subject ?? "No Subject"} — from ${parsed.data.name}`,
      html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#111;color:#fff;border-radius:8px;">
            <h2 style="color:#ff5c00;margin-top:0;">New Message on Ozy Snaker</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#aaa;width:100px;">Name</td><td style="padding:8px 0;font-weight:bold;">${parsed.data.name}</td></tr>
              <tr><td style="padding:8px 0;color:#aaa;">Email</td><td style="padding:8px 0;"><a href="mailto:${parsed.data.email}" style="color:#ff5c00;">${parsed.data.email}</a></td></tr>
              ${parsed.data.phone ? `<tr><td style="padding:8px 0;color:#aaa;">Phone</td><td style="padding:8px 0;">${parsed.data.phone}</td></tr>` : ""}
              ${parsed.data.subject ? `<tr><td style="padding:8px 0;color:#aaa;">Subject</td><td style="padding:8px 0;">${parsed.data.subject}</td></tr>` : ""}
            </table>
            <hr style="border-color:#333;margin:16px 0;"/>
            <p style="color:#aaa;margin-bottom:8px;">Message:</p>
            <p style="background:#1a1a1a;padding:16px;border-radius:4px;line-height:1.6;">${parsed.data.message.replace(/\n/g, "<br/>")}</p>
          </div>
        `,
    });
    logger.info({ to: ownerEmail }, "Contact email sent via Resend");
  } catch (err) {
    logger.error({ err }, "Failed to send contact email via Resend");
    res.status(502).json({ error: "Unable to send contact email." });
    return;
  }

  res.json({ success: true, message: "Thank you for contacting Ozy Snaker! We will get back to you soon." });
});

export default router;
