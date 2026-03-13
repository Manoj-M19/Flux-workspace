"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, AlertTriangle } from "lucide-react";

interface DueDateBadgeProps {
  dueDate: Date | string;
  size?: "sm" | "md";
}

export function DueDateBadge({ dueDate, size = "sm" }: DueDateBadgeProps) {
  const date = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Determine status
  let status: "overdue" | "today" | "soon" | "upcoming";
  let config: {
    bg: string;
    text: string;
    border: string;
    icon: any;
  };

  if (diffDays < 0) {
    status = "overdue";
    config = {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-300 dark:border-red-700",
      icon: AlertTriangle,
    };
  } else if (diffDays === 0) {
    status = "today";
    config = {
      bg: "bg-orange-100 dark:bg-orange-900/30",
      text: "text-orange-600 dark:text-orange-400",
      border: "border-orange-300 dark:border-orange-700",
      icon: Clock,
    };
  } else if (diffDays <= 3) {
    status = "soon";
    config = {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-600 dark:text-yellow-400",
      border: "border-yellow-300 dark:border-yellow-700",
      icon: Calendar,
    };
  } else {
    status = "upcoming";
    config = {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-300 dark:border-green-700",
      icon: Calendar,
    };
  }

  const Icon = config.icon;
  const sizeClasses = size === "sm" ? "text-xs px-2 py-1" : "text-sm px-3 py-1.5";

  const formatDate = () => {
    if (diffDays < 0) {
      return `${Math.abs(diffDays)}d overdue`;
    } else if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Tomorrow";
    } else if (diffDays <= 7) {
      return `${diffDays}d`;
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`
        inline-flex items-center gap-1 rounded-full font-medium border
        ${config.bg} ${config.text} ${config.border} ${sizeClasses}
      `}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      <span>{formatDate()}</span>
    </motion.div>
  );
}