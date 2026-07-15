'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ActionFeedback, FeedbackVariant } from '@ai-school/shared';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastItem = ActionFeedback & { id: string };

type NotifyInput = ActionFeedback & { durationMs?: number };

type NotifyApi = {
  show: (input: NotifyInput) => void;
  success: (title: string, message: string, solution?: string) => void;
  error: (title: string, message: string, solution?: string) => void;
  warning: (title: string, message: string, solution?: string) => void;
  info: (title: string, message: string, solution?: string) => void;
  dismiss: (id: string) => void;
};

const NotificationContext = createContext<NotifyApi | null>(null);

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
} as const;

const STYLES: Record<FeedbackVariant, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  error: 'border-red-200 bg-red-50 text-red-950',
  warning: 'border-amber-200 bg-amber-50 text-amber-950',
  info: 'border-blue-200 bg-blue-50 text-blue-950',
};

const DEFAULT_DURATION: Record<FeedbackVariant, number> = {
  success: 5000,
  error: 9000,
  warning: 7000,
  info: 6000,
};

function pushToLocalQueue(item: ActionFeedback) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('aischool_notification_log');
    const list = raw ? (JSON.parse(raw) as ActionFeedback[]) : [];
    list.unshift({ ...item, message: `${item.message} · ${new Date().toLocaleString()}` });
    localStorage.setItem('aischool_notification_log', JSON.stringify(list.slice(0, 50)));
  } catch {
    /* ignore */
  }
}

function tryBrowserPush(item: ActionFeedback) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  try {
    new Notification(item.title, { body: item.message });
  } catch {
    /* ignore */
  }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (input: NotifyInput) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const item: ToastItem = {
        id,
        variant: input.variant,
        title: input.title,
        message: input.message,
        solution: input.solution,
      };
      setToasts((prev) => [...prev.slice(-4), item]);
      pushToLocalQueue(item);
      tryBrowserPush(item);
      const duration = input.durationMs ?? DEFAULT_DURATION[input.variant];
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  const api = useMemo<NotifyApi>(
    () => ({
      show,
      dismiss,
      success: (title, message, solution) => show({ variant: 'success', title, message, solution }),
      error: (title, message, solution) => show({ variant: 'error', title, message, solution }),
      warning: (title, message, solution) => show({ variant: 'warning', title, message, solution }),
      info: (title, message, solution) => show({ variant: 'info', title, message, solution }),
    }),
    [show, dismiss]
  );

  return (
    <NotificationContext.Provider value={api}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 top-4 z-[200] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6"
        aria-live="polite"
        aria-relevant="additions"
      >
        {toasts.map((toast) => {
          const Icon = ICONS[toast.variant];
          return (
            <div
              key={toast.id}
              role={toast.variant === 'error' ? 'alert' : 'status'}
              className={cn(
                'pointer-events-auto w-full max-w-md rounded-xl border px-4 py-3 shadow-lg',
                STYLES[toast.variant]
              )}
            >
              <div className="flex gap-3">
                <Icon className="h-5 w-5 shrink-0 mt-0.5" aria-hidden />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{toast.title}</p>
                  <p className="text-sm mt-0.5 opacity-90 leading-relaxed">{toast.message}</p>
                  {toast.solution ? (
                    <p className="text-xs mt-2 font-medium opacity-80">
                      <span className="uppercase tracking-wide">Fix: </span>
                      {toast.solution}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  className="touch-target shrink-0 rounded-lg opacity-70 hover:opacity-100"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotify(): NotifyApi {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotify must be used within NotificationProvider');
  return ctx;
}
