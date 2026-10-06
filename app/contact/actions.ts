"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { site } from "@/content/site";
import { rateLimiter } from "@/lib/rate-limit";

const schema = z.object({
  regarding: z.string().refine((t) => site.contact.topics.includes(t)),
  // No line breaks: the name goes into the subject line.
  name: z.string().trim().min(1).max(200).regex(/^[^\r\n]*$/),
  // 254 is the longest address that can be delivered.
  email: z.string().trim().max(254).pipe(z.email()),
  message: z.string().trim().max(5000),
});

// What each field is called in an error, so the visitor knows what to fix.
const fieldNames: Record<keyof z.input<typeof schema>, string> = {
  regarding: "the topic",
  name: "your name",
  email: "your email address",
  message: "your message",
};

// Every valid submission sends a real email, and the action can be POSTed
// to directly, so cap how many get through: a few per visitor, and a daily
// ceiling in case a script rotates addresses.
const perVisitor = rateLimiter(5, 60 * 60 * 1000);
const perDay = rateLimiter(50, 24 * 60 * 60 * 1000);

type EnquiryValues = Record<keyof z.input<typeof schema>, string>;

export type EnquiryState =
  | { ok: true }
  | { ok: false; error: string; values: EnquiryValues }
  | null;

export async function sendEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  // Honeypot: people never fill this in, bots do. Pretend it worked. The name
  // is one autofill won't recognise, so it can't fill it in for a person.
  if (formData.get("leave_blank")) return { ok: true };

  const field = (key: string) => String(formData.get(key) ?? "");
  const values: EnquiryValues = {
    regarding: field("regarding"),
    name: field("name"),
    email: field("email"),
    message: field("message"),
  };

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0] as keyof EnquiryValues | undefined;
    const what = field ? fieldNames[field] : "the form";
    return { ok: false, error: `Please check ${what} and send it again.`, values };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  if (!perVisitor(ip) || !perDay("all")) {
    return { ok: false, error: "Too many enquiries have been sent just now.", values };
  }

  const { RESEND_API_KEY, ENQUIRY_FROM, ENQUIRY_TO } = process.env;
  if (!RESEND_API_KEY || !ENQUIRY_FROM || !ENQUIRY_TO) {
    console.error("RESEND_API_KEY, ENQUIRY_FROM or ENQUIRY_TO is not set; enquiry not sent.");
    return { ok: false, error: "Your enquiry could not be sent.", values };
  }

  const { regarding, name, email, message } = parsed.data;
  try {
    const { error } = await new Resend(RESEND_API_KEY).emails.send({
      from: ENQUIRY_FROM,
      to: ENQUIRY_TO,
      replyTo: email,
      subject: `${regarding} enquiry from ${name} — ${site.name}`,
      text: `${message || "(No message.)"}\n\n— ${name} <${email}>`,
    });
    if (error) throw error;
  } catch (err) {
    console.error("Resend failed to send enquiry:", err);
    return { ok: false, error: "Your enquiry could not be sent.", values };
  }

  return { ok: true };
}
