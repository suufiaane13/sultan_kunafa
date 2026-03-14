/**
 * Avatar animé à partir d’une séquence de frames (ex. avatar-soufiane).
 * Utilise un canvas : on ne dessine qu’une frame déjà chargée → pas de clignotement.
 * Respecte prefers-reduced-motion.
 */

import { useEffect, useRef } from "react";

const FRAME_COUNT = 151;
const FRAME_STEP = 3;
const FPS = 20;
const PRELOAD_COUNT = 15;

function getFrameUrl(index: number): string {
  const n = Math.max(1, Math.min(FRAME_COUNT, index));
  const num = String(n).padStart(4, "0");
  const sec = ((n - 1) / 30).toFixed(2);
  return `/avatars/avatar-soufiane/frame_${num}_${sec}s.webp`;
}

const FRAME_INDICES = Array.from(
  { length: Math.ceil(FRAME_COUNT / FRAME_STEP) },
  (_, i) => i * FRAME_STEP + 1
).filter((i) => i <= FRAME_COUNT);

interface AnimatedAvatarProps {
  staticSrc: string;
  staticWebp?: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
}

export function AnimatedAvatar({
  staticSrc,
  staticWebp,
  alt = "",
  className = "",
  width = 96,
  height = 96,
  onLoad,
}: AnimatedAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onLoadCalledRef = useRef(false);

  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const targetIndexRef = useRef(0);
  const drawnIndexRef = useRef(-1);
  const rafRef = useRef<number>(0);
  const lastTickRef = useRef(0);

  // Frames désactivées pour l’instant : on n’affiche que la photo statique
  const useAnimation = false;

  // Précharger les premières frames (inactif tant que useAnimation = false)
  useEffect(() => {
    if (!useAnimation) return;
    const cache = cacheRef.current;
    for (let i = 0; i < Math.min(PRELOAD_COUNT, FRAME_INDICES.length); i++) {
      if (cache.has(i)) continue;
      const img = new Image();
      img.src = getFrameUrl(FRAME_INDICES[i]);
      img.decode().then(() => {
        cache.set(i, img);
      }).catch(() => {});
    }
  }, [useAnimation]);

  // Boucle d’animation : avancer targetIndex à FPS
  useEffect(() => {
    if (!useAnimation) return;
    const interval = 1000 / FPS;
    const tick = (now: number) => {
      lastTickRef.current = lastTickRef.current || now;
      const delta = now - lastTickRef.current;
      if (delta >= interval) {
        lastTickRef.current = now;
        targetIndexRef.current = (targetIndexRef.current + 1) % FRAME_INDICES.length;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [useAnimation]);

  // Ajuster la taille du canvas au conteneur (retina), y compris après layout
  useEffect(() => {
    if (!useAnimation || !canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const dpr = window.devicePixelRatio || 1;
    const applySize = () => {
      const cw = container.clientWidth || width;
      const ch = container.clientHeight || height;
      if (cw && ch) {
        canvas.width = Math.round(cw * dpr);
        canvas.height = Math.round(ch * dpr);
        canvas.style.width = `${cw}px`;
        canvas.style.height = `${ch}px`;
      }
    };
    applySize();
    const ro = new ResizeObserver(applySize);
    ro.observe(container);
    return () => ro.disconnect();
  }, [useAnimation, width, height]);

  // Boucle de dessin : dessiner uniquement quand la frame est en cache → fluide, pas de clignotement
  useEffect(() => {
    if (!useAnimation || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    let rafId: number;
    const drawLoop = () => {
      const w = canvas.width;
      const h = canvas.height;
      const target = targetIndexRef.current;
      const cached = cacheRef.current.get(target);
      if (cached && cached.complete && drawnIndexRef.current !== target) {
        ctx.drawImage(cached, 0, 0, w, h);
        drawnIndexRef.current = target;
        if (!onLoadCalledRef.current) {
          onLoadCalledRef.current = true;
          onLoad?.();
        }
        for (let k = 1; k <= 5; k++) {
          const next = (target + k) % FRAME_INDICES.length;
          if (cacheRef.current.has(next)) continue;
          const img = new Image();
          img.src = getFrameUrl(FRAME_INDICES[next]);
          img.decode().then(() => {
            cacheRef.current.set(next, img);
          }).catch(() => {});
        }
      }
      rafId = requestAnimationFrame(drawLoop);
    };
    rafId = requestAnimationFrame(drawLoop);
    return () => cancelAnimationFrame(rafId);
  }, [useAnimation, onLoad]);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      {useAnimation ? (
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className={`${className} block h-full w-full object-cover object-center`}
          style={{ width: "100%", height: "100%" }}
          aria-label={alt}
        />
      ) : (
        <picture>
          {staticWebp && <source type="image/webp" srcSet={staticWebp} />}
          <img
            src={staticSrc}
            alt={alt}
            className={className}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            onLoad={onLoad}
          />
        </picture>
      )}
    </div>
  );
}
