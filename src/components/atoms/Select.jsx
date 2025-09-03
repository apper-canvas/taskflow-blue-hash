import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  children,
  className, 
  error = false,
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "w-full px-4 py-3 pr-10 rounded-xl border-2 border-gray-200 bg-white font-body text-gray-900 transition-all duration-200 appearance-none cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          "hover:border-gray-300",
          error && "border-red-300 focus:border-red-500 focus:ring-red-100",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ApperIcon 
        name="ChevronDown" 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
      />
    </div>
  );
});

Select.displayName = "Select";

export default Select;