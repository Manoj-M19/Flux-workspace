"use client";

import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { useState } from "react";

interface TaskFiltersProps {
  onFilterChange: (filters: {
    priority?: string;
    dueDate?: string;
    sortBy?: string;
  }) => void;
}

export function TaskFilters({ onFilterChange }: TaskFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [priority, setPriority] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");

  const applyFilters = () => {
    onFilterChange({ priority, dueDate, sortBy });
  };

  const clearFilters = () => {
    setPriority("");
    setDueDate("");
    setSortBy("");
    onFilterChange({});
  };

  const hasActiveFilters = priority || dueDate || sortBy;

  return (
    <div className="relative">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all
          ${hasActiveFilters
            ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 border-2 border-purple-500"
            : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500"
          }
        `}
      >
        <Filter className="w-4 h-4" />
        Filters
        {hasActiveFilters && (
          <span className="ml-1 w-5 h-5 bg-purple-600 text-white rounded-full text-xs flex items-center justify-center">
            {[priority, dueDate, sortBy].filter(Boolean).length}
          </span>
        )}
      </button>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full mt-2 right-0 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-purple-100 dark:border-purple-800 p-6 z-50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Filter Tasks</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            {/* Due Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date
              </label>
              <select
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Dates</option>
                <option value="overdue">Overdue</option>
                <option value="today">Due Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Default</option>
                <option value="priority">Priority (High → Low)</option>
                <option value="dueDate">Due Date (Soonest)</option>
                <option value="created">Recently Created</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={clearFilters}
                className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  applyFilters();
                  setShowFilters(false);
                }}
                className="flex-1 px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Apply
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}