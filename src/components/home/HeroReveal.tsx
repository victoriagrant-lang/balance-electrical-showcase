import { useEffect, useRef, useState, type RefObject } from "react";
import { getPhoto } from "@/lib/portfolio";
import { photos } from "@/lib/photos";
import { onIntroDone } from "@/lib/intro";

/*
  The hero surface: the warm stone of the Balance sign, lit by the pointer like a raking
  light. Moving across it leaves a soft trail that parts the stone — embossed, lit edges
  and all — to reveal the lit room beneath, then slowly settles back.

  How it works: pointer movement paints soft blobs into a small offscreen canvas (the
  "trail"), which fades a little every frame. A WebGL shader reads that trail as a height
  field: where it's high the photograph shows through; its slope shades the stone lip
  against the light. With no WebGL, or reduced motion, a still stone-washed photo stands in.
*/

const FALLBACK_IMAGE = getPhoto("courtyard-house", "02-living-room").lg;

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uPhoto;
uniform sampler2D uTrail;
uniform vec2 uRes;
uniform float uImgAspect;
uniform vec2 uLight;
uniform vec2 uDrift;
uniform float uTime;
uniform float uFade;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

vec2 cover(vec2 uv) {
  float view = uRes.x / uRes.y;
  vec2 s = view > uImgAspect ? vec2(1.0, uImgAspect / view) : vec2(view / uImgAspect, 1.0);
  return (uv - 0.5) * s / 1.04 + 0.5 + uDrift;
}

float trail(vec2 uv) { return texture2D(uTrail, uv).a; }

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;

  // Organic edges: look the trail up through a slowly moving noise warp.
  vec2 warp = vec2(fbm(uv * 3.5 + uTime * 0.035), fbm(uv * 3.5 + 7.3 - uTime * 0.03)) - 0.5;
  vec2 tuv = uv + warp * 0.035;
  vec2 e = vec2(1.6 / 220.0, 1.6 / 220.0 * aspect);
  float h = trail(tuv);
  float hx = trail(tuv + vec2(e.x, 0.0)) - trail(tuv - vec2(e.x, 0.0));
  float hy = trail(tuv + vec2(0.0, e.y)) - trail(tuv - vec2(0.0, e.y));
  float grain = fbm(uv * vec2(aspect, 1.0) * 9.0);
  float reveal = smoothstep(0.2, 0.62, h + (grain - 0.5) * 0.22);

  // Raking light from the pointer, a little above the surface.
  vec3 p = vec3(uv.x * aspect, uv.y, 0.0);
  vec3 L = normalize(vec3(uLight.x * aspect, uLight.y, 0.32) - p);
  vec3 n = normalize(vec3(-hx * 6.0, -hy * 6.0, 1.0));
  float diff = clamp(dot(n, L), 0.0, 1.0);
  float d = distance(p.xy, vec2(uLight.x * aspect, uLight.y));
  float pool = exp(-d * d * 5.5);
  float slope = clamp(length(vec2(hx, hy)) * 7.0, 0.0, 1.0);

  vec3 photo = texture2D(uPhoto, cover(uv)).rgb;
  float lum = dot(photo, vec3(0.299, 0.587, 0.114));

  // Stone: the sign's warm panel, mottled and grained, the room a faint ghost beneath.
  vec3 stoneA = vec3(0.842, 0.794, 0.741);
  vec3 stoneB = vec3(0.760, 0.703, 0.645);
  vec3 stone = mix(stoneA, stoneB, smoothstep(0.35, 0.75, fbm(uv * vec2(aspect, 1.0) * 2.2 + 3.1)));
  stone += (hash(uv * uRes + fract(uTime)) - 0.5) * 0.028 + (grain - 0.5) * 0.05;
  stone = mix(stone, stone * (0.7 + lum * 0.42), 0.16);
  vec3 warm = vec3(1.0, 0.86, 0.66);
  vec3 stoneLit = stone * (0.93 + 0.14 * pool) + warm * 0.045 * pool;
  stoneLit *= mix(1.0, 0.8 + 0.42 * diff, slope);

  // The room: shaded where the stone lip overhangs it, warmed by the light.
  vec3 room = photo * (1.0 + 0.14 * pool);
  room *= mix(0.62, 1.0, smoothstep(0.25, 0.75, h));

  float rim = smoothstep(0.0, 0.35, reveal) * (1.0 - smoothstep(0.55, 1.0, reveal));
  vec3 col = mix(stoneLit, room, reveal) + vec3(1.0, 0.91, 0.76) * rim * 0.12 * (0.4 + pool);

  gl_FragColor = vec4(col, uFade);
}
`;

type Splat = { x: number; y: number; r: number; a: number };

export function HeroReveal({ host }: { host: RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = host.current;
    if (!canvas || !section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(sh) ?? "");
      return sh;
    };
    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    } catch {
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(prog, name);
    const uRes = u("uRes");
    const uImgAspect = u("uImgAspect");
    const uLight = u("uLight");
    const uDrift = u("uDrift");
    const uTime = u("uTime");
    const uFade = u("uFade");
    gl.uniform1i(u("uPhoto"), 0);
    gl.uniform1i(u("uTrail"), 1);

    const makeTexture = (unit: number) => {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    };
    const photoTex = makeTexture(0);
    const trailTex = makeTexture(1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // The trail: a small canvas, so painting and fading it each frame is nearly free.
    const trail = document.createElement("canvas");
    const tctx = trail.getContext("2d")!;
    let width = 1;
    let height = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      trail.width = 220;
      trail.height = Math.max(1, Math.round((220 * height) / width));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, width, height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const splats: Splat[] = [];
    const paint = ({ x, y, r, a }: Splat) => {
      const px = x * trail.width;
      const py = (1 - y) * trail.height;
      const rp = r * trail.width;
      const g = tctx.createRadialGradient(px, py, 0, px, py, rp);
      g.addColorStop(0, `rgba(255,255,255,${a})`);
      g.addColorStop(0.55, `rgba(255,255,255,${a * 0.45})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      tctx.fillStyle = g;
      tctx.fillRect(px - rp, py - rp, rp * 2, rp * 2);
    };

    // Pointer: positions in 0..1 (y up), with the light easing towards them.
    const pointer = { x: 0.5, y: 0.55, has: false, last: 0 };
    const light = { x: 0.5, y: 0.6 };
    let prev: { x: number; y: number } | null = null;
    // Trace a pointer or finger position (client coordinates) into the trail.
    const trace = (clientX: number, clientY: number, boost = 1) => {
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = 1 - (clientY - rect.top) / rect.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      pointer.x = x;
      pointer.y = y;
      pointer.has = true;
      pointer.last = performance.now();
      if (prev) {
        const dx = (x - prev.x) * (width / height);
        const dy = y - prev.y;
        const dist = Math.hypot(dx, dy);
        const steps = Math.min(24, Math.ceil(dist / 0.012));
        const speed = Math.min(1, dist * 14);
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          splats.push({
            x: prev.x + (x - prev.x) * t,
            y: prev.y + (y - prev.y) * t,
            r: (0.07 + speed * 0.06) * boost,
            a: 0.16 + speed * 0.1,
          });
        }
      }
      prev = { x, y };
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || e.pointerType === "pen") trace(e.clientX, e.clientY);
    };
    const onLeave = () => {
      prev = null;
    };
    // Touch: a finger dragged across the hero paints the trail, wider than a cursor.
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) trace(t.clientX, t.clientY, 2.2);
    };
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    section.addEventListener("touchmove", onTouch, { passive: true });
    section.addEventListener("touchend", onLeave);

    // Scrolling: a beam of light sweeps an S through the hero as it leaves the screen,
    // so phones (no cursor) and trackpad-scrollers both see the room uncovered.
    let sweep = 0;
    const sweepAt = (k: number) => ({
      x: 0.5 + Math.sin(k * 5.4) * 0.34,
      y: 0.86 - k * 0.8,
    });
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, -rect.top / (rect.height * 0.7)));
      if (k <= sweep + 0.002) return;
      const narrow = width < 768;
      const steps = Math.min(30, Math.ceil((k - sweep) / 0.008));
      for (let i = 1; i <= steps; i++) {
        const at = sweepAt(sweep + ((k - sweep) * i) / steps);
        splats.push({ x: at.x, y: at.y, r: narrow ? 0.26 : 0.13, a: 0.2 });
      }
      const head = sweepAt(k);
      pointer.x = head.x;
      pointer.y = head.y;
      pointer.has = true;
      pointer.last = performance.now();
      sweep = k;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // A first pass of light across the headline once the preloader lifts.
    let introStart = -1;
    const offIntro = onIntroDone(() => {
      introStart = performance.now();
    });

    let raf = 0;
    let running = false;
    let fade = 0;
    let ready = false;
    const t0 = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const t = (now - t0) / 1000;

      // Settle: fade the whole trail a touch each frame.
      tctx.globalCompositeOperation = "destination-out";
      tctx.fillStyle = "rgba(0,0,0,0.018)";
      tctx.fillRect(0, 0, trail.width, trail.height);
      tctx.globalCompositeOperation = "lighter";

      if (introStart > 0) {
        const k = (now - introStart) / 2600;
        if (k <= 1) {
          const ease = 1 - Math.pow(1 - k, 3);
          splats.push({
            x: 0.08 + ease * 0.7,
            y: 0.5 + Math.sin(ease * 3.1) * 0.08,
            r: 0.12,
            a: 0.2,
          });
        } else introStart = -1;
      }

      // No pointer for a while (or a touch screen): a slow wandering light keeps it alive.
      const idle = !pointer.has || now - pointer.last > 3500;
      if (idle && introStart < 0) {
        const gx = 0.5 + Math.sin(t * 0.21) * 0.32 + Math.sin(t * 0.07) * 0.08;
        const gy = 0.5 + Math.sin(t * 0.17 + 1.3) * 0.22;
        light.x += (gx - light.x) * 0.02;
        light.y += (gy - light.y) * 0.02;
        // Narrow (touch) screens get a broader, brighter wandering light.
        const narrow = width < 768;
        if (Math.floor(now / 70) % 2 === 0) {
          splats.push({
            x: light.x,
            y: light.y,
            r: narrow ? 0.24 : 0.11,
            a: narrow ? 0.085 : 0.05,
          });
        }
      } else {
        light.x += (pointer.x - light.x) * 0.12;
        light.y += (pointer.y - light.y) * 0.12;
      }

      while (splats.length) paint(splats.shift()!);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, trailTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, trail);

      if (ready) fade = Math.min(1, fade + 0.03);
      gl.uniform2f(uLight, light.x, light.y);
      gl.uniform2f(uDrift, (light.x - 0.5) * -0.012, (light.y - 0.5) * -0.012);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uFade, fade);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const start = () => {
      if (running || !ready) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Only animate while the hero is on screen and the tab is visible.
    let onScreen = true;
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen && !document.hidden) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : onScreen && start());
    document.addEventListener("visibilitychange", onVisibility);

    // Load the photograph (Supabase original, or the bundled copy if that fails).
    let disposed = false;
    const load = (src: string, crossOrigin: boolean, onFail: () => void) => {
      const img = new Image();
      if (crossOrigin) img.crossOrigin = "anonymous";
      img.decoding = "async";
      img.onload = () => {
        if (disposed) return;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, photoTex);
        try {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        } catch {
          onFail();
          return;
        }
        gl.uniform1f(uImgAspect, img.naturalWidth / img.naturalHeight);
        ready = true;
        setLive(true);
        if (onScreen) start();
      };
      img.onerror = onFail;
      img.src = src;
    };
    load(photos.home, true, () => load(FALLBACK_IMAGE, false, () => {}));

    return () => {
      disposed = true;
      stop();
      offIntro();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      section.removeEventListener("touchmove", onTouch);
      section.removeEventListener("touchend", onLeave);
      window.removeEventListener("scroll", onScroll);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [host]);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-stone-pale">
      {/* Still version: shown first, and kept if WebGL or motion isn't available. */}
      <img
        src={photos.home}
        alt=""
        fetchPriority="high"
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMAGE;
        }}
        className="absolute inset-0 h-full w-full scale-[1.04] object-cover opacity-45 mix-blend-multiply saturate-[0.75]"
      />
      <div className="absolute inset-0 bg-stone-pale/55" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-1000"
        style={{ opacity: live ? 1 : 0 }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(28,29,31,0.16))]" />
    </div>
  );
}
