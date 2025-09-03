import React from "react";
import { cn } from "@/utils/cn";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FilterBar = ({ 
  filters,
  onFiltersChange,
  categories,
  onClearFilters,
  className
}) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = filters.status !== "all" || filters.category !== "all" || filters.priority !== "all";

  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      <div className="flex items-center gap-3">
        <Select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="min-w-[120px]"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </Select>

        <Select
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="min-w-[140px]"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.Id} value={category.Id}>
              {category.name}
            </option>
          ))}
        </Select>

        <Select
          value={filters.priority}
          onChange={(e) => handleFilterChange("priority", e.target.value)}
          className="min-w-[120px]"
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="flex items-center gap-2"
        >
          <ApperIcon name="X" className="h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default FilterBar;