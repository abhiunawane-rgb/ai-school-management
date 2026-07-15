'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Size = 'sm' | 'md' | 'lg';

const box: Record<Size, string> = {
  sm: 'h-11 w-11 rounded-xl',
  md: 'h-14 w-14 rounded-2xl',
  lg: 'h-16 w-16 rounded-2xl',
};

const iconSize: Record<Size, string> = {
  sm: 'h-5 w-5',
  md: 'h-7 w-7',
  lg: 'h-8 w-8',
};

type Props = {
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
  size?: Size;
  float?: boolean;
};

/** CSS 3D-style icon tile — depth, shadow, hover tilt (MD3 / modern SaaS). */
export function Icon3D({ icon: Icon, className, iconClassName, size = 'md', float = false }: Props) {
  return (
    <motion.div
      className={cn('icon-3d-scene', float && 'animate-float-slow')}
      whileHover={{ rotateY: 14, rotateX: -10, scale: 1.06, z: 20 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
    >
      <div className={cn('icon-3d-face', box[size], className)}>
        <Icon className={cn(iconSize[size], iconClassName)} aria-hidden />
      </div>
    </motion.div>
  );
}
