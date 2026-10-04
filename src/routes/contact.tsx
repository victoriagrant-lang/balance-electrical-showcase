import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { CONTACT } from "@/lib/contact";
import { supabase } from "@/integrations/supabase/client";
import { photos } from "@/lib/photos";
import { cn } from "@/lib/utils";
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
  "Solar & battery storage",
  "Air-Conditioning",
  "EV charging",
  "Commercial fit-out",
  "Pool & spa wiring",
  "Pre-purchase report",
  "Something else",
];

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): { service?: string } => ({
    service: typeof search.service === "string" ? search.service : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Contact Victoria | Electrician Taupō | Balance Electrical" },
      {
        name: "description",
        content:
          "Contact Victoria Grant at Balance Electrical to discuss electrical work, lighting, air-conditioning or solar for your home or business in the Taupō district.",
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
      { property: "og:image", content: photos.fountainEntry },
    ],
    links: [{ rel: "canonical", href: "https://www.balanceelectrical.co.nz/contact" }],
  }),
  component: Contact,
});

const field =
  "h-12 rounded-none border-0 border-b border-ivory/20 bg-transparent px-0 text-base text-ivory shadow-none placeholder:text-ivory/30 focus-visible:border-glow focus-visible:ring-0 focus-visible:shadow-[0_10px_24px_-18px_rgb(242_200_139/0.9)] transition-[border-color,box-shadow] duration-500";
const labelCls = "eyebrow text-[10px] font-normal text-muted-foreground";

function Contact() {
  const { service } = Route.useSearch();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [confirmed, setConfirmed] = useState(true);
  const [serviceType, setServiceType] = useState(
    service && PROJECT_TYPES.includes(service) ? service : PROJECT_TYPES[0],
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const formData = new FormData(e.currentTarget);
    const get = (k: string) => ((formData.get(k) as string) || "").trim();
    const full_name = get("name");
    const phone = get("phone");
    const email = get("email");
    const suburb = get("location");
    const service_type = serviceType;
    const message = get("message");
    const website = get("website");

    setFirstName(full_name.split(" ")[0]);
    setSentTo(email);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke<{
        success: boolean;
        confirmation?: boolean;
      }>("send-balance-enquiry", {
        body: { full_name, phone, email, suburb, service_type, message, website },
      });

      if (invokeError) {
        console.error("Edge function error:", invokeError);
        setError(true);
        setLoading(false);
        return;
      }

      setConfirmed(data?.confirmation !== false);
      setSent(true);
    } catch (err) {
      console.error("Submission error:", err);
      setError(true);
    }

    setLoading(false);
  };

  return (
    <SiteLayout>
      <section className="relative mx-auto max-w-[1440px] px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-48">
        <p className="eyebrow text-ink-soft">Contact</p>
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
            Planning a project or need help with an existing property? Share a few details below, or
            contact Victoria directly. She’ll be in touch within a few days to discuss what you need
            and the next steps.
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
              {loading ? (
                <Status
                  title="Sending your enquiry…"
                  body="Please wait while we send your details."
                  pulse
                />
              ) : error ? (
                <div className="py-14 text-center">
                  <p className="display-caps text-xl leading-snug tracking-[0.08em]!">
                    Your enquiry wasn’t sent
                  </p>
                  <p className="mt-4 text-muted-foreground">
                    Please try again, or call Victoria on{" "}
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
                    Try again
                  </Button>
                </div>
              ) : sent ? (
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
                <>
                  <p className="eyebrow text-[10px] text-muted-foreground">
                    Tell us about your project
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Fields marked * are required. A brief outline is enough to get started.
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
                  <div className="mt-8 space-y-2">
                    <Label htmlFor="type" className={labelCls}>
                      How can we help?
                    </Label>
                    <Select value={serviceType} onValueChange={setServiceType}>
                      <SelectTrigger id="type" className={cn(field, "[&>svg]:opacity-60")}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent
                        data-lenis-prevent
                        className="rounded-none border-ink/15 bg-stone-lit text-ink"
                      >
                        {PROJECT_TYPES.map((t) => (
                          <SelectItem
                            key={t}
                            value={t}
                            className="rounded-none py-2.5 focus:bg-stone-pale"
                          >
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <Button type="submit" variant="lux" size="xl" className="mt-10 w-full sm:w-auto">
                    Send enquiry <ArrowRight />
                  </Button>
                </>
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
    </SiteLayout>
  );
}

function Status({
  title,
  body,
  note,
  pulse,
  lit,
}: {
  title: string;
  body: string;
  note?: string;
  pulse?: boolean;
  lit?: boolean;
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
