import React from "react";
import { cn } from "@/utils/cn";

const PriorityIndicator = ({ 
  priority, 
  className,
  animated = true
}) => {
  const getPriorityConfig = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return {
          color: "bg-red-500",
          ring: "ring-red-500/20",
          text: "High Priority"
        };
      case "medium":
        return {
          color: "bg-amber-500",
          ring: "ring-amber-500/20",
          text: "Medium Priority"
        };
      case "low":
        return {
          color: "bg-green-500",
          ring: "ring-green-500/20",
          text: "Low Priority"
        };
      default:
        return {
          color: "bg-gray-400",
          ring: "ring-gray-400/20",
          text: "No Priority"
        };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <div 
      className={cn("flex items-center gap-2", className)}
      title={config.text}
    >
      <div
        className={cn(
          "w-3 h-3 rounded-full ring-4",
          config.color,
          config.ring,
          animated && "animate-pulse-gentle hover:animate-none transition-all duration-200"
        )}
      />
      <span className="text-sm font-medium text-gray-600 capitalize">
        {priority || "None"}
      </span>
    </div>
  );
};

export default PriorityIndicator;