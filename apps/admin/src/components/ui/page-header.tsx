import { cn } from '@/lib/utils';

type Props = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

/** Visual hierarchy + proximity: title, supporting text, and actions grouped together. */
export function PageHeader({ title, description, children, className }: Props) {
  return (
    <header
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
        className
      )}
    >
      <div className="space-y-1 min-w-0">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">{description}</p>
        ) : null}
      </div>
      {children ? <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div> : null}
    </header>
  );
}
