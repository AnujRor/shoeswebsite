import { Router, type IRouter } from "express";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import { db, contactsTable } from "@workspace/db";
import { SubmitContactBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const ownerEmail = process.env.CONTACT_EMAIL?.trim() || process.env.GMAIL_USER?.trim() || "anujror202007@gmail.com";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function emailHtml(data: {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#111;color:#fff;border-radius:8px;">
      <h2 style="color:#ff5c00;margin-top:0;">New Message on Ozy Sneakers</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#aaa;width:100px;">Name</td><td style="padding:8px 0;font-weight:bold;">${data.name}</td></tr>
        <tr><td style="padding:8px 0;color:#aaa;">Email</td><td style="padding:8px 0;"><a href="mailto:${data.email}" style="color:#ff5c00;">${data.email}</a></td></tr>
        ${data.phone ? `<tr><td style="padding:8px 0;color:#aaa;">Phone</td><td style="padding:8px 0;">${data.phone}</td></tr>` : ""}
        ${data.subject ? `<tr><td style="padding:8px 0;color:#aaa;">Subject</td><td style="padding:8px 0;">${data.subject}</td></tr>` : ""}
      </table>
      <hr style="border-color:#333;margin:16px 0;"/>
      <p style="color:#aaa;margin-bottom:8px;">Message:</p>
      <p style="background:#1a1a1a;padding:16px;border-radius:4px;line-height:1.6;">${data.message.replace(/\n/g, "<br/>")}</p>
    </div>
  `;
}

/**
 * Send notification via Gmail SMTP (reliable Gmail→Gmail delivery to the
 * owner's inbox — Resend's onboarding@resend.dev test domain does not deliver
 * to arbitrary recipients).
 */
async function sendViaGmail(data: {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}): Promise<boolean> {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!user || !pass) return false;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4,
    auth: { user, pass },
  } as nodemailer.TransportOptions);

  try {
    await transporter.sendMail({
      from: `"Ozy Sneakers Contact" <${user}>`,
      to: ownerEmail,
      replyTo: data.email,
      subject: `New Contact: ${data.subject ?? "No Subject"} — from ${data.name}`,
      html: emailHtml(data),
    });
    logger.info({ to: ownerEmail }, "Contact email sent via Gmail SMTP");
    return true;
  } catch (err) {
    logger.error({ err }, "Failed to send contact email via Gmail SMTP");
    return false;
  }
}

/** Fallback notification channel via Resend (best-effort). */
async function sendViaResend(data: {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}): Promise<boolean> {
  if (!resend) return false;
  try {
    await resend.emails.send({
      from: "Ozy Sneakers Contact <onboarding@resend.dev>",
      to: ownerEmail,
      replyTo: data.email,
      subject: `New Contact: ${data.subject ?? "No Subject"} — from ${data.name}`,
      html: emailHtml(data),
    });
    logger.info({ to: ownerEmail }, "Contact email sent via Resend");
    return true;
  } catch (err) {
    logger.error({ err }, "Failed to send contact email via Resend");
    return false;
  }
}

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // Critical path: persist the message. If this fails, surface an error.
  try {
    await db.insert(contactsTable).values({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      subject: parsed.data.subject ?? null,
      message: parsed.data.message,
    });
  } catch (err) {
    logger.error({ err }, "Failed to save contact to database");
    res.status(500).json({ error: "Failed to save your message. Please try again." });
    return;
  }

  // User always gets success — email notification is non-blocking.
  res.json({ success: true, message: "Thank you for contacting Ozy Sneakers! We will get back to you soon." });

  const data = {
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    subject: parsed.data.subject ?? null,
    message: parsed.data.message,
  };

  // Gmail SMTP first (reliable to owner's inbox), Resend as fallback.
  (async () => {
    const sentViaGmail = await sendViaGmail(data);
    if (!sentViaGmail) {
      await sendViaResend(data);
    }
  })().catch((err) => {
    logger.error({ err }, "All email notification channels failed");
  });
});

export default router;