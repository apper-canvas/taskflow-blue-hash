import React from "react";
import { motion } from "framer-motion";

const Loading = ({ message = "Loading tasks..." }) => {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <motion.div
        className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl p-8"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gray-300 rounded-xl animate-pulse" />
              <div className="h-8 w-32 bg-gray-300 rounded animate-pulse" />
            </div>
            <div className="h-6 w-64 bg-gray-300 rounded animate-pulse" />
          </div>
          <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-8 w-12 bg-gray-300 rounded mx-auto mb-1 animate-pulse" />
              <div className="h-4 w-16 bg-gray-300 rounded mx-auto animate-pulse" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Task skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form skeleton */}
        <div className="space-y-6">
          <motion.div
            className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="space-y-5">
              <div>
                <div className="h-4 w-20 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
              </div>
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="h-4 w-16 bg-gray-200 rounded mb-2 animate-pulse" />
                  <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                </div>
                <div>
                  <div className="h-4 w-14 bg-gray-200 rounded mb-2 animate-pulse" />
                  <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                </div>
              </div>
              <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse" />
            </div>
          </motion.div>
        </div>

        {/* Task list skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-gray-200 rounded-lg mt-1 animate-pulse" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="w-8 h-8 bg-gray-100 rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-full bg-gray-100 rounded mb-2 animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-100 rounded mb-3 animate-pulse" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-6 w-24 bg-gray-100 rounded-lg animate-pulse" />
                      <div className="h-6 w-20 bg-gray-100 rounded-lg animate-pulse" />
                    </div>
                    <div className="h-5 w-16 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="text-center py-4">
        <p className="text-gray-500 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Loading;