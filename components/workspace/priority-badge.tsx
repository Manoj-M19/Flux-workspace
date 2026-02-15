"use client";

import { motion } from "framer-motion";
import { AlertCircle, ArrowUp, Minus } from "lucide-react";

interface PriorityBadgeProps {
  priority: "high" | "medium" | "low";
  size?: "sm" | "md";
}

const priorityConfig = {
  high: {
    label: "High",
    icon: ArrowUp,
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-300 dark:border-red-700",
  },
  medium: {
    label: "Medium",
    icon: Minus,
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-600 dark:text-yellow-400",
    border: "border-yellow-300 dark:border-yellow-700",
  },
  low: {
    label: "Low",
    icon: Minus,
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-300 dark:border-blue-700",
  },
};

export function PriorityBadge({ priority, size = "sm" }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  const Icon = config.icon;

  const sizeClasses = size === "sm"
    ? "text-xs px-2 py-1"
    : "text-sm px-3 py-1.5";

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`
        inline-flex items-center gap-1 rounded-full font-medium border
        ${config.bg} ${config.text} ${config.border} ${sizeClasses}
      `}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      <span>{config.label}</span>
    </motion.div>
  );
}