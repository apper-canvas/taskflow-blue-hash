import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "CheckSquare",
  title = "Nothing to see here", 
  description = "Get started by adding some content",
  action,
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-16 ${className}`}
    >
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg"
        >
          <ApperIcon name={icon} className="h-10 w-10 text-white" />
        </motion.div>

        <h3 className="text-2xl font-bold font-display text-gray-900 mb-4">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
          {description}
        </p>

        {action && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={action.onClick}
              variant="primary"
              size="lg"
              className="flex items-center gap-2"
            >
              <ApperIcon name="Plus" className="h-5 w-5" />
              {action.label}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;