import { create } from 'zustand';

const MAX_TOASTS = 4;

const useToastStore = create((set) => ({
  toasts: [],

  pushToast: (toast) => {
    const id = toast?.id || `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const next = {
      id,
      type: toast?.type || 'info', // info | success | warning | error
      title: toast?.title || '',
      message: toast?.message || '',
      durationMs: toast?.durationMs ?? 3500,
      createdAt: Date.now(),
      actionLabel: toast?.actionLabel,
      onAction: toast?.onAction,
    };

    set((prev) => ({
      toasts: [next, ...prev.toasts].slice(0, MAX_TOASTS),
    }));

    if (next.durationMs !== Infinity) {
      setTimeout(() => {
        useToastStore.getState().dismissToast(id);
      }, next.durationMs);
    }

    return id;
  },

  dismissToast: (id) => {
    set((prev) => ({ toasts: prev.toasts.filter((t) => t.id !== id) }));
  },

  clearToasts: () => set({ toasts: [] }),
}));

export default useToastStore;

