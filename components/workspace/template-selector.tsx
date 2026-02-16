"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  Lightbulb,
  FileText,
  Users,
  Layout
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  icon: any;
  description: string;
  color: string;
  items: Array<{
    type: string;
    title: string;
    content: string;
    position_x: number;
    position_y: number;
    color: string;
  }>;
}

const templates: Template[] = [
  {
    id: "project-plan",
    name: "Project Plan",
    icon: Briefcase,
    description: "Sprint planning with tasks, goals, and timeline",
    color: "from-blue-500 to-cyan-500",
    items: [
      {
        type: "note",
        title: "Project Goals",
        content: "<h2>Q1 Goals</h2><ul><li>Launch beta version</li><li>Get 1000 users</li><li>Build core features</li></ul>",
        position_x: 100,
        position_y: 100,
        color: "blue"
      },
      {
        type: "task",
        title: "Design mockups",
        content: "Create high-fidelity designs in Figma",
        position_x: 500,
        position_y: 100,
        color: "purple"
      },
      {
        type: "task",
        title: "Backend API",
        content: "Build REST API with authentication",
        position_x: 500,
        position_y: 300,
        color: "green"
      },
      {
        type: "task",
        title: "Frontend UI",
        content: "Implement React components",
        position_x: 500,
        position_y: 500,
        color: "yellow"
      },
      {
        type: "note",
        title: "Tech Stack",
        content: "<ul><li>Next.js 14</li><li>PostgreSQL</li><li>Tailwind CSS</li><li>Vercel</li></ul>",
        position_x: 900,
        position_y: 100,
        color: "gray"
      },
    ],
  },
  {
    id: "content-calendar",
    name: "Content Calendar",
    icon: Calendar,
    description: "Plan blog posts, social media, and campaigns",
    color: "from-pink-500 to-rose-500",
    items: [
      {
        type: "note",
        title: "Week 1: Feb 10-16",
        content: "<h3>Content for this week</h3><ul><li>Blog: How to be productive</li><li>Twitter: Launch announcement</li><li>LinkedIn: Case study</li></ul>",
        position_x: 100,
        position_y: 100,
        color: "pink"
      },
      {
        type: "task",
        title: "Write blog post",
        content: "2000 words about productivity hacks",
        position_x: 100,
        position_y: 400,
        color: "blue"
      },
      {
        type: "task",
        title: "Create graphics",
        content: "Design 5 social media images",
        position_x: 500,
        position_y: 400,
        color: "purple"
      },
      {
        type: "link",
        title: "Analytics Dashboard",
        content: "https://analytics.google.com",
        position_x: 900,
        position_y: 100,
        color: "green"
      },
    ],
  },
  {
    id: "research-board",
    name: "Research Board",
    icon: Lightbulb,
    description: "Organize research, ideas, and references",
    color: "from-purple-500 to-indigo-500",
    items: [
      {
        type: "note",
        title: "Research Question",
        content: "<h2>How does AI affect productivity?</h2><p>Exploring the impact of AI tools on knowledge workers</p>",
        position_x: 100,
        position_y: 100,
        color: "purple"
      },
      {
        type: "note",
        title: "Key Findings",
        content: "<ul><li>40% productivity increase with AI assistants</li><li>Reduced time on repetitive tasks</li><li>More time for creative work</li></ul>",
        position_x: 500,
        position_y: 100,
        color: "blue"
      },
      {
        type: "link",
        title: "Study: AI in the Workplace",
        content: "https://example.com/ai-study",
        position_x: 100,
        position_y: 400,
        color: "green"
      },
      {
        type: "note",
        title: "Next Steps",
        content: "<ul><li>Interview 10 users</li><li>Analyze survey data</li><li>Write summary report</li></ul>",
        position_x: 500,
        position_y: 400,
        color: "yellow"
      },
    ],
  },
  {
    id: "kanban",
    name: "Kanban Board",
    icon: Layout,
    description: "Todo → In Progress → Done workflow",
    color: "from-green-500 to-emerald-500",
    items: [
      {
        type: "note",
        title: "📋 To Do",
        content: "<p>Tasks that need to be started</p>",
        position_x: 100,
        position_y: 100,
        color: "gray"
      },
      {
        type: "task",
        title: "Review pull requests",
        content: "Check and merge team PRs",
        position_x: 100,
        position_y: 300,
        color: "blue"
      },
      {
        type: "note",
        title: "🚧 In Progress",
        content: "<p>Currently working on</p>",
        position_x: 500,
        position_y: 100,
        color: "yellow"
      },
      {
        type: "task",
        title: "Build authentication",
        content: "Implement OAuth with NextAuth",
        position_x: 500,
        position_y: 300,
        color: "purple"
      },
      {
        type: "note",
        title: "✅ Done",
        content: "<p>Completed tasks</p>",
        position_x: 900,
        position_y: 100,
        color: "green"
      },
    ],
  },
  {
    id: "meeting-notes",
    name: "Meeting Notes",
    icon: Users,
    description: "Structure for team meetings and 1-on-1s",
    color: "from-orange-500 to-red-500",
    items: [
      {
        type: "note",
        title: "Team Sync - Feb 11, 2024",
        content: "<h3>Attendees</h3><ul><li>Alice (PM)</li><li>Bob (Dev)</li><li>Carol (Design)</li></ul><h3>Agenda</h3><ul><li>Sprint review</li><li>Next week planning</li><li>Blockers</li></ul>",
        position_x: 100,
        position_y: 100,
        color: "blue"
      },
      {
        type: "note",
        title: "Discussion Points",
        content: "<ul><li>Launch delayed by 1 week</li><li>Need more design resources</li><li>API integration complete</li></ul>",
        position_x: 500,
        position_y: 100,
        color: "purple"
      },
      {
        type: "task",
        title: "Action: Hire designer",
        content: "Post job on LinkedIn and Indeed",
        position_x: 100,
        position_y: 450,
        color: "red"
      },
      {
        type: "task",
        title: "Action: Update roadmap",
        content: "Adjust timeline in project management tool",
        position_x: 500,
        position_y: 450,
        color: "orange"
      },
    ],
  },
  {
    id: "blank",
    name: "Blank Canvas",
    icon: FileText,
    description: "Start from scratch",
    color: "from-gray-500 to-slate-500",
    items: [],
  },
];

interface TemplateSelectorProps {
  onSelectTemplate: (template: Template) => void;
  onClose: () => void;
}

export function TemplateSelector({ onSelectTemplate, onClose }: TemplateSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
      >
        <div className="p-8 border-b border-purple-100 dark:border-purple-800">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Choose a Template
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Start with a pre-built template or create from scratch
          </p>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(80vh-200px)]">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <motion.button
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectTemplate(template)}
                className="group text-left p-6 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-xl transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${template.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <template.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {template.description}
                </p>
                {template.items.length > 0 && (
                  <div className="mt-3 text-xs text-purple-600 dark:text-purple-400 font-medium">
                    {template.items.length} items included
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-purple-100 dark:border-purple-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-full hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export { templates };
export type { Template };