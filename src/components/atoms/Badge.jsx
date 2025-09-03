import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ 
  children, 
  variant = "default", 
  className,
  ...props 
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-700 border border-gray-200",
    primary: "bg-primary/10 text-primary border border-primary/20",
    success: "bg-accent/10 text-accent border border-accent/20",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium font-display transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;