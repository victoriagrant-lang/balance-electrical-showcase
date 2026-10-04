import { createClient } from "npm:@supabase/supabase-js@2";

/*
  Private list of website enquiries.
  - "send-link": emails a sign-in link to the Balance inbox (and only there).
  - "list": with a valid link token, returns recent enquiries and short-lived file links.
  The link is an HMAC-signed expiry time, so there are no passwords to manage.
*/

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const INBOX = "enquiries@balanceelectrical.co.nz";
const FROM = "Balance Electrical Website <enquiries@balanceelectrical.co.nz>";
// Fixed origin: never build the link from request headers, or it could point elsewhere.
const SITE = Deno.env.get("SITE_URL") || "https://www.balanceelectrical.co.nz";
const BUCKET = "enquiry-files";
const LINK_DAYS = 14;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const b64url = (buf: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

async function sign(exp: number) {
  const secret =
    Deno.env.get("ADMIN_LINK_SECRET") || `enquiries:${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return b64url(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`list:${exp}`)));
}

function sameString(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function validToken(token: unknown) {
  if (typeof token !== "string") return false;
  const [expStr, sig] = token.split(".");
  const exp = Number(expStr);
  if (!Number.isInteger(exp) || !sig || exp < Date.now() / 1000) return false;
  return sameString(sig, await sign(exp));
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

  if (body.action === "send-link") {
    const exp = Math.floor(Date.now() / 1000) + LINK_DAYS * 86400;
    const link = `${SITE}/enquiries#token=${exp}.${await sign(exp)}`;
    const key = Deno.env.get("RESEND_API_KEY");
    if (!key) return json({ error: "Email is not configured" }, 500);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        from: FROM,
        to: [INBOX],
        subject: "Your link to the enquiries list",
        html: `<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#ece4da;color:#1c1a18;border:10px solid #1c1d1f;">
<div style="font-family:Georgia,serif;font-size:22px;letter-spacing:0.42em;">BALANCE</div>
<p style="font-size:15px;line-height:1.7;margin:24px 0;">Here's your private link to every enquiry sent through the website. It works for ${LINK_DAYS} days on any device.</p>
<p><a href="${link}" style="display:inline-block;background:#1c1a18;color:#ece4da;padding:14px 22px;text-decoration:none;letter-spacing:0.2em;font-size:12px;">OPEN ENQUIRIES</a></p>
<p style="font-size:12px;color:#5a5048;line-height:1.7;margin-top:24px;">Didn't ask for this? You can ignore it — the link only ever comes to this inbox.</p>
</div>`,
      }),
    });
    if (!res.ok) {
      console.error("Link email failed:", res.status, await res.text());
      return json({ error: "Could not send link" }, 502);
    }
    return json({ ok: true });
  }

  if (body.action === "list") {
    if (!(await validToken(body.token))) return json({ error: "Link expired or invalid" }, 401);
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data, error } = await supabase
      .from("balance_enquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) return json({ error: error.message }, 500);

    const enquiries = await Promise.all(
      (data ?? []).map(async (row) => {
        const files = Array.isArray(row.files) ? row.files : [];
        const linked = await Promise.all(
          files.map(async (f: { name: string; path: string; size: number; type: string }) => {
            const { data: signed } = await supabase.storage
              .from(BUCKET)
              .createSignedUrl(f.path, 60 * 60);
            return { ...f, url: signed?.signedUrl ?? null };
          }),
        );
        return { ...row, files: linked };
      }),
    );
    return json({ enquiries });
  }

  return json({ error: "Unknown action" }, 400);
});
