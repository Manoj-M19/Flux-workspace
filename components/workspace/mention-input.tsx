"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";

interface MentionUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  workspaceId: string;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  autoFocus?: boolean;
  rows?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function MentionInput({
  value,
  onChange,
  placeholder = "",
  workspaceId,
  onKeyDown,
  autoFocus = false,
  rows = 3,
  className = "",
  style = {},
}: MentionInputProps) {
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionUsers, setMentionUsers] = useState<MentionUser[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (mentionQuery !== null && workspaceId) {
      fetchMentionUsers();
    }
  }, [mentionQuery, workspaceId]);

  async function fetchMentionUsers() {
    try {
      const res = await fetch(
        `/api/mentions?workspaceId=${workspaceId}&query=${encodeURIComponent(
          mentionQuery
        )}`
      );
      const data = await res.json();
      setMentionUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching mention users:", error);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;

    onChange(newValue);
    setCursorPosition(cursorPos);

    // Check if @ was just typed
    const textBeforeCursor = newValue.slice(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
      
      // Check if there's a space after @ (means we're not mentioning anymore)
      if (!textAfterAt.includes(" ")) {
        setMentionQuery(textAfterAt);
        setShowMentions(true);
        setSelectedIndex(0);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  }

  function insertMention(user: MentionUser) {
    const textBeforeCursor = value.slice(0, cursorPosition);
    const textAfterCursor = value.slice(cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      const beforeAt = value.slice(0, lastAtIndex);
      const mention = `@${user.name || user.email} `;
      const newValue = beforeAt + mention + textAfterCursor;

      onChange(newValue);
      setShowMentions(false);
      setMentionQuery("");

      // Focus back to textarea
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPos = (beforeAt + mention).length;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (showMentions && mentionUsers.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < mentionUsers.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : mentionUsers.length - 1
        );
      } else if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        insertMention(mentionUsers[selectedIndex]);
        return;
      } else if (e.key === "Escape") {
        setShowMentions(false);
      }
    }

    // Call parent onKeyDown if provided
    if (onKeyDown && (!showMentions || e.key !== "Enter")) {
      onKeyDown(e);
    }
  }

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        rows={rows}
        dir="ltr"
        lang="en"
        className={className}
        style={{
          ...style,
          direction: "ltr",
          textAlign: "left",
          unicodeBidi: "normal",
        }}
      />

      {/* Mention Dropdown */}
      <AnimatePresence>
        {showMentions && mentionUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full left-0 mb-2 w-full max-w-xs bg-white dark:bg-slate-800 rounded-xl shadow-2xl border-2 border-purple-200 dark:border-purple-700 overflow-hidden z-50"
          >
            <div className="p-2 max-h-48 overflow-y-auto">
              {mentionUsers.map((user, index) => (
                <button
                  key={user.id}
                  onClick={() => insertMention(user)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    index === selectedIndex
                      ? "bg-purple-100 dark:bg-purple-900/50"
                      : "hover:bg-gray-100 dark:hover:bg-slate-700"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold overflow-hidden shrink-0">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || ""}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <div className="px-3 py-2 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ↑↓ to navigate • Enter to select • Esc to cancel
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}