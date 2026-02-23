import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, visible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [visible, duration, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-24 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2.5 rounded-xl border border-gold/30 bg-[var(--color-cream)] px-4 py-3 shadow-lg shadow-dark/20 rtl:left-auto rtl:right-1/2 rtl:translate-x-1/2"
        >
          <ShoppingBag className="h-5 w-5 shrink-0 text-gold" aria-hidden />
          <span className="text-sm font-medium text-dark">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
