import { createClient } from "npm:@supabase/supabase-js@2";
import {
  confirmationEmail,
  enquiryEmail,
  INBOX,
  logoAttachment,
  PHONE_TEL,
  type EnquiryView,
} from "./email.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const FROM_WEBSITE = "Balance Electrical Website <enquiries@balanceelectrical.co.nz>";
const FROM_BALANCE = "Balance Electrical <enquiries@balanceelectrical.co.nz>";
// Links in the emails point here; SITE_URL overrides it (e.g. before the domain is live).
const SITE_URL = (Deno.env.get("SITE_URL") || "https://www.balanceelectrical.co.nz").replace(
  /\/$/,
  "",
);
const BUCKET = "enquiry-files";

// Uploads: photos and plans. The form shrinks photos before sending; these are hard limits.
const MAX_FILES = 6;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
]);

// Base64 for Resend attachments, in chunks so large files don't overflow the call stack.
function base64(bytes: Uint8Array) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const field = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ");
const safeName = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[^\w.\- ]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(-80) || "file";

async function sendEmail(payload: Record<string, unknown>) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) throw new Error("RESEND_API_KEY is not set");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Resend ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

// Optional text alert to Victoria. Needs TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and
// TWILIO_FROM (a number, or a Messaging Service SID starting "MG"); NOTIFY_SMS_TO overrides
// the destination number.
async function sendSms(body: string) {
  const sid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const token = Deno.env.get("TWILIO_AUTH_TOKEN");
  const from = Deno.env.get("TWILIO_FROM");
  if (!sid || !token || !from) return false;
  const params = new URLSearchParams({
    To: Deno.env.get("NOTIFY_SMS_TO") || PHONE_TEL,
    Body: body.slice(0, 320),
  });
  params.set(from.startsWith("MG") ? "MessagingServiceSid" : "From", from);
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${sid}:${token}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  if (!res.ok) throw new Error(`Twilio ${res.status}: ${await res.text()}`);
  return true;
}

type Upload = { name: string; type: string; size: number; bytes: Uint8Array };

// Accepts the multipart form (with files) or plain JSON (no files).
async function readRequest(
  req: Request,
): Promise<{ fields: Record<string, unknown>; files: File[] }> {
  if ((req.headers.get("content-type") ?? "").includes("multipart/form-data")) {
    const form = await req.formData();
    const fields: Record<string, unknown> = {};
    const files: File[] = [];
    for (const [k, v] of form.entries()) {
      if (typeof v === "string") fields[k] = v;
      else if (k === "files") files.push(v);
    }
    return { fields, files };
  }
  return { fields: await req.json(), files: [] };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let fields: Record<string, unknown>;
  let rawFiles: File[];
  try {
    ({ fields, files: rawFiles } = await readRequest(req));
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  // Hidden field only bots fill in: pretend it worked and send nothing.
  if (field(fields.website, 200)) return json({ success: true, confirmation: true });

  const full_name = field(fields.full_name, 120);
  const email = field(fields.email, 200);
  const phone = field(fields.phone, 40);
  const suburb = field(fields.suburb, 120);
  const service_type = field(fields.service_type, 80) || "General enquiry";
  const stage = field(fields.stage, 80);
  const budget = field(fields.budget, 80);
  const timeframe = field(fields.timeframe, 80);
  const message = field(fields.message, 5000);

  if (!full_name || !email || !message) return json({ error: "Missing required fields" }, 400);
  if (!EMAIL_RE.test(email)) return json({ error: "Invalid email address" }, 400);

  const nonEmpty = rawFiles.filter((f) => f.size > 0);
  if (nonEmpty.length > MAX_FILES) return json({ error: `Up to ${MAX_FILES} files` }, 400);
  let total = 0;
  const uploads: Upload[] = [];
  for (const f of nonEmpty) {
    const type = f.type || "application/octet-stream";
    if (!ALLOWED_TYPES.has(type)) return json({ error: `Unsupported file type: ${f.name}` }, 400);
    if (f.size > MAX_FILE_BYTES) return json({ error: `File too large: ${f.name}` }, 400);
    total += f.size;
    uploads.push({
      name: safeName(f.name),
      type,
      size: f.size,
      bytes: new Uint8Array(await f.arrayBuffer()),
    });
  }
  if (total > MAX_TOTAL_BYTES) return json({ error: "Files too large in total" }, 400);

  const firstName = full_name.split(/\s+/)[0];
  const nzNow = new Date().toLocaleString("en-NZ", {
    timeZone: "Pacific/Auckland",
    dateStyle: "medium",
    timeStyle: "short",
  });

  // Keep a copy (and the files) in Supabase, but never let that stop the email going out.
  const stored: { name: string; path: string; size: number; type: string }[] = [];
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const folder = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}`;
    for (const u of uploads) {
      const path = `${folder}/${u.name}`;
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, u.bytes, { contentType: u.type, upsert: false });
      if (error) console.error("File not stored:", u.name, error.message);
      else stored.push({ name: u.name, path, size: u.size, type: u.type });
    }
    const { error } = await supabase.from("balance_enquiries").insert({
      full_name,
      phone: phone || null,
      email,
      suburb: suburb || null,
      service_type,
      stage: stage || null,
      budget: budget || null,
      timeframe: timeframe || null,
      message,
      files: stored,
    });
    if (error) console.error("Enquiry not stored:", error.message);
  } catch (e) {
    console.error("Enquiry not stored:", (e as Error).message);
  }

  const view: EnquiryView = {
    fullName: full_name,
    firstName,
    email,
    phone,
    suburb,
    service: service_type,
    stage,
    budget,
    timeframe,
    message,
    files: uploads.map((u) => ({ name: u.name, size: u.size })),
    receivedAt: nzNow,
    siteUrl: SITE_URL,
  };

  // 1. The enquiry itself, to Victoria, with the photos and plans attached.
  //    If this fails the visitor is told to call instead.
  try {
    await sendEmail({
      from: FROM_WEBSITE,
      to: [INBOX],
      reply_to: email,
      subject: oneLine(`New enquiry — ${service_type} — ${full_name}`),
      attachments: [
        logoAttachment(),
        ...uploads.map((u) => ({ filename: u.name, content: base64(u.bytes) })),
      ],
      html: enquiryEmail(view),
    });
  } catch (e) {
    console.error("Enquiry email failed:", (e as Error).message);
    return json({ error: "Enquiry could not be sent" }, 502);
  }

  // 2. A text to Victoria's phone, if SMS is configured.
  try {
    await sendSms(
      oneLine(
        `New Balance enquiry: ${full_name} — ${service_type}` +
          (budget ? `, ${budget}` : "") +
          (timeframe ? `, ${timeframe}` : "") +
          `. ${phone || email}. Full details in your inbox.`,
      ),
    );
  } catch (e) {
    console.error("SMS alert failed:", (e as Error).message);
  }

  // 3. Confirmation to the person who sent it.
  let confirmation = true;
  try {
    await sendEmail({
      from: FROM_BALANCE,
      to: [email],
      reply_to: INBOX,
      subject: "Your enquiry has been sent — Balance Electrical",
      attachments: [logoAttachment()],
      html: confirmationEmail(view),
    });
  } catch (e) {
    confirmation = false;
    console.error("Confirmation email failed:", (e as Error).message);
  }

  return json({ success: true, confirmation });
});
