import { cn } from '@/lib/utils';

type FormSectionProps = {
  legend: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

/** Law of Proximity — grouped fields with a shared legend (fieldset pattern). */
export function FormSection({ legend, description, children, className }: FormSectionProps) {
  return (
    <fieldset className={cn('space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5', className)}>
      <legend className="px-1 text-sm font-semibold text-slate-900">{legend}</legend>
      {description ? <p className="text-xs text-slate-500 -mt-2">{description}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}
