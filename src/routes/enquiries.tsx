import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FileText, Mail, Phone, RefreshCw } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { formatBytes } from "@/lib/prepare-upload";

export const Route = createFileRoute("/enquiries")({
  head: () => ({
    meta: [
      { title: "Enquiries | Balance Electrical" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Enquiries,
});

type EnquiryFile = { name: string; size: number; type: string; url: string | null };
type Enquiry = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string | null;
  suburb: string | null;
  service_type: string;
  stage: string | null;
  budget: string | null;
  timeframe: string | null;
  message: string | null;
  files: EnquiryFile[];
};

const STORE = "balance-enquiries-link";

const readStored = () => {
  try {
    return localStorage.getItem(STORE);
  } catch {
    return null;
  }
};
const writeStored = (v: string | null) => {
  try {
    if (v) localStorage.setItem(STORE, v);
    else localStorage.removeItem(STORE);
  } catch {
    /* private mode: the link still works for this visit */
  }
};

/*
  Private list of website enquiries. Access comes from a signed link emailed only to the
  Balance inbox; the token lives in the URL fragment, so it never reaches a server log.
*/
function Enquiries() {
  const [token, setToken] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "expired" | "error">("idle");
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [linkState, setLinkState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fromHash = new URLSearchParams(window.location.hash.slice(1)).get("token");
    if (fromHash) {
      writeStored(fromHash);
      history.replaceState(null, "", window.location.pathname);
    }
    setToken(fromHash ?? readStored());
  }, []);

  const load = useCallback(async (t: string) => {
    setState("loading");
    const { data, error } = await supabase.functions.invoke<{ enquiries: Enquiry[] }>(
      "enquiries-admin",
      { body: { action: "list", token: t } },
    );
    if (error) {
      const status = (error as { context?: Response }).context?.status;
      if (status === 401) {
        writeStored(null);
        setToken(null);
        setState("expired");
      } else setState("error");
      return;
    }
    setRows(data?.enquiries ?? []);
    setState("ready");
  }, []);

  useEffect(() => {
    if (token) void load(token);
  }, [token, load]);

  const sendLink = async () => {
    setLinkState("sending");
    const { error } = await supabase.functions.invoke("enquiries-admin", {
      body: { action: "send-link" },
    });
    setLinkState(error ? "error" : "sent");
  };

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.full_name, r.email, r.phone, r.suburb, r.service_type, r.stage, r.message]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [rows, query]);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1100px] px-5 pb-28 pt-36 md:px-10 md:pt-44">
        <p className="eyebrow text-ink-soft">Private</p>
        <h1 className="display-caps mt-5 text-[clamp(2.2rem,5vw,4rem)] leading-[1] tracking-[0.1em]">
          Enquiries
        </h1>

        {!token && (
          <div className="mt-10 max-w-xl border-[8px] border-frame p-7 md:p-10">
            <p className="leading-relaxed text-ink-soft">
              {state === "expired"
                ? "That link has expired. "
                : "This page lists every enquiry sent through the website. "}
              We'll email a private link to enquiries@balanceelectrical.co.nz — it opens the list on
              any device for 14 days.
            </p>
            <Button
              variant="lux"
              size="xl"
              className="mt-8"
              onClick={sendLink}
              disabled={linkState === "sending" || linkState === "sent"}
            >
              <Mail /> {linkState === "sent" ? "Link sent — check the inbox" : "Email me a link"}
            </Button>
            {linkState === "error" && (
              <p className="mt-4 text-sm text-ink-soft">
                Couldn't send the link. Please try again shortly.
              </p>
            )}
          </div>
        )}

        {token && (
          <>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, suburb, project…"
                className="h-11 max-w-sm rounded-none border-ink/25 bg-transparent"
              />
              <Button variant="luxOutline" size="lg" onClick={() => load(token)}>
                <RefreshCw /> Refresh
              </Button>
              <button
                type="button"
                onClick={() => {
                  writeStored(null);
                  setToken(null);
                  setRows([]);
                  setState("idle");
                }}
                className="beam-link eyebrow text-[10px]"
              >
                Sign out on this device
              </button>
              <span className="eyebrow ml-auto text-[10px] text-ink-soft">
                {state === "ready" && `${shown.length} of ${rows.length}`}
              </span>
            </div>

            {state === "loading" && <p className="mt-10 text-ink-soft">Loading enquiries…</p>}
            {state === "error" && (
              <p className="mt-10 text-ink-soft">Couldn't load the list. Try Refresh.</p>
            )}
            {state === "ready" && rows.length === 0 && (
              <p className="mt-10 text-ink-soft">No enquiries yet.</p>
            )}

            <ol className="mt-10 space-y-6">
              {shown.map((r) => (
                <li key={r.id} className="border border-ink/20 p-6 md:p-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h2 className="font-display text-2xl">{r.full_name}</h2>
                    <time className="eyebrow text-[10px] text-ink-soft" dateTime={r.created_at}>
                      {new Date(r.created_at).toLocaleString("en-NZ", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </time>
                  </div>
                  <p className="eyebrow mt-3 text-[10px] leading-relaxed text-ink-soft">
                    {[r.service_type, r.stage, r.budget, r.timeframe, r.suburb]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <a href={`mailto:${r.email}`} className="beam-link inline-flex items-center gap-2">
                      <Mail className="size-4" /> {r.email}
                    </a>
                    {r.phone && (
                      <a href={`tel:${r.phone}`} className="beam-link inline-flex items-center gap-2">
                        <Phone className="size-4" /> {r.phone}
                      </a>
                    )}
                  </div>
                  {r.message && (
                    <p className="mt-5 whitespace-pre-line leading-relaxed text-ink-soft">
                      {r.message}
                    </p>
                  )}
                  {r.files.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-3">
                      {r.files.map((f) =>
                        f.url ? (
                          <li key={f.url}>
                            <a
                              href={f.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 border border-ink/20 px-3 py-2 text-sm hover:border-ink/50"
                            >
                              <FileText className="size-4" /> {f.name}
                              <span className="text-xs text-ink-soft">{formatBytes(f.size)}</span>
                            </a>
                          </li>
                        ) : null,
                      )}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </>
        )}
      </section>
    </SiteLayout>
  );
}
