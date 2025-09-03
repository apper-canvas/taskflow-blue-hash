import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ 
  totalTasks, 
  completedTasks, 
  className 
}) => {
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const activeTasks = totalTasks - completedTasks;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <div className="bg-gradient-to-r from-primary via-secondary to-primary bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500 rounded-2xl p-8 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-4 -translate-x-4" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <ApperIcon name="CheckSquare" className="h-6 w-6" />
                </div>
                <h1 className="text-3xl font-bold font-display">TaskFlow</h1>
              </div>
              <p className="text-white/80 text-lg">
                Manage your tasks with geometric simplicity
              </p>
            </div>

            {/* Progress Ring */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#10B981"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={176}
                    strokeDashoffset={176 - (176 * completionRate) / 100}
                    initial={{ strokeDashoffset: 176 }}
                    animate={{ strokeDashoffset: 176 - (176 * completionRate) / 100 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {Math.round(completionRate)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold font-display mb-1">
                {totalTasks}
              </div>
              <div className="text-white/80 text-sm font-medium">
                Total Tasks
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-display mb-1 text-accent">
                {activeTasks}
              </div>
              <div className="text-white/80 text-sm font-medium">
                Active
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold font-display mb-1 text-emerald-300">
                {completedTasks}
              </div>
              <div className="text-white/80 text-sm font-medium">
                Completed
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Header;