"use client";

import {motion, AnimatePresence } from "framer-motion";
import { Clock, FileText, Search, X } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface Page{
    id:string;
    title:string;
    icon?:string;
    content:string;
    workspaceId:string;
    updatedAt:string;
}

interface SearchCommandProps {
    workspaceId:string;
    isOpen:boolean;
    onClose:() => void;
}

export function SearchCommand({ workspaceId,isOpen,onClose} : SearchCommandProps) {
    const router = useRouter();
    const [query,setQuery] = useState("");
    const [results,setResults] = useState<Page[]>([]);
    const [recentPages,setRecentPages] = useState<Page[]>([]);
    const [loading,setLoading] = useState(false);
    const [selectedIndex,setSelectedIndex] = useState(0);

    useEffect(()=> {
        if(isOpen) {
            fetchRecentPages();
            setQuery("");
            setSelectedIndex(0);
        }
    },[isOpen])

    useEffect(()=> {
        if(query.trim()) {
            searchPages();
        } else {
            setResults([]);
        }
    },[query]);

    async function fetchRecentPages() {
        try {
            const res = await fetch(`/api/pages?workspaceId=${workspaceId}`);
            const data = await res.json();
            const sorted = (data.pages || [])
            .sort((a:Page,b:Page) => 
             new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            )
            .slice(0,5);
            setRecentPages(sorted);
        } catch (error) {
            console.error("Error fetching recent pages:",error);
        }
    }

    async function searchPages() {
        setLoading(true);
        try {
            const res = await fetch(`/api/pages/search?workspaceId=${workspaceId}&query=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data.results || []);
        } catch(error) {
            console.error("Error searching pages:",error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    function handleSelect(page:Page) {
        router.push(`/workspace/${workspaceId}/page/${page.id}`);
        onClose();
    }

    function handleKeyDown(e:React.KeyboardEvent) {
        const itemCount = query ? results.length : recentPages.length;

        if(e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev)=> (prev +1) % itemCount);
        } else if (e.key ==="ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev -1 + itemCount) % itemCount);
        } else if (e.key ==="Enter") {
            e.preventDefault();
            const pages = query ? results : recentPages;
            if(pages[selectedIndex]) {
                handleSelect(pages[selectedIndex]);
            }
        } else if (e.key === "Escape") {
            onClose();
        }
    }

    const displayPages = query ? results :recentPages;

    if(!isOpen) {
        return null;
    }

    return (
         <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
        {/* Backdrop */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Search Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-purple-200 dark:border-purple-800 overflow-hidden"
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-slate-700">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search pages..."
              className="flex-1 bg-transparent border-none outline-none text-lg text-gray-900 dark:text-white placeholder:text-gray-400"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                Searching...
              </div>
            ) : displayPages.length > 0 ? (
              <div className="p-2">
                {!query && (
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    <Clock className="w-3 h-3" />
                    Recent Pages
                  </div>
                )}
                {displayPages.map((page, index) => (
                  <button
                    key={page.id}
                    onClick={() => handleSelect(page)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left
                      ${index === selectedIndex
                        ? "bg-purple-100 dark:bg-purple-900/50"
                        : "hover:bg-gray-100 dark:hover:bg-slate-700"
                      }
                    `}
                  >
                    <div className="text-2xl">{page.icon || "📝"}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white truncate">
                        {highlightQuery(page.title, query)}
                      </div>
                      {page.content && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {stripHtml(page.content).slice(0, 100)}...
                        </div>
                      )}
                    </div>
                    <FileText className="w-4 h-4 text-gray-400 `shrink-0`" />
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No pages found for "{query}"</p>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No recent pages</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded text-xs">
                  ↑↓
                </kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded text-xs">
                  Enter
                </kbd>
                <span>Open</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded text-xs">
                  ESC
                </kbd>
                <span>Close</span>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {displayPages.length} result{displayPages.length !== 1 ? "s" : ""}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
    );
}

function highlightQuery(text: string, query: string) {
  if (!query) return text;
  
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-gray-900 dark:text-white">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function stripHtml(html: string) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}