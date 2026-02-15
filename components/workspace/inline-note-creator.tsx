"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ImageUploader } from "./image-uploader";
import { Save, X, Type, CheckSquare, Link as LinkIcon } from "lucide-react";

interface InlineNoteCreatorProps {
  position: { x: number; y: number };
  onSave: (data: {
    type: string;
    title: string;
    content: string;
    images: string[];
    priority?: string;
    dueDate?: string;
  }) => void;
  onCancel: () => void;
}

export function InlineNoteCreator({ position, onSave, onCancel }: InlineNoteCreatorProps) {
  const [type, setType] = useState<"note" | "task" | "link">("note");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [dueDate, setDueDate] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const handleSave = () => {
    if (!title.trim()) return;

    const data: any = {
      type,
      title,
      content,
      images,
    };

    if (type === "task") {
      data.priority = priority;
      if (dueDate) {
        data.dueDate = new Date(dueDate).toISOString();
      }
    }

    onSave(data);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    }
    if (e.key === "Enter" && e.metaKey) {
      handleSave();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: 400,
        zIndex: 100,
      }}
      onKeyDown={handleKeyDown}
      className="select-none"
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-purple-200 dark:border-purple-800 overflow-hidden">
        {/* Type Selector */}
        <div className="flex items-center gap-1 p-2 border-b border-purple-100 dark:border-purple-800 bg-purple-50 dark:bg-slate-900">
          <button
            onClick={() => setType("note")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${type === "note"
              ? "bg-white dark:bg-slate-700 text-purple-600 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-700/50"
              }`}
          >
            <Type className="w-4 h-4" />
            Note
          </button>
          <button
            onClick={() => setType("task")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${type === "task"
              ? "bg-white dark:bg-slate-700 text-green-600 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-700/50"
              }`}
          >
            <CheckSquare className="w-4 h-4" />
            Task
          </button>
          <button
            onClick={() => setType("link")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${type === "link"
              ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-slate-700/50"
              }`}
          >
            <LinkIcon className="w-4 h-4" />
            Link
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title..."
            className="w-full text-xl font-semibold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
          />

          {/* Rich Text Content */}
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Start typing... (⌘Enter to save)"
            minHeight="100px"
          />

          {/* Task-specific fields */}
          {type === "task" && (
            <>
              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <div className="flex gap-2">
                  {(["high", "medium", "low"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`
                        flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all
                        ${priority === p
                          ? p === "high"
                            ? "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-600 dark:text-red-400"
                            : p === "medium"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500 text-yellow-600 dark:text-yellow-400"
                              : "bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-400"
                          : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700"
                        }
                      `}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-purple-200 dark:border-purple-800 dark:bg-slate-700 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </>
          )}

          {/* Image Upload */}
          <ImageUploader images={images} onImagesChange={setImages} maxImages={3} />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-4 border-t border-purple-100 dark:border-purple-800 bg-gray-50 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <kbd className="px-2 py-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded">ESC</kbd>
            <span>to cancel</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="px-6 py-2 text-sm font-medium bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}