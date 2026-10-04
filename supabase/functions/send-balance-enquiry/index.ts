import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const INBOX = "enquiries@balanceelectrical.co.nz";
const FROM_WEBSITE = "Balance Electrical Website <enquiries@balanceelectrical.co.nz>";
const FROM_BALANCE = "Balance Electrical <enquiries@balanceelectrical.co.nz>";
const PHONE_DISPLAY = "027 916 2077";
const PHONE_TEL = "+64279162077";
const SITE = "https://www.balanceelectrical.co.nz";

// Site palette — stone panel, ink type, warm glow accent.
const C = {
  page: "#d6cabd",
  panel: "#ece4da",
  stone: "#a69486",
  ink: "#1c1a18",
  soft: "#5a5048",
  rule: "#c9bcae",
  frame: "#1c1d1f",
  glow: "#f2c88b",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const field = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Everything a visitor types is escaped before it goes anywhere near HTML.
const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
const multiline = (s: string) => esc(s).replace(/\r?\n/g, "<br>");
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ");

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

function shell(inner: string) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:${C.page};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${C.panel};border:10px solid ${C.frame};font-family:Georgia,'Times New Roman',serif;color:${C.ink};">
<tr><td style="padding:28px 36px 20px;border-bottom:1px solid ${C.rule};">
<div style="font-size:22px;letter-spacing:0.42em;color:${C.ink};">BALANCE</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.32em;color:${C.soft};margin-top:6px;">ELECTRICAL · TAUPŌ</div>
</td></tr>
${inner}
<tr><td style="padding:22px 36px 28px;border-top:1px solid ${C.rule};font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.7;color:${C.soft};">
Victoria Grant · Registered Electrician<br>
<a href="tel:${PHONE_TEL}" style="color:${C.ink};text-decoration:none;">${PHONE_DISPLAY}</a> ·
<a href="mailto:${INBOX}" style="color:${C.ink};text-decoration:none;">${INBOX}</a> ·
<a href="${SITE}" style="color:${C.ink};text-decoration:none;">balanceelectrical.co.nz</a>
</td></tr>
</table>
</td></tr></table></body></html>`;
}

function rows(items: [string, string][]) {
  return items
    .map(
      ([k, v]) => `<tr>
<td style="padding:10px 0;border-bottom:1px solid ${C.rule};font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:${C.soft};width:120px;vertical-align:top;">${k}</td>
<td style="padding:10px 0;border-bottom:1px solid ${C.rule};font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:${C.ink};">${v}</td>
</tr>`,
    )
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  // Hidden field only bots fill in: pretend it worked and send nothing.
  if (field(body.website, 200)) return json({ success: true, confirmation: true });

  const full_name = field(body.full_name, 120);
  const email = field(body.email, 200);
  const phone = field(body.phone, 40);
  const suburb = field(body.suburb, 120);
  const service_type = field(body.service_type, 80) || "General enquiry";
  const message = field(body.message, 5000);

  if (!full_name || !email || !message) return json({ error: "Missing required fields" }, 400);
  if (!EMAIL_RE.test(email)) return json({ error: "Invalid email address" }, 400);

  const firstName = full_name.split(/\s+/)[0];
  const nzNow = new Date().toLocaleString("en-NZ", {
    timeZone: "Pacific/Auckland",
    dateStyle: "medium",
    timeStyle: "short",
  });

  // Keep a copy in the database, but never let that stop the email going out.
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { error } = await supabase.from("balance_enquiries").insert({
      full_name,
      phone: phone || null,
      email,
      suburb: suburb || null,
      service_type,
      message,
    });
    if (error) console.error("Enquiry not stored:", error.message);
  } catch (e) {
    console.error("Enquiry not stored:", (e as Error).message);
  }

  const summary = rows([
    ["Name", esc(full_name)],
    ["Email", `<a href="mailto:${esc(email)}" style="color:${C.ink};">${esc(email)}</a>`],
    [
      "Phone",
      phone ? `<a href="tel:${esc(phone)}" style="color:${C.ink};">${esc(phone)}</a>` : "—",
    ],
    ["Location", suburb ? esc(suburb) : "—"],
    ["Project", esc(service_type)],
    ["Message", multiline(message)],
  ]);

  // 1. The enquiry itself, to Victoria. If this fails the visitor is told to call instead.
  try {
    await sendEmail({
      from: FROM_WEBSITE,
      to: [INBOX],
      reply_to: email,
      subject: oneLine(`New enquiry — ${service_type} — ${full_name}`),
      html: shell(`<tr><td style="padding:28px 36px 8px;">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.32em;color:${C.soft};">NEW PROJECT ENQUIRY · ${esc(nzNow)}</div>
<div style="font-size:26px;line-height:1.25;margin:10px 0 18px;">${esc(full_name)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${summary}</table>
<p style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${C.soft};margin:22px 0 6px;">Reply to this email to answer ${esc(firstName)} directly.</p>
</td></tr>`),
    });
  } catch (e) {
    console.error("Enquiry email failed:", (e as Error).message);
    return json({ error: "Enquiry could not be sent" }, 502);
  }

  // 2. Confirmation to the person who sent it.
  let confirmation = true;
  try {
    await sendEmail({
      from: FROM_BALANCE,
      to: [email],
      reply_to: INBOX,
      subject: "Your enquiry has been sent — Balance Electrical",
      html: shell(`<tr><td style="padding:30px 36px 10px;">
<div style="font-size:28px;line-height:1.25;">Thanks, ${esc(firstName)}.</div>
<p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;color:${C.ink};margin:16px 0 0;">
Your enquiry has been sent to Balance Electrical. Victoria will be in touch within the next few days to talk it through.</p>
<p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.75;color:${C.ink};margin:14px 0 0;">
If it's urgent, call Victoria on <a href="tel:${PHONE_TEL}" style="color:${C.ink};font-weight:bold;text-decoration:none;">${PHONE_DISPLAY}</a>.</p>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.32em;color:${C.soft};margin:30px 0 4px;">WHAT YOU SENT</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${summary}</table>
<p style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.7;color:${C.soft};margin:20px 0 6px;">
Need to add something? Just reply to this email.</p>
</td></tr>`),
    });
  } catch (e) {
    confirmation = false;
    console.error("Confirmation email failed:", (e as Error).message);
  }

  return json({ success: true, confirmation });
});
