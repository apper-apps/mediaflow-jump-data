import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({
  className,
  label,
  error,
  helperText,
  required = false,
  options = [],
  placeholder = "Select an option...",
  ...props
}, ref) => {
  const selectId = props.id || props.name;

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={cn(
          "flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900",
          "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        ref={ref}
        id={selectId}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;