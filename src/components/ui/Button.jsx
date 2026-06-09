import React from 'react';
import { cn } from '../../utils';

export function Button({ children, className, variant = 'primary', size = 'md', asChild = false, ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 disabled:opacity-50 disabled:pointer-events-none active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-brand-blue to-brand-light text-zinc-950 font-bold hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] border border-transparent hover:border-white/20 hover:-translate-y-0.5",
    outline: "border border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white",
    ghost: "bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white",
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-12 px-8 text-lg",
    icon: "h-10 w-10",
  };

  const Component = asChild ? 'a' : 'button';

  return (
    <Component
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Component>
  );
}
