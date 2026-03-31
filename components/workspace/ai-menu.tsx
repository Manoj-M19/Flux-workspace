"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Wand2,
  CheckCircle,
  Minimize2,
  Maximize2,
  Briefcase,
  Smile,
  Heart,
  FileText,
  Loader2,
  X,
  MessageSquare,
} from "lucide-react";

interface AIMenuProps {
  selectedText: string;
  onInsert: (text: string) => void;
  onClose: () => void;
  position?: { x: number; y: number };
}

export function AIMenu({ selectedText, onInsert, onClose, position }: AIMenuProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);

  async function handleAIAction(action: string, context?: any) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          text: selectedText,
          context,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI request failed");
      }

      setResult(data.result);
    } catch (err: any) {
      console.error("AI error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleCustomPrompt() {
    if (!customPrompt.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "custom",
          text: selectedText,
          context: { customPrompt },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI request failed");
      }

      setResult(data.result);
      setShowCustomPrompt(false);
      setCustomPrompt("");
    } catch (err: any) {
      console.error("AI error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const actions = [
    {
      icon: MessageSquare,
      label: "Ask AI anything",
      action: "custom",
      color: "from-violet-500 to-purple-500",
      description: "Custom AI request",
    },
    {
      icon: Wand2,
      label: "Continue writing",
      action: "continue",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Sparkles,
      label: "Improve writing",
      action: "improve",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: CheckCircle,
      label: "Fix grammar",
      action: "fix-grammar",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Minimize2,
      label: "Make shorter",
      action: "make-shorter",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Maximize2,
      label: "Make longer",
      action: "make-longer",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Briefcase,
      label: "Professional tone",
      action: "tone-professional",
      color: "from-gray-600 to-gray-700",
    },
    {
      icon: Smile,
      label: "Casual tone",
      action: "tone-casual",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Heart,
      label: "Friendly tone",
      action: "tone-friendly",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: FileText,
      label: "Summarize",
      action: "summarize",
      color: "from-teal-500 to-cyan-500",
    },
  ];

 return (
  <AnimatePresence>
    {/* Dark Backdrop */}
    <motion.div
      key="ai-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      onClick={onClose}
    />

    {/* AI Menu - Always Centered */}
    <motion.div
      key="ai-menu" 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] sm:w-[480px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-purple-200 dark:border-purple-700 overflow-hidden max-h-[85vh] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-purple-500 to-pink-500 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-white" />
          <div>
            <h3 className="font-bold text-white">AI Assistant</h3>
            <p className="text-xs text-purple-100">Powered by Groq Llama 3 • Free</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI is thinking...
              </p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 max-h-[50vh] overflow-y-auto">
                <div 
                  className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-mono"
                  style={{ 
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word' 
                  }}
                >
                  {result}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onInsert(result);
                    onClose();
                  }}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm cursor-pointer"
                >
                  Replace Text
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result);
                  }}
                  className="px-4 py-2.5 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-lg font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all text-sm cursor-pointer"
                >
                  Copy
                </button>
                <button
                  onClick={() => {
                    setResult(null);
                    setError(null);
                  }}
                  className="px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-sm cursor-pointer"
                >
                  Back
                </button>
              </div>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
              <button
                onClick={() => {
                  setResult(null);
                  setError(null);
                }}
                className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-sm"
              >
                Try Again
              </button>
            </div>
          ) : showCustomPrompt ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What do you want AI to do with this text?
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="E.g., 'Convert this to JavaScript code' or 'Translate to Spanish'"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none text-sm"
                  rows={3}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      handleCustomPrompt();
                    }
                  }}
                />
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>Selected text:</strong> {selectedText.substring(0, 100)}
                  {selectedText.length > 100 ? "..." : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCustomPrompt}
                  disabled={!customPrompt.trim()}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Ask AI
                </button>
                <button
                  onClick={() => {
                    setShowCustomPrompt(false);
                    setCustomPrompt("");
                  }}
                  className="px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-sm"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Tip: Press ⌘+Enter to submit
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Selected: {selectedText.slice(0, 50)}
                {selectedText.length > 50 ? "..." : ""}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {actions.map((item) => (
                  <button
                    key={item.action}
                    onClick={() => {
                      if (item.action === "custom") {
                        setShowCustomPrompt(true);
                      } else {
                        handleAIAction(item.action);
                      }
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all group text-left"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                        {item.label}
                      </span>
                      {item.description && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  </AnimatePresence>
);
}