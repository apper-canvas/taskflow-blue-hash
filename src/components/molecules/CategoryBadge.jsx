import React from "react";
import { cn } from "@/utils/cn";

const CategoryBadge = ({ 
  category,
  className,
  ...props 
}) => {
  if (!category) return null;

  const getBadgeStyle = (color) => {
    const colorMap = {
      "#5B21B6": "bg-purple-100 text-purple-800 border-purple-200",
      "#8B5CF6": "bg-violet-100 text-violet-800 border-violet-200",
      "#10B981": "bg-emerald-100 text-emerald-800 border-emerald-200",
      "#3B82F6": "bg-blue-100 text-blue-800 border-blue-200",
      "#EF4444": "bg-red-100 text-red-800 border-red-200",
      "#F59E0B": "bg-amber-100 text-amber-800 border-amber-200",
      "#EC4899": "bg-pink-100 text-pink-800 border-pink-200",
      "#8B5CF6": "bg-indigo-100 text-indigo-800 border-indigo-200"
    };

    return colorMap[color] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold font-display border transition-all duration-200 hover:scale-105",
        getBadgeStyle(category.color),
        className
      )}
      {...props}
    >
      <div 
        className="w-2 h-2 rounded-full mr-1.5"
        style={{ backgroundColor: category.color }}
      />
      {category.name}
    </span>
  );
};

export default CategoryBadge;