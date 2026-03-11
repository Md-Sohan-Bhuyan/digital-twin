import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import useToastStore from '../../store/useToastStore';

const iconByType = {
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
  info: Info,
};

const styleByType = {
  success: 'border-green-500/40 bg-green-500/10 text-green-200',
  warning: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-200',
  error: 'border-red-500/40 bg-red-500/10 text-red-200',
  info: 'border-blue-500/40 bg-blue-500/10 text-blue-200',
};

function ToastViewport() {
  const { toasts, dismissToast } = useToastStore();

  return (
    <div className="fixed right-4 top-4 z-[100] w-[min(420px,calc(100vw-2rem))] space-y-3">
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const Icon = iconByType[t.type] || Info;
          const style = styleByType[t.type] || styleByType.info;

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className={`backdrop-blur-xl border rounded-xl shadow-2xl ${style}`}
            >
              <div className="p-4 flex gap-3">
                <div className="mt-0.5">
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  {t.title ? (
                    <div className="text-sm font-semibold text-white">{t.title}</div>
                  ) : null}
                  {t.message ? (
                    <div className="text-xs text-gray-200/80 mt-1 leading-relaxed">{t.message}</div>
                  ) : null}

                  {t.actionLabel && typeof t.onAction === 'function' ? (
                    <button
                      onClick={() => {
                        try {
                          t.onAction();
                        } finally {
                          dismissToast(t.id);
                        }
                      }}
                      className="mt-3 inline-flex items-center text-xs font-semibold text-white/90 hover:text-white underline underline-offset-4"
                    >
                      {t.actionLabel}
                    </button>
                  ) : null}
                </div>
                <button
                  onClick={() => dismissToast(t.id)}
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="Dismiss toast"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default ToastViewport;

