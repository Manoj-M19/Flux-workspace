"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Star,
  Trash2,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  FileText,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Page {
  id: string;
  title: string;
  icon?: string;
  parentId?: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  children?: Page[];
}

interface SidebarProps {
  workspaceId: string;
  pages: Page[];
  currentPageId?: string;
  onCreatePage: () => void;
  onDeletePage: (id: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onRestorePage: (id: string) => void;
  creatingPage?: boolean; 
}

export function Sidebar({
  workspaceId,
  pages,
  currentPageId,
  onCreatePage,
  onDeletePage,
  onToggleFavorite,
  onRestorePage,
  creatingPage = false,
}: SidebarProps) {
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Filter pages
  const favoritePages = pages.filter((p) => p.isFavorite && !p.isArchived);
  const regularPages = pages.filter(
    (p) => !p.isFavorite && !p.isArchived && !p.parentId
  );
  const trashedPages = pages.filter((p) => p.isArchived);

  const toggleExpanded = (pageId: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId);
    } else {
      newExpanded.add(pageId);
    }
    setExpandedPages(newExpanded);
  };

  const PageItem = ({ page, level = 0 }: { page: Page; level?: number }) => {
    const hasChildren = page.children && page.children.length > 0;
    const isExpanded = expandedPages.has(page.id);
    const isActive = currentPageId === page.id;

    return (
      <div>
        <div
          className={`group flex items-center gap-2 px-3 py-2 rounded-lg transition-colors relative ${
            isActive
              ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
              : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300"
          }`}
          style={{ paddingLeft: `${12 + level * 16}px` }}
        >
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); 
                toggleExpanded(page.id);
              }}
              className="shrink-0 hover:bg-gray-200 dark:hover:bg-slate-700 rounded p-0.5"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          )}

          {/* Page Link */}
          <Link
            href={`/workspace/${workspaceId}/page/${page.id}`}
            onClick={(e) => {
              e.stopPropagation(); 
            }}
            className="flex items-center gap-2 flex-1 min-w-0"
          >
            <span className="text-lg shrink-0">{page.icon || "📝"}</span>
            <span className="text-sm font-medium truncate">{page.title}</span>
          </Link>

          {/* Actions Menu */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Favorite Toggle */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); 
                onToggleFavorite(page.id, !page.isFavorite);
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded"
              title={page.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  page.isFavorite
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-gray-400"
                }`}
              />
            </button>

            {/* More Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenuOpen(menuOpen === page.id ? null : page.id);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {menuOpen === page.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-1 z-50"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        onDeletePage(page.id);
                        setMenuOpen(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2 text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Child Pages */}
        {hasChildren && isExpanded && (
          <div className="ml-2">
            {page.children?.map((child) => (
              <PageItem key={child.id} page={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-700">
        <button
          onClick={onCreatePage}
          disabled={creatingPage} 
          className="w-full flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">
            {creatingPage ? "Creating..." : "New Page"} 
          </span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search pages..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Favorites Section */}
        {favoritePages.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 px-2 py-1 mb-2">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Favorites
              </span>
            </div>
            <div className="space-y-1">
              {favoritePages.map((page) => (
                <PageItem key={page.id} page={page} />
              ))}
            </div>
          </div>
        )}

        {/* All Pages Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between px-2 py-1 mb-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Pages
            </span>
            <span className="text-xs text-gray-400">{regularPages.length}</span>
          </div>
          {regularPages.length === 0 ? (
            <div className="px-2 py-8 text-center">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No pages yet
              </p>
              <button
                onClick={onCreatePage}
                disabled={creatingPage}
                className="mt-2 text-sm text-purple-600 dark:text-purple-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create your first page
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {regularPages.map((page) => (
                <PageItem key={page.id} page={page} />
              ))}
            </div>
          )}
        </div>

        {/* Trash Section */}
        {trashedPages.length > 0 && (
          <div>
            <div className="flex items-center gap-2 px-2 py-1 mb-2">
              <Trash2 className="w-3 h-3 text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Trash
              </span>
              <span className="text-xs text-gray-400">{trashedPages.length}</span>
            </div>
            <div className="space-y-1">
              {trashedPages.map((page) => (
                <div
                  key={page.id}
                  className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="text-lg opacity-50">{page.icon || "📝"}</span>
                  <span className="text-sm text-gray-400 dark:text-gray-500 line-through truncate flex-1">
                    {page.title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); 
                      onRestorePage(page.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded transition-opacity"
                    title="Restore"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}