import { cn } from '@/lib/utils';

type StatTileProps = {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
};

/** Compact metric — visual hierarchy without redundant cards. */
export function StatTile({ label, value, icon, className }: StatTileProps) {
  return (
    <div className={cn('flex items-center gap-3 min-w-0', className)}>
      {icon ? (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          {icon}
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="text-xl font-bold text-slate-900 tabular-nums">{value}</p>
        <p className="text-xs text-slate-500 truncate">{label}</p>
      </div>
    </div>
  );
}
