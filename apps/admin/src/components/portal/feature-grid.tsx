'use client';

import Link from 'next/link';
import type { PortalTile } from '@/lib/portal/role-config';
import { cn } from '@/lib/utils';

type Props = {
  tiles: PortalTile[];
};

export function FeatureGrid({ tiles }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
      {tiles.map((tile) => {
        const Icon = tile.icon;
        const inner = (
          <>
            <Icon className="h-8 w-8 text-brand-600" aria-hidden />
            <span className="font-semibold text-sm text-slate-900 text-center leading-tight">{tile.label}</span>
            {tile.hint ? (
              <span className="text-[10px] text-slate-500 text-center leading-snug">{tile.hint}</span>
            ) : null}
          </>
        );

        const className = cn(
          'flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white p-4 min-h-[7.5rem]',
          'shadow-sm hover:shadow-card hover:border-brand-100 transition-all active:scale-[0.98]',
          !tile.href && !tile.external && 'opacity-60 cursor-not-allowed'
        );

        if (tile.external) {
          return (
            <a key={tile.id} href={tile.external} className={className}>
              {inner}
            </a>
          );
        }

        if (!tile.href) {
          return (
            <div key={tile.id} className={className}>
              {inner}
            </div>
          );
        }

        return (
          <Link key={tile.id} href={tile.href} className={className}>
            {inner}
          </Link>
        );
      })}
    </div>
  );
}
