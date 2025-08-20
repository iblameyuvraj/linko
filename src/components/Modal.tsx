"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { PropsWithChildren, useEffect } from "react";

type ModalProps = PropsWithChildren<{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
}>;

export default function Modal({ isOpen, onClose, title, className = "" , children }: ModalProps) {
  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Dialog */}
          <motion.div
            className={`relative z-[61] w-[90%] max-w-md rounded-2xl border border-white/15 bg-neutral-950 p-6 shadow-2xl max-h-[85vh] overflow-hidden flex flex-col ${className}`}
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
          >
            <div className="flex items-start justify-between gap-4">
              {title ? (
                <h3 className="text-lg font-semibold text-white">{title}</h3>
              ) : (
                <span className="sr-only">Modal</span>
              )}
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-2 text-white/70 hover:bg-white/5 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mt-4 flex-1 min-h-0 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
