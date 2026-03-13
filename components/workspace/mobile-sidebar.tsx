"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Plus, Home, Star, Trash2, Search } from "lucide-react";
import Link from "next/link";

interface Page {
  id: string;
  title: string;
  icon?: string;
  parentId?: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  children?: Page[];
}

interface MobileSidebarProps {
  workspaceId: string;
  workspaceName: string;
  pages: Page[];
  currentPageId?: string;
  onCreatePage: () => void;
}

export function MobileSidebar({
  workspaceId,
  workspaceName,
  pages,
  currentPageId,
  onCreatePage,
}: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const favoritePages = pages.filter((p) => p.isFavorite && !p.isArchived);
  const regularPages = pages.filter((p) => !p.isFavorite && !p.isArchived && !p.parentId);
  const trashedPages = pages.filter((p) => p.isArchived);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700"
      >
        <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
                <Link
                  href={`/workspace/${workspaceId}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2"
                >
                  <Home className="w-5 h-5 text-purple-600" />
                  <h2 className="font-bold text-gray-900 dark:text-white truncate">
                    {workspaceName}
                  </h2>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Search */}
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search pages..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                {/* New Page Button */}
                <button
                  onClick={() => {
                    onCreatePage();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 mb-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">New Page</span>
                </button>

                {/* Favorites */}
                {favoritePages.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 px-2 py-1 mb-2">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Favorites
                      </span>
                    </div>
                    {favoritePages.map((page) => (
                      <Link
                        key={page.id}
                        href={`/workspace/${workspaceId}/page/${page.id}`}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 transition-colors ${
                          currentPageId === page.id
                            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                            : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span className="text-lg">{page.icon || "📝"}</span>
                        <span className="text-sm font-medium truncate flex-1">
                          {page.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* All Pages */}
                <div className="mb-6">
                  <div className="flex items-center justify-between px-2 py-1 mb-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                      Pages
                    </span>
                    <span className="text-xs text-gray-400">
                      {regularPages.length}
                    </span>
                  </div>
                  {regularPages.map((page) => (
                    <Link
                      key={page.id}
                      href={`/workspace/${workspaceId}/page/${page.id}`}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 transition-colors ${
                        currentPageId === page.id
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                          : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <span className="text-lg">{page.icon || "📝"}</span>
                      <span className="text-sm font-medium truncate flex-1">
                        {page.title}
                      </span>
                    </Link>
                  ))}
                  {regularPages.length === 0 && (
                    <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
                      No pages yet
                    </p>
                  )}
                </div>

                {/* Trash */}
                {trashedPages.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 px-2 py-1 mb-2">
                      <Trash2 className="w-3 h-3 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Trash
                      </span>
                      <span className="text-xs text-gray-400">
                        {trashedPages.length}
                      </span>
                    </div>
                    {trashedPages.map((page) => (
                      <div
                        key={page.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg mb-1 text-gray-400 dark:text-gray-500"
                      >
                        <span className="text-lg opacity-50">
                          {page.icon || "📝"}
                        </span>
                        <span className="text-sm line-through truncate flex-1">
                          {page.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}