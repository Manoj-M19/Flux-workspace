"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smile } from "lucide-react";

interface IconPickerProps {
  currentIcon: string;
  onSelect: (icon: string) => void;
}

const EMOJI_CATEGORIES = {
  "Frequently Used": ["📝", "📄", "📋", "📌", "✅", "🎯", "💡", "🚀", "⭐", "🔥"],
  "Documents": ["📝", "📄", "📋", "📑", "📊", "📈", "📉", "🗂️", "📁", "📂"],
  "Objects": ["💼", "📱", "💻", "⌨️", "🖥️", "🖨️", "📷", "📹", "🎥", "📞"],
  "Symbols": ["✅", "❌", "⭐", "💡", "🔥", "🎯", "🚀", "⚡", "💎", "🎨"],
  "Nature": ["🌟", "🌙", "☀️", "⭐", "🌈", "🔥", "💧", "🌊", "🌍", "🌎"],
  "Food": ["🍕", "🍔", "🍟", "🌮", "🍿", "🍩", "🍪", "🍰", "🎂", "🍦"],
  "Activities": ["⚽", "🏀", "🎮", "🎯", "🎲", "🎸", "🎨", "📚", "✈️", "🚗"],
  "Faces": ["😀", "😊", "🤔", "😎", "🤩", "😍", "🥳", "🤯", "😴", "🤓"],
};

export function IconPicker({ currentIcon, onSelect }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Frequently Used");

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-20 h-20 text-5xl hover:opacity-70 transition-opacity"
        title="Change icon"
      >
        {currentIcon}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 rounded-xl transition-colors" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Picker Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-purple-100 dark:border-purple-800 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Smile className="w-5 h-5" />
                  <span className="font-semibold">Choose Icon</span>
                </div>
              </div>

              {/* Categories */}
              <div className="flex overflow-x-auto border-b border-gray-200 dark:border-slate-700 px-2">
                {Object.keys(EMOJI_CATEGORIES).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                      px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors
                      ${selectedCategory === category
                        ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Emoji Grid */}
              <div className="p-3 grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
                {EMOJI_CATEGORIES[selectedCategory as keyof typeof EMOJI_CATEGORIES].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onSelect(emoji);
                      setIsOpen(false);
                    }}
                    className={`
                      w-9 h-9 flex items-center justify-center text-2xl rounded-lg transition-all
                      hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:scale-110
                      ${currentIcon === emoji ? "bg-purple-100 dark:bg-purple-900/50 ring-2 ring-purple-500" : ""}
                    `}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-200 dark:border-slate-700 text-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}