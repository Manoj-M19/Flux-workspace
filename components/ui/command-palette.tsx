"use client";

import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Home,
  FileText,
  CheckSquare,
  Link as LinkIcon,
  Trash2,
  Settings,
  LogOut,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react";

interface Command {
  id: string;
  label: string;
  icon: any;
  action: () => void;
  category: string;
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateItem?: (type: string) => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onCreateItem,
}: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = [
    {
      id: "home",
      label: "Go to Home",
      icon: Home,
      category: "Navigation",
      action: () => {
        router.push("/");
        onClose();
      },
      shortcut: "G H",
    },
    {
      id: "workspaces",
      label: "Go to Workspaces",
      icon: Sparkles,
      category: "Navigation",
      action: () => {
        router.push("/workspaces");
        onClose();
      },
      shortcut: " G W",
    },

    {
      id: "new note",
      label: "Create Note",
      icon: FileText,
      category: "Create",
      action: () => {
        onCreateItem?.("note");
        onClose();
      },
      shortcut: "C N",
    },
    {
      id: "new-task",
      label: "Create Task",
      icon: CheckSquare,
      category: "Create",
      action: () => {
        onCreateItem?.("task");
        onClose();
      },
      shortcut: "C T",
    },
    {
      id: "new-link",
      label: "Create Link",
      icon: LinkIcon,
      category: "Create",
      action: () => {
        onCreateItem?.("link");
        onClose();
      },
      shortcut: "C L",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      category: "Settings",
      action: () => {
        onClose();
      },
    },
    {
      id: "sign-out",
      label: "Sign Out",
      icon: LogOut,
      category: "Account",
      action: () => {
        signOut({ callbackUrl: "/" });
        onClose();
      },
    },
  ];

  const filteredCommands = search
    ? commands.filter((cmd) =>
        cmd.label.toLowerCase().includes(search.toLocaleLowerCase()),
      )
    : commands;

  const groupedCommands = filteredCommands.reduce(
    (acc, cmd) => {
      if (!acc[cmd.category]) {
        acc[cmd.category] = [];
      }
      acc[cmd.category].push(cmd);
      return acc;
    },
    {} as Record<string, Command[]>,
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : prev,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter") {
        e.preventDefault();
        filteredCommands[selectedIndex]?.action();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-purple-100 overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-purple-100">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-gray-400"
                  autoFocus
                />
                <kbd className="hidden sm:block px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded font-mono">
                  ESC
                </kbd>
              </div>

              <div className="max-h-100px overflow-y-auto">
                {filteredCommands.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No commands found
                  </div>
                ) : (
                  <div className="p-2">
                    {Object.entries(groupedCommands).map(([category, cmds]) => (
                      <div key={category} className="mb-4 last:mb-0">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {category}
                        </div>
                        {cmds.map((cmd, index) => {
                          const globalIndex = filteredCommands.indexOf(cmd);
                          const isSelected = globalIndex === selectedIndex;

                          return (
                            <motion.button
                              key={cmd.id}
                              onClick={cmd.action}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              whileHover={{ x: 4 }}
                              className={`
                                w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all
                                ${
                                  isSelected
                                    ? "bg-linear-to-r from-purple-500 to-pink-500 text-white"
                                    : "hover:bg-purple-50 text-gray-700"
                                }
                              `}
                            >
                              <div className="flex items-center gap-3">
                                <cmd.icon className="w-5 h-5" />
                                <span className="font-medium">{cmd.label}</span>
                              </div>
                              {cmd.shortcut && (
                                <kbd
                                  className={`
                                    px-2 py-1 text-xs rounded font-mono
                                    ${
                                      isSelected
                                        ? "bg-white/20 text-white"
                                        : "bg-purple-100 text-purple-600"
                                    }
                                  `}
                                >
                                  {cmd.shortcut}
                                </kbd>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between px-4 py-3 border-t border-purple-100 bg-purple-50/50 text-xs text-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white border border-purple-200 rounded font-mono">
                      ↑
                    </kbd>
                    <kbd className="px-1.5 py-0.5 bg-white border border-purple-200 rounded font-mono">
                      ↓
                    </kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white border border-purple-200 rounded font-mono">
                      ↵
                    </kbd>
                    <span>Select</span>
                  </div>
                </div>
                <span className="text-purple-600">
                  {filteredCommands.length} commands
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
