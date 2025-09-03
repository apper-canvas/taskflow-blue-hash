import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md",
  disabled = false,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-primary shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-white text-primary border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]",
    ghost: "text-gray-600 hover:text-primary hover:bg-primary/5 transform hover:scale-[1.02] active:scale-[0.98]",
    success: "bg-gradient-to-r from-accent to-emerald-600 text-white hover:from-emerald-600 hover:to-accent shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-500 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm font-medium",
    md: "px-4 py-2.5 text-base font-medium",
    lg: "px-6 py-3 text-lg font-semibold"
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-display transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;