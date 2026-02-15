"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { IconPicker } from "./icon-picker";
import { Sparkles } from "lucide-react";

interface PageEditorProps {
  page: {
    id: string;
    title: string;
    icon?: string;
    content: string;
  };
  onUpdate: (updates: { title?: string; icon?: string; content?: string }) => void;
}

export function PageEditor({ page, onUpdate }: PageEditorProps) {
  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content);
  const [icon, setIcon] = useState(page.icon || "📝");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (title !== page.title) {
        onUpdate({ title });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [title]);

  // Auto-save content with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content !== page.content) {
        onUpdate({ content });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [content]);

  // Update icon immediately
  const handleIconChange = (newIcon: string) => {
    setIcon(newIcon);
    onUpdate({ icon: newIcon });
  };

  return (
    <div className="h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-8 py-12"
      >
        {/* Icon */}
        <div className="mb-4">
          <IconPicker currentIcon={icon} onSelect={handleIconChange} />
        </div>

        {/* Title */}
        <div className="mb-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            className="w-full text-5xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
            autoFocus
          />
        </div>

        {/* Content Editor */}
        <div className="prose prose-lg max-w-none">
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Start writing, or type '/' for commands..."
            minHeight="400px"
          />
        </div>

        {/* Footer Info */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Last edited just now</span>
            </div>
            <div className="flex items-center gap-4">
              <span>{content.length} characters</span>
              <span>•</span>
              <span>Auto-saving...</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}