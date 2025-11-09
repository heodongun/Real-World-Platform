'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-white/60 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 backdrop-blur',
      className,
    )}
    {...props}
  />
));

Input.displayName = 'Input';
