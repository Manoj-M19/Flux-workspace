"use client";

import { Clock } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  icon?: string;
  workspace: string;
  updatedAt: string;
  type: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No recent activity in the last 7 days
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group"
        >
          {/* Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-lg">{activity.icon || "📝"}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 dark:text-white truncate mb-1">
              {activity.title}
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="truncate">{activity.workspace}</span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <div className="flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3" />
                <time dateTime={activity.updatedAt}>
                  {formatRelativeTime(activity.updatedAt)}
                </time>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper function to format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return date.toLocaleDateString();
}