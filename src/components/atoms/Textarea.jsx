import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ 
  className, 
  error = false,
  ...props 
}, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white font-body text-gray-900 placeholder:text-gray-500 transition-all duration-200 resize-none",
        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
        "hover:border-gray-300",
        error && "border-red-300 focus:border-red-500 focus:ring-red-100",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;