import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ 
  checked = false,
  onChange,
  className,
  animated = true,
  ...props 
}, ref) => {
  return (
    <div className={cn("relative", className)}>
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={onChange}
        className="sr-only"
        {...props}
      />
      <div
        onClick={onChange}
        className={cn(
          "w-6 h-6 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-center justify-center transform",
          "hover:scale-105 active:scale-95",
          checked 
            ? "bg-gradient-to-br from-accent to-emerald-600 border-accent shadow-lg" +
              (animated ? " animate-check" : "")
            : "bg-white border-gray-300 hover:border-primary/50"
        )}
      >
        {checked && (
          <ApperIcon 
            name="Check" 
            className="h-4 w-4 text-white font-bold"
          />
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;