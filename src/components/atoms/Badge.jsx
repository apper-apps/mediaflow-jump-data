import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({
  className,
  variant = "default",
  size = "sm",
  children,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center font-medium transition-colors";
  
  const variants = {
    default: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    primary: "bg-primary-100 text-primary-800 hover:bg-primary-200",
    accent: "bg-accent-100 text-accent-800 hover:bg-accent-200", 
    success: "bg-green-100 text-green-800 hover:bg-green-200",
    warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    danger: "bg-red-100 text-red-800 hover:bg-red-200",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50"
  };

  const sizes = {
    xs: "px-2 py-0.5 text-xs rounded-md",
    sm: "px-2.5 py-1 text-xs rounded-lg",
    md: "px-3 py-1.5 text-sm rounded-lg",
    lg: "px-4 py-2 text-sm rounded-xl"
  };

  return (
    <span
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;