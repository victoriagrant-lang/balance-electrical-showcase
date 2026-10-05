import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { ArrowRight, Paperclip, Phone, X } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Testimonials } from "@/components/Reviews";
import { getGoogleReviews } from "@/lib/google-reviews";
import { CONTACT } from "@/lib/contact";
import { SITE, businessRef, jsonLd, websiteRef } from "@/lib/seo";
import { sendEnquiry, type SendFailure } from "@/lib/send-enquiry";
import { photos } from "@/lib/photos";
import { cn } from "@/lib/utils";
import { formatBytes, prepareUpload, UPLOAD_ACCEPT, UPLOAD_LIMITS } from "@/lib/prepare-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Reveal, SplitReveal } from "@/components/motion/Reveal";
import { EwrbLogo } from "@/components/EwrbLogo";

const PROJECT_TYPES = [
  "New residential build",
  "Renovation or addition",
  "Lighting design",
  "Smart home & automation",
  "Air conditioning & heating",
  "Solar & battery storage",
  "Commercial fit-out",
  "Maintenance & repairs",
  "EV charging",
  "Pool & spa wiring",
  "Pre-purchase report",
  "Something else",
];

const STAGES = [
  "Early ideas — no plans yet",
  "Plans drawn — ready to price",
  "Consented — build starting soon",
  "Under construction — framing / pre-wire",
  "Renovating an existing home",
  "Existing home or business — upgrade or repair",
];

const BUDGETS = [
  "Under $5,000",
  "$5,000 – $15,000",
  "$15,000 – $40,000",
  "$40,000 – $100,000",
  "$100,000+",
  "Not sure yet",
];

const TIMEFRAMES = [
  "As soon as possible",
  "Within 1–3 months",
  "3–6 months",
  "6–12 months",
  "More than 12 months",
  "Just exploring",
];

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): { service?: string } => ({
    service: typeof search.service === "string" ? search.service : undefined,
  }),
  loader: () => getGoogleReviews(),
  head: () => ({
    meta: [
      { title: "Request a Quote | Contact Balance Electrical, Taupō" },
      {
        name: "description",
        content:
          "Request a quote from Balance Electrical in Taupō. Send a brief with photos or plans, or call Victoria on 027 916 2077, Monday to Friday, 7:30am to 5:30pm.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "geo.region", content: "NZ-WKO" },
      { name: "geo.placename", content: "Taupo" },
      { property: "og:title", content: "Contact Balance Electrical" },
      {
        property: "og:description",
        content:
          "Tell us about your property and your plans. Speak directly with Victoria about the electrical work your project needs.",
      },
      { property: "og:url", content: `${SITE}/contact` },
      { property: "og:image", content: photos.fountainEntry },
    ],
    links: [{ rel: "canonical", href: `${SITE}/contact` }],
    scripts: [
      jsonLd([
        {
          "@type": "ContactPage",
          "@id": `${SITE}/contact#page`,
          url: `${SITE}/contact`,
          name: "Contact Balance Electrical",
          inLanguage: "en-NZ",
          isPartOf: websiteRef,
          about: businessRef,
          mainEntity: businessRef,
        },
      ]),
    ],
  }),
  component: Contact,
});

const field =
  "h-12 rounded-none border-0 border-b border-ivory/20 bg-transparent px-0 text-base text-ivory shadow-none placeholder:text-ivory/30 focus-visible:border-glow focus-visible:ring-0 focus-visible:shadow-[0_10px_24px_-18px_rgb(242_200_139/0.9)] transition-[border-color,box-shadow] duration-500";
const labelCls = "eyebrow text-[10px] font-normal text-muted-foreground";

function Contact() {
  const { service } = Route.useSearch();
  const google = Route.useLoaderData();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorReason, setErrorReason] = useState<SendFailure>("rejected");
  // Share of the upload sent, 0–1 (null until it starts).
  const [progress, setProgress] = useState<number | null>(null);
  const [firstName, setFirstName] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [confirmed, setConfirmed] = useState(true);
  const [serviceType, setServiceType] = useState(
    service && PROJECT_TYPES.includes(service) ? service : PROJECT_TYPES[0],
  );

  const [stage, setStage] = useState("");
  const [budget, setBudget] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [preparing, setPreparing] = useState(false);
  const [fileError, setFileError] = useState("");

  const addFiles = async (incoming: File[]) => {
    if (!incoming.length) return;
    setFileError("");
    setPreparing(true);
    const prepared = await Promise.all(incoming.map(prepareUpload));
    setPreparing(false);
    const next = [...files, ...prepared];
    const tooBig = next.filter((f) => f.size > UPLOAD_LIMITS.fileBytes);
    const total = next.reduce((n, f) => n + f.size, 0);
    if (next.length > UPLOAD_LIMITS.files) {
      setFileError(`Up to ${UPLOAD_LIMITS.files} files, please.`);
    } else if (tooBig.length) {
      setFileError(`${tooBig.map((f) => f.name).join(", ")} is over 10 MB.`);
    } else if (total > UPLOAD_LIMITS.totalBytes) {
      setFileError("Those files add up to more than 20 MB — try fewer, or email the rest.");
    } else {
      setFiles(next);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setProgress(null);

    const formData = new FormData(e.currentTarget);
    const get = (k: string) => ((formData.get(k) as string) || "").trim();
    const full_name = get("name");
    const email = get("email");

    setFirstName(full_name.split(" ")[0]);
    setSentTo(email);

    const body = new FormData();
    body.set("full_name", full_name);
    body.set("email", email);
    body.set("phone", get("phone"));
    body.set("suburb", get("location"));
    body.set("service_type", serviceType);
    body.set("stage", stage);
    body.set("budget", budget);
    body.set("timeframe", timeframe);
    body.set("message", get("message"));
    body.set("website", get("website"));
    files.forEach((f) => body.append("files", f, f.name));

    const result = await sendEnquiry(body, files.length ? setProgress : undefined);
    if (result.ok) {
      setConfirmed(result.confirmation);
      setSent(true);
    } else {
      console.error("Enquiry not sent:", result.reason, result.message ?? "");
      setErrorReason(result.reason);
      setError(true);
    }
    setLoading(false);
  };

  return (
    <SiteLayout>
      <section className="relative mx-auto max-w-[1440px] px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-48">
        <p className="eyebrow text-ink-soft">Contact · Quotes</p>
        <SplitReveal
          as="h1"
          immediate
          delay={0.2}
          className="display-caps mt-6 max-w-5xl text-balance text-[clamp(2rem,5.6vw,5.5rem)] leading-[0.95] tracking-[0.08em]!"
        >
          Tell us what you have in mind.
        </SplitReveal>
        <Reveal delay={0.5}>
          <p className="mt-8 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft">
            Planning a project, need a quote, or need help with an existing property? Share a few
            details below, or contact Victoria directly. She’ll be in touch within a few days to
            discuss what you need and the next steps.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-6 px-5 pb-28 md:px-10 md:pb-40 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            data-night
            className="theme-night relative overflow-hidden border-[8px] border-frame bg-night p-7 text-ivory md:border-[12px] md:p-12"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[80%] -translate-x-1/2"
              style={{
                background:
                  "radial-gradient(50% 60% at 50% 0%, rgb(255 231 194 / 0.14), transparent 75%)",
              }}
            />
            <div className="relative" aria-live="polite">
              {loading && (
                <Status
                  title="Sending your enquiry…"
                  body={
                    !files.length
                      ? "Please wait while we send your details."
                      : progress === null || progress < 1
                        ? `Uploading your ${files.length > 1 ? "files" : "file"}… ${Math.round((progress ?? 0) * 100)}%`
                        : "Upload complete. Sending your details…"
                  }
                  progress={files.length ? (progress ?? 0) : undefined}
                  pulse
                />
              )}
              {error && !loading && (
                <div className="py-14 text-center">
                  <p className="display-caps text-xl leading-snug tracking-[0.08em]!">
                    {errorReason === "stalled"
                      ? "The connection dropped"
                      : errorReason === "unreachable"
                        ? "We couldn’t reach our enquiry service"
                        : "Your enquiry wasn’t sent"}
                  </p>
                  {errorReason === "stalled" && (
                    <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                      Your enquiry may still have arrived. If you receive a confirmation email,
                      there’s no need to send it again.
                    </p>
                  )}
                  <p className="mt-4 text-muted-foreground">
                    Nothing you entered has been lost. Please try again, or call Victoria on{" "}
                    <a href={CONTACT.tel} className="text-ivory underline-offset-4 hover:underline">
                      {CONTACT.phoneLocal}
                    </a>
                    .
                  </p>
                  <Button
                    variant="luxOutline"
                    size="xl"
                    className="mt-8"
                    onClick={() => setError(false)}
                    type="button"
                  >
                    Back to the form
                  </Button>
                </div>
              )}
              {sent ? (
                <Status
                  title={`Thank you${firstName ? `, ${firstName}` : ""}.`}
                  body="We’ve received your enquiry. Victoria will be in touch within a few days to discuss your project."
                  note={
                    confirmed
                      ? `A confirmation email is on its way to ${sentTo}.`
                      : `We couldn't email a confirmation to ${sentTo}, but your enquiry has reached Victoria.`
                  }
                  lit
                />
              ) : (
                <div className={cn((loading || error) && "hidden")}>
                  <p className="eyebrow text-[10px] text-muted-foreground">Project brief</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Fields marked * are required. The more you share — stage, budget, timing, photos
                    or plans — the faster Victoria can give you a realistic idea of cost.
                  </p>
                  {/* Honeypot: hidden from people, filled in by bots, ignored by the server. */}
                  <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                    <label htmlFor="website">Website</label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  <div className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2">
                    <Field label="Your name" name="name" required autoComplete="name" />
                    <Field
                      label="Email address"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                    />
                    <Field
                      label="Phone number (optional)"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                    />
                    <Field
                      label="Project location (optional)"
                      name="location"
                      placeholder="Town or suburb"
                    />
                  </div>
                  <div className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2">
                    <Choice
                      id="type"
                      label="How can we help?"
                      value={serviceType}
                      onChange={setServiceType}
                      options={PROJECT_TYPES}
                    />
                    <Choice
                      id="stage"
                      label="Where is the project up to?"
                      value={stage}
                      onChange={setStage}
                      options={STAGES}
                      placeholder="Plans, framing, renovating…"
                    />
                    <Choice
                      id="budget"
                      label="Budget for the electrical work"
                      value={budget}
                      onChange={setBudget}
                      options={BUDGETS}
                      placeholder="A rough range is fine"
                    />
                    <Choice
                      id="timeframe"
                      label="Timeframe"
                      value={timeframe}
                      onChange={setTimeframe}
                      options={TIMEFRAMES}
                      placeholder="When are you hoping to start?"
                    />
                  </div>
                  <div className="mt-8 space-y-2">
                    <Label htmlFor="message" className={labelCls}>
                      Project details <span className="text-glow">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      placeholder="What work do you need, and when are you hoping to start? Let us know if you’re working with a builder or designer."
                      className={cn(field, "min-h-32 resize-none py-3")}
                    />
                  </div>
                  <FileDrop
                    files={files}
                    preparing={preparing}
                    error={fileError}
                    onAdd={addFiles}
                    onRemove={(i) => setFiles(files.filter((_, j) => j !== i))}
                  />
                  <Button
                    type="submit"
                    variant="lux"
                    size="xl"
                    className="mt-10 w-full sm:w-auto"
                    disabled={preparing}
                  >
                    Send enquiry <ArrowRight />
                  </Button>
                </div>
              )}
            </div>
          </form>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5">
          <aside className="flex h-full flex-col border-[8px] border-frame p-7 md:border-[12px] md:p-12">
            <p className="eyebrow text-ink-soft">Speak with Victoria</p>
            <a
              href={CONTACT.tel}
              data-cursor="Call"
              className="mt-5 flex items-center gap-4 font-display text-[clamp(2rem,3.6vw,3rem)] leading-none"
            >
              <Phone className="size-5 shrink-0" strokeWidth={1.25} />
              {CONTACT.phoneLocal}
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="beam-link mt-5 self-start break-all text-ink-soft hover:text-ink"
            >
              {CONTACT.email}
            </a>

            <div className="my-10 h-px w-1/2 bg-ink/30" />
            <dl className="space-y-8">
              <div>
                <dt className="eyebrow text-[10px] text-ink-soft">Working across</dt>
                <dd className="mt-2 leading-relaxed">
                  Taupō · Kinloch · Acacia Bay · Wairakei · Kuratau · Tūrangi · Ātiamuri · the wider
                  Taupō district
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-[10px] text-ink-soft">What happens next</dt>
                <dd className="mt-2 leading-relaxed">
                  Victoria will review your enquiry and reply within a few days. If a site visit is
                  needed, she’ll arrange a time with you.
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-[10px] text-ink-soft">Business hours</dt>
                <dd className="mt-2 leading-relaxed">Monday – Friday · 7:30am – 5:30pm</dd>
              </div>
            </dl>
            <div className="mt-auto pt-10">
              <EwrbLogo tone="dark" className="h-14" />
            </div>
          </aside>
        </Reveal>
      </section>

      <Testimonials google={google} limit={3} className="pb-28 md:pb-40" />
    </SiteLayout>
  );
}

function Status({
  title,
  body,
  note,
  pulse,
  lit,
  progress,
}: {
  title: string;
  body: string;
  note?: string;
  pulse?: boolean;
  lit?: boolean;
  /** Upload progress, 0–1, shown as an LED line under the message */
  progress?: number;
}) {
  return (
    <div className="py-16 text-center">
      <span
        aria-hidden
        className={cn(
          "mx-auto block size-3 rounded-full bg-glow-soft shadow-[0_0_24px_6px_rgb(255_231_194/0.8)]",
          pulse && "animate-pulse",
          lit && "size-4 shadow-[0_0_60px_18px_rgb(255_231_194/0.6)]",
        )}
      />
      <p className="display-caps mt-10 break-words text-2xl leading-snug tracking-[0.08em]! text-ivory">
        {title}
      </p>
      <p className="mx-auto mt-4 max-w-md text-muted-foreground">{body}</p>
      {progress !== undefined && (
        <div
          role="progressbar"
          aria-label="Upload progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          className="mx-auto mt-6 h-px max-w-xs bg-ivory/10"
        >
          <div
            className="h-full origin-left bg-glow-soft shadow-[0_0_10px_rgb(242_200_139/0.6)] transition-transform duration-300"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      )}
      {note && <p className="mx-auto mt-3 max-w-md text-sm text-ivory/60">{note}</p>}
      {lit && (
        <a
          href={CONTACT.tel}
          className="mt-6 inline-block font-display text-2xl text-ivory hover:text-glow-soft"
        >
          {CONTACT.phoneLocal}
        </a>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className={labelCls}>
        {label}
        {required && <span className="text-glow"> *</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={field}
      />
    </div>
  );
}

function Choice({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={labelCls}>
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          className={cn(field, "[&>svg]:opacity-60 data-[placeholder]:text-ivory/30")}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          data-lenis-prevent
          className="rounded-none border-ink/15 bg-stone-lit text-ink"
        >
          {options.map((t) => (
            <SelectItem key={t} value={t} className="rounded-none py-2.5 focus:bg-stone-pale">
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/** Photos of the site, or plans: dropped in or picked, then listed with a remove button. */
function FileDrop({
  files,
  preparing,
  error,
  onAdd,
  onRemove,
}: {
  files: File[];
  preparing: boolean;
  error: string;
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    onAdd(Array.from(e.dataTransfer.files));
  };
  return (
    <div className="mt-8 space-y-3">
      <p className={labelCls}>Photos or plans</p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-start gap-3 border border-dashed px-5 py-5 transition-[border-color,box-shadow] duration-500 sm:flex-row sm:items-center sm:justify-between",
          over ? "border-glow/70 shadow-[0_0_30px_-12px_rgb(242_200_139/0.8)]" : "border-ivory/20",
        )}
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          Drag in site photos or plans, or{" "}
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="text-ivory underline underline-offset-4 hover:text-glow-soft"
          >
            browse
          </button>
          .
          <span className="block text-xs text-ivory/40">
            JPG, PNG, HEIC or PDF · up to {UPLOAD_LIMITS.files} files · photos are resized for you
          </span>
        </p>
        <Paperclip className="hidden size-5 shrink-0 text-ivory/40 sm:block" strokeWidth={1.25} />
        <input
          ref={input}
          type="file"
          multiple
          accept={UPLOAD_ACCEPT}
          className="sr-only"
          aria-label="Add photos or plans"
          onChange={(e) => {
            onAdd(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
      </div>
      {preparing && <p className="text-xs text-ivory/60">Preparing photos…</p>}
      {error && (
        <p role="alert" className="text-xs text-glow-soft">
          {error}
        </p>
      )}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center justify-between gap-4 border-b border-ivory/10 pb-2 text-sm"
            >
              <span className="min-w-0 truncate text-ivory/85">{f.name}</span>
              <span className="flex shrink-0 items-center gap-3 text-xs text-ivory/45">
                {formatBytes(f.size)}
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  aria-label={`Remove ${f.name}`}
                  className="text-ivory/60 hover:text-ivory"
                >
                  <X className="size-4" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
