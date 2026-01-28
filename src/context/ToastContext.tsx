"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

type Toast = {
  id: string;
  title: string;
  variant?: "success" | "error" | "info";
};

type ToastContextValue = {
  toasts: Toast[];
  showToast: (title: string, variant?: Toast["variant"]) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, variant: Toast["variant"] = "info") => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, title, variant }]);
      setTimeout(() => removeToast(id), 3200);
    },
    [removeToast],
  );

  const value = useMemo(() => ({ toasts, showToast, removeToast }), [toasts, showToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastShelf toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

function ToastShelf({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
  if (!toasts.length) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-3 px-4">
      {toasts.map((toast) => {
        const color =
          toast.variant === "success"
            ? "bg-emerald-600"
            : toast.variant === "error"
              ? "bg-rose-600"
              : "bg-slate-800";
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto w-full max-w-md rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-black/5 ${color}`}
          >
            <div className="flex items-start justify-between gap-3">
              <span>{toast.title}</span>
              <button
                className="text-white/80 hover:text-white"
                onClick={() => onClose(toast.id)}
              >
                ×
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
