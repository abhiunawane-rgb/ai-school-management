import Link from 'next/link';
import { cn } from '@/lib/utils';

type ButtonProps = {
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variants = {
  primary:
    'bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700 active:scale-[0.98]',
  secondary: 'bg-white text-brand-700 border border-slate-200 hover:bg-slate-50 shadow-card',
  ghost: 'text-slate-700 hover:bg-slate-100',
  outline: 'border-2 border-white text-white hover:bg-white/10',
};

const sizes = {
  sm: 'h-9 px-4 text-sm min-w-[44px]',
  md: 'h-11 px-6 text-sm font-medium min-w-[44px]',
  lg: 'h-12 px-8 text-base font-semibold min-w-[48px]',
};

export function Button({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-xl transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
