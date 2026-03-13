"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  linear: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  delay?: number;
}

export function AnalyticsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  linear,
  trend,
  delay = 0,
}: AnalyticsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative overflow-hidden p-6 bg-white dark:bg-slate-800 rounded-3xl border-2 border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-600 transition-all"
    >
      {/* Background linear decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${linear} opacity-10 dark:opacity-5 rounded-full blur-2xl`} />
      
      <div className="relative">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${linear} flex items-center justify-center mb-4 shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          {title}
        </h3>

        {/* Value */}
        <div className="flex items-baseline gap-2 mb-2">
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          
          {trend && (
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              trend.isPositive 
                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
                : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
            }`}>
              {trend.isPositive ? "↑" : "↓"} {trend.value}
            </span>
          )}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}