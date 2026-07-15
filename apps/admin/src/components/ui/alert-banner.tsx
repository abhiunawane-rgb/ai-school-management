import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type Variant = 'info' | 'success' | 'error' | 'warning';

const styles: Record<Variant, string> = {
  info: 'border-brand-200 bg-brand-50/80 text-brand-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  error: 'border-red-200 bg-red-50 text-red-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
};

const icons: Record<Variant, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertCircle,
};

type Props = {
  variant?: Variant;
  title?: string;
  children: React.ReactNode;
  className?: string;
  onDismiss?: () => void;
};

/** Help users recognize, diagnose, and recover — visible, plain-language feedback. */
export function AlertBanner({
  variant = 'info',
  title,
  children,
  className,
  onDismiss,
}: Props) {
  const Icon = icons[variant];
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed',
        styles[variant],
        className
      )}
    >
      <Icon className="h-5 w-5 shrink-0 mt-0.5" aria-hidden />
      <div className="flex-1 min-w-0">
        {title ? <p className="font-semibold mb-0.5">{title}</p> : null}
        <div>{children}</div>
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="touch-target shrink-0 text-sm font-medium opacity-70 hover:opacity-100"
          aria-label="Dismiss message"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}
