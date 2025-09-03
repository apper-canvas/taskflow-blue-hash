import React from "react";
import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";

const FormField = ({ 
  label, 
  error, 
  type = "input",
  className,
  children,
  required = false,
  ...props 
}) => {
  const renderInput = () => {
    if (type === "textarea") {
      return <Textarea error={!!error} {...props} />;
    }
    if (type === "select") {
      return (
        <Select error={!!error} {...props}>
          {children}
        </Select>
      );
    }
    if (type === "custom") {
      return children;
    }
    return <Input error={!!error} {...props} />;
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-semibold font-display text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderInput()}
      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default FormField;