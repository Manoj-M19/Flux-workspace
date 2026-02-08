"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { User, Settings, LogOut, Sparkles, CreditCard } from "lucide-react";

export function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session?.user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 hover:bg-purple-100 rounded-xl transition-colors"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-8 h-8 rounded-full border-2 border-purple-200"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-purple-100 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-purple-100">
              <div className="flex items-center gap-3">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-12 h-12 rounded-full border-2 border-purple-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">
                    {session.user.name || "User"}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {session.user.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-50 text-gray-700 transition-colors">
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-50 text-gray-700 transition-colors">
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-50 text-gray-700 transition-colors">
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">Billing</span>
                <span className="ml-auto px-2 py-1 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">
                  Pro
                </span>
              </button>

              <div className="my-2 border-t border-purple-100" />

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>

            <div className="px-4 py-3 bg-purple-50/50 border-t border-purple-100">
              <div className="text-xs text-gray-600 flex items-center justify-between">
                <span>Press ⌘K for commands</span>
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
