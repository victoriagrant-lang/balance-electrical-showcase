import { useRef, type ElementType, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { BalanceWordmark } from "@/components/brand/BrandName";
import { gsap, SplitText, prefersReducedMotion, useGSAP } from "@/lib/gsap";

type RevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  y?: number;
  /** Stagger direct children instead of revealing the wrapper as one block */
  stagger?: number;
};

/** Fades and lifts content in as it enters the viewport. */
export function Reveal({
  as: Tag = "div",
  children,
  className,
  style,
  delay = 0,
  y = 36,
  stagger,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const targets = stagger ? Array.from(el.children) : el;
      gsap.from(targets, {
        autoAlpha: 0,
        y,
        duration: 1.3,
        delay,
        stagger: stagger ?? 0,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}

type SplitRevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  /** Start immediately (for above-the-fold headings) instead of on scroll */
  immediate?: boolean;
};

/** Headline lines rise out of a mask, one after another. */
export function SplitReveal({
  as: Tag = "h2",
  children,
  className,
  id,
  delay = 0,
  immediate = false,
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.4,
            delay,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
          }),
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}

type LightWordsProps = {
  text: string;
  className?: string;
  as?: ElementType;
  /** Night sections: lit words also pick up a warm glow */
  glow?: boolean;
  id?: string;
};

/**
 * Scroll-scrubbed: each word switches on as you read down the paragraph,
 * like a dimmer being turned up across a line of downlights.
 */
export function LightWords({ text, className, as: Tag = "p", glow = false, id }: LightWordsProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const words = el.querySelectorAll("[data-word]");
      gsap.fromTo(
        words,
        { opacity: 0.16, textShadow: "0 0 0px rgba(242,200,139,0)" },
        {
          opacity: 1,
          textShadow: glow ? "0 0 22px rgba(242,200,139,0.45)" : "0 0 0px rgba(242,200,139,0)",
          ease: "none",
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 42%", scrub: 0.6 },
        },
      );
    },
    { scope: ref },
  );

  const words = text.split(" ");
  return (
    <Tag ref={ref} id={id} className={cn(className)} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden
          data-word
          className={cn(
            "inline-block will-change-[opacity]",
            words[i + 1] === "Balance" && words[i + 2]?.startsWith("Electrical") && "pr-[0.4em]",
          )}
        >
          {w === "Balance" && words[i + 1]?.startsWith("Electrical") ? <BalanceWordmark /> : w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
