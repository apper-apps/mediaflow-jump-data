import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({
  className,
  type = "text",
  label,
  error,
  helperText,
  required = false,
  ...props
}, ref) => {
  const inputId = props.id || props.name;

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500",
          "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        ref={ref}
        id={inputId}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;