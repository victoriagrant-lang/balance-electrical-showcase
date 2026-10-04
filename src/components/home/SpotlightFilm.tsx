import { useEffect, useRef, useState, type RefObject } from "react";
import { Pause, Play } from "lucide-react";
import { gsap } from "@/lib/gsap";

const MEDIA = "/media/house-spotlight";

/** The poster stays underneath the film, including when playback is unavailable. */
export function SpotlightFilm({ host }: { host: RefObject<HTMLElement | null> }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const section = host.current;
    if (!video || !section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    let inView = false;
    let disposed = false;

    const sync = () => {
      if (disposed) return;
      const allowMotion = !reduced.matches && !connection?.saveData;
      setEnabled(allowMotion);
      if (!allowMotion || paused || !inView || document.hidden) {
        video.pause();
        return;
      }
      const src = `${MEDIA}-${mobile.matches ? "mobile" : "desktop"}.mp4`;
      if (video.getAttribute("src") !== src) {
        setReady(false);
        video.src = src;
        video.load();
      }
      video.muted = true;
      void video
        .play()
        .then(() => {
          if (disposed) return;
          if (!inView || document.hidden || reduced.matches) video.pause();
        })
        .catch(() => {
          // Autoplay can be blocked; the poster and explicit play control remain available.
        });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0.05 },
    );
    observer.observe(section);
    reduced.addEventListener("change", sync);
    mobile.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      disposed = true;
      observer.disconnect();
      reduced.removeEventListener("change", sync);
      mobile.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, [host, paused]);

  useEffect(() => {
    const section = host.current;
    const veil = veilRef.current;
    if (!section || !veil) return;
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        let tracking = false;
        const centre = () => {
          if (tracking) return;
          gsap.set(veil, {
            "--spot-x": section.clientWidth * 0.7,
            "--spot-y": section.clientHeight * 0.52,
          });
        };
        centre();
        const resize = new ResizeObserver(centre);
        resize.observe(section);
        const x = gsap.quickTo(veil, "--spot-x", { duration: 0.65, ease: "power3.out" });
        const y = gsap.quickTo(veil, "--spot-y", { duration: 0.65, ease: "power3.out" });
        const move = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          const rect = section.getBoundingClientRect();
          x(event.clientX - rect.left);
          y(event.clientY - rect.top);
          if (!tracking) {
            tracking = true;
            gsap.to(veil, {
              "--spot-dark": 0.12,
              "--spot-radius": 380,
              duration: 0.85,
              ease: "power2.out",
            });
          }
        };
        const leave = () => {
          tracking = false;
          gsap.to(veil, {
            "--spot-dark": 0.82,
            "--spot-radius": 260,
            duration: 0.9,
            ease: "power2.out",
          });
        };
        section.addEventListener("pointermove", move, { passive: true });
        section.addEventListener("pointerleave", leave);
        return () => {
          resize.disconnect();
          section.removeEventListener("pointermove", move);
          section.removeEventListener("pointerleave", leave);
          x.tween.kill();
          y.tween.kill();
          gsap.killTweensOf(veil);
        };
      },
    );
    return () => mm.revert();
  }, [host]);

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <picture>
          <source media="(max-width: 767px)" srcSet={`${MEDIA}-mobile.webp`} />
          <img
            src={`${MEDIA}-desktop.webp`}
            alt=""
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          onLoadedData={() => setReady(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => {
            setReady(false);
            setPlaying(false);
          }}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
          style={{ opacity: ready ? 1 : 0 }}
        />
        <div ref={veilRef} className="hero-film-veil absolute inset-0" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,12,11,0.65),transparent_32%,rgba(10,12,11,0.25)_58%,rgba(10,12,11,0.85))]" />
      </div>
      {enabled && (
        <button
          type="button"
          onClick={() => {
            setPaused(playing);
            if (!playing) void videoRef.current?.play().catch(() => {});
          }}
          className="absolute right-5 top-20 z-20 inline-flex min-h-11 items-center gap-2 rounded-full border border-ivory/25 bg-night/70 px-4 text-xs text-ivory backdrop-blur-sm transition-colors hover:border-glow/70 hover:text-glow-soft md:right-10 md:top-24"
          aria-label={playing ? "Pause background video" : "Play background video"}
        >
          {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          {playing ? "Pause film" : "Play film"}
        </button>
      )}
    </>
  );
}
