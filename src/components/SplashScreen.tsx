import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LOGO_SRC = "/logo+.png";
const MIN_DISPLAY_MS = 1200;
const MAX_WAIT_MS = 4000;
const FADE_OUT_DURATION = 0.5;

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let maxTimer: ReturnType<typeof setTimeout>;
    const finish = () => {
      if (cancelled) return;
      cancelled = true;
      clearTimeout(maxTimer);
      setIsExiting(true);
    };

    maxTimer = setTimeout(finish, MAX_WAIT_MS);

    const minTime = new Promise<void>((r) => setTimeout(r, MIN_DISPLAY_MS));
    const logoReady = preloadImage(LOGO_SRC);
    const fontsReady = document.fonts?.ready ?? Promise.resolve();

    Promise.all([minTime, logoReady, fontsReady]).then(finish);

    return () => {
      cancelled = true;
      clearTimeout(maxTimer);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-cream)]"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: FADE_OUT_DURATION, ease: [0.4, 0, 0.2, 1] }}
      onAnimationComplete={() => {
        if (isExiting) onComplete();
      }}
    >
      <div className="flex flex-col items-center gap-8">
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 0.61, 0.36, 1],
          }}
        >
          <img
            src={LOGO_SRC}
            alt="Sultan Kunafa"
            className="h-44 w-44 object-contain sm:h-56 sm:w-56 md:h-72 md:w-72 lg:h-80 lg:w-80 xl:h-96 xl:w-96"
            width={384}
            height={384}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
        </motion.div>

        <motion.div
          className="h-1 w-40 overflow-hidden rounded-full bg-white/10 sm:w-52 md:w-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <motion.div
            className="h-full bg-gold"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 1.8,
              delay: 0.5,
              ease: [0.22, 0.61, 0.36, 1],
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
