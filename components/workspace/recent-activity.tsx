"use client";

import { motion } from "framer-motion";
import { FileText, CheckSquare, Link as LinkIcon, Clock } from "lucide-react";
import Link from "next/link";

interface Activity {
  id: string;
  type: string;
  title: string;
  workspaceName: string;
  workspaceId: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const typeIcons = {
  note: FileText,
  task: CheckSquare,
  link: LinkIcon,
};

const typeColors = {
  note: "from-blue-500 to-cyan-500",
  task: "from-green-500 to-emerald-500",
  link: "from-purple-500 to-pink-500",
};

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" />
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activities.map((activity, index) => {
        const Icon = typeIcons[activity.type as keyof typeof typeIcons];
        const linear = typeColors[activity.type as keyof typeof typeColors];

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={`/workspace/${activity.workspaceId}`}
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-purple-50 dark:hover:bg-slate-700/50 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${linear} flex items-center justify-center shrink--0 shadow-md`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.workspaceName} • {activity.timestamp}
                </p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}