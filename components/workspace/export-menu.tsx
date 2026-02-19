"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, File, Loader2 } from "lucide-react";
import { exportAsMarkdown, exportAsPDF } from "@/lib/export";

interface ExportMenuProps {
  page: {
    title: string;
    icon?: string;
    content: string;
  };
}

export function ExportMenu({ page }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  async function handleExportMarkdown() {
    setIsExporting(true);
    try {
      exportAsMarkdown(page.title, page.content);
    } catch (error) {
      console.error("Error exporting markdown:", error);
      alert("Failed to export as Markdown");
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  }

  async function handleExportPDF() {
    setIsExporting(true);
    try {
      await exportAsPDF(page.title, page.content, page.icon);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Failed to export as PDF");
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50"
      >
        {isExporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">Export</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-slate-700 overflow-hidden z-50"
            >
              <div className="p-2">
                <button
                  onClick={handleExportMarkdown}
                  disabled={isExporting}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-left disabled:opacity-50"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Markdown
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Plain text format (.md)
                    </p>
                  </div>
                </button>

                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-left disabled:opacity-50"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <File className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      PDF
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Document format (.pdf)
                    </p>
                  </div>
                </button>
              </div>

              <div className="px-4 py-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Export your page to share or backup
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}