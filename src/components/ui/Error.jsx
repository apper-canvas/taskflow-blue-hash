import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-400 to-red-500 rounded-2xl flex items-center justify-center"
        >
          <ApperIcon name="AlertTriangle" className="h-8 w-8 text-white" />
        </motion.div>

        <h3 className="text-xl font-bold font-display text-gray-900 mb-3">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {message}. Please try again or refresh the page.
        </p>

        {onRetry && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={onRetry}
              variant="primary"
              className="flex items-center gap-2"
            >
              <ApperIcon name="RefreshCw" className="h-4 w-4" />
              Try Again
            </Button>
            
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <ApperIcon name="RotateCcw" className="h-4 w-4" />
              Refresh Page
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Error;