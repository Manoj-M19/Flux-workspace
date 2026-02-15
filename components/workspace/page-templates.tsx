"use client";

import { motion } from "framer-motion";
import { FileText, CheckSquare, List, Calendar, Code, Table } from "lucide-react";

interface Template {
  id: string;
  name: string;
  icon: any;
  emoji: string;
  description: string;
  content: string;
}

const TEMPLATES: Template[] = [
  {
    id: "blank",
    name: "Blank Page",
    icon: FileText,
    emoji: "📝",
    description: "Start with an empty page",
    content: "",
  },
  {
    id: "todo",
    name: "To-Do List",
    icon: CheckSquare,
    emoji: "✅",
    description: "Track tasks and check them off",
    content: `<h2>My Tasks</h2><ul><li>First task</li><li>Second task</li><li>Third task</li></ul>`,
  },
  {
    id: "notes",
    name: "Meeting Notes",
    icon: List,
    emoji: "📋",
    description: "Capture meeting discussions",
    content: `<h1>Meeting Notes</h1><h2>Date</h2><p>${new Date().toLocaleDateString()}</p><h2>Attendees</h2><ul><li>Person 1</li><li>Person 2</li></ul><h2>Agenda</h2><ol><li>Topic 1</li><li>Topic 2</li></ol><h2>Action Items</h2><ul><li>Task 1</li></ul>`,
  },
  {
    id: "project",
    name: "Project Plan",
    icon: Calendar,
    emoji: "📊",
    description: "Plan and track a project",
    content: `<h1>Project Name</h1><h2>Overview</h2><p>Brief description of the project...</p><h2>Goals</h2><ul><li>Goal 1</li><li>Goal 2</li><li>Goal 3</li></ul><h2>Timeline</h2><p>Start Date: <strong>TBD</strong></p><p>End Date: <strong>TBD</strong></p><h2>Milestones</h2><ol><li>Milestone 1</li><li>Milestone 2</li></ol>`,
  },
  {
    id: "doc",
    name: "Documentation",
    icon: Code,
    emoji: "📚",
    description: "Write technical docs",
    content: `<h1>Documentation</h1><h2>Overview</h2><p>What does this do?</p><h2>Getting Started</h2><pre><code>npm install package-name</code></pre><h2>Usage</h2><p>How to use this...</p><h2>Examples</h2><pre><code>// Example code here</code></pre>`,
  },
  {
    id: "table",
    name: "Table",
    icon: Table,
    emoji: "📑",
    description: "Organize data in rows and columns",
    content: `<h2>Data Table</h2><table><thead><tr><th>Column 1</th><th>Column 2</th><th>Column 3</th></tr></thead><tbody><tr><td>Data 1</td><td>Data 2</td><td>Data 3</td></tr><tr><td>Data 4</td><td>Data 5</td><td>Data 6</td></tr></tbody></table>`,
  },
];

interface PageTemplatesProps {
  onSelect: (template: Template) => void;
  onClose: () => void;
}

export function PageTemplates({ onSelect, onClose }: PageTemplatesProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Choose a Template
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Start with a pre-built template or create a blank page
          </p>
        </div>

        {/* Templates Grid */}
        <div className="p-8 overflow-y-auto max-h-[calc(80vh-200px)]">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES.map((template, index) => (
              <motion.button
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelect(template)}
                className="group text-left p-6 border-2 border-gray-200 dark:border-slate-700 rounded-2xl hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="text-4xl">{template.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {template.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end">
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

export { TEMPLATES };
export type { Template };