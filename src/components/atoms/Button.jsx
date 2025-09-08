import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = React.forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md transform hover:scale-105",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-primary-500 shadow-sm hover:shadow-md",
    outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
    ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-sm hover:shadow-md",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 focus:ring-accent-500 shadow-sm hover:shadow-md transform hover:scale-105"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
    xl: "px-8 py-4 text-lg rounded-xl"
  };

  const iconSize = {
    sm: "w-4 h-4",
    md: "w-4 h-4", 
    lg: "w-5 h-5",
    xl: "w-6 h-6"
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ApperIcon 
          name="Loader2" 
          className={cn("animate-spin", iconSize[size], children ? "mr-2" : "")} 
        />
      ) : (
        icon && iconPosition === "left" && (
          <ApperIcon 
            name={icon} 
            className={cn(iconSize[size], children ? "mr-2" : "")} 
          />
        )
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon 
          name={icon} 
          className={cn(iconSize[size], children ? "ml-2" : "")} 
        />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;