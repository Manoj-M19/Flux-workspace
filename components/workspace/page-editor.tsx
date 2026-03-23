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
    <div className="h-full overflow-y-auto bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        {/* Icon */}
        <div className="mb-4">
          <IconPicker currentIcon={icon} onSelect={handleIconChange} />
        </div>

        {/* Title */}
        <div className="mb-6 sm:mb-8">  {/* ← Updated */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            className="w-full text-3xl sm:text-4xl lg:text-5xl font-bold bg-transparent border-none outline-none text-white placeholder:text-gray-600"
            autoFocus
          />
        </div>

        {/* Content Editor */}
        <div className="prose prose-sm sm:prose-base lg:prose-lg prose-invert max-w-none">  {/* ← Updated */}
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Start writing, or type '/' for commands..."
            minHeight="300px"
          />
        </div>

        {/* Footer Info */}
        <div className="mt-8 sm:mt-12 pt-6 border-t border-slate-800">  {/* ← Updated */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">  {/* ← Updated */}
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Last edited just now</span>  {/* ← Updated */}
            </div>
            <div className="flex items-center gap-4 text-xs sm:text-sm">  {/* ← Updated */}
              <span>{content.length} characters</span>
              <span>•</span>
              <span>Auto-saving...</span>
            </div>
          </div>
        </div>
        {/* Floating AI Assistant Button */}
        <button
          onClick={() => {
            alert("Select text in the editor and click the AI sparkle button in the toolbar!");
          }}
          className="fixed bottom-24 right-8 w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-30 lg:hidden"
          title="AI Assistant"
        >
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </motion.div>
    </div>
  );
};