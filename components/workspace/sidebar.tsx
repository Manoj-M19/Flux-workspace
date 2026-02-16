"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Plus,
  Search,
  Star,
  Trash2,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface Page {
  id: string;
  title: string;
  icon?: string;
  parentId?: string | null;
  isFavorite: boolean;
  children?: Page[];
}

interface SidebarProps {
  workspaceId: string;
  pages: Page[];
  currentPageId?: string;
  onCreatePage: (parentId?: string) => void;
  onDeletePage: (id: string) => void;
}

export function Sidebar({
  workspaceId,
  pages,
  currentPageId,
  onCreatePage,
  onDeletePage,
}: SidebarProps) {
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const toggleExpanded = (pageId: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId);
    } else {
      newExpanded.add(pageId);
    }
    setExpandedPages(newExpanded);
  };

  const topLevelPages = pages.filter((p) => !p.parentId);
  const favoritePages = pages.filter((p) => p.isFavorite);

  const PageItem = ({ page, level = 0 }: { page: Page; level?: number }) => {
    const hasChildren = page.children && page.children.length > 0;
    const isExpanded = expandedPages.has(page.id);
    const isActive = currentPageId === page.id;

    return (
      <div>
        <Link
          href={`/workspace/${workspaceId}/page/${page.id}`}
          className={`
            group flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors
            ${isActive 
              ? "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300" 
              : "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
            }
          `}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleExpanded(page.id);
              }}
              className="hover:bg-gray-200 dark:hover:bg-slate-600 rounded p-0.5"
            >
              <ChevronRight
                className={`w-3 h-3 transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </button>
          )}
          
          <span className="text-base">{page.icon || "📝"}</span>
          <span className="flex-1 truncate">{page.title}</span>
          
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                onCreatePage(page.id);
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded"
            >
              <Plus className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (confirm("Delete this page?")) {
                  onDeletePage(page.id);
                }
              }}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </Link>

        {/* Children */}
        {hasChildren && isExpanded && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {page.children!.map((child) => (
                <PageItem key={child.id} page={child} level={level + 1} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 h-full bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col">
      {/* Search */}
      <div className="p-3 border-b border-gray-200 dark:border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-slate-700 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Pages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {/* Favorites */}
        {favoritePages.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              <Star className="w-3 h-3" />
              Favorites
            </div>
            {favoritePages.map((page) => (
              <PageItem key={page.id} page={page} />
            ))}
          </div>
        )}

        {/* All Pages */}
        <div>
          <div className="flex items-center justify-between px-2 py-1 mb-1">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Pages
            </span>
            <button
              onClick={() => onCreatePage()}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
            >
              <Plus className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          {topLevelPages.length === 0 ? (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No pages yet</p>
              <button
                onClick={() => onCreatePage()}
                className="mt-2 text-purple-600 dark:text-purple-400 text-sm hover:underline"
              >
                Create your first page
              </button>
            </div>
          ) : (
            topLevelPages.map((page) => (
              <PageItem key={page.id} page={page} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}