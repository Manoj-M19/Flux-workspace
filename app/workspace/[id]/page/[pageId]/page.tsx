"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Share,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/workspace/sidebar";
import { PageEditor } from "@/components/workspace/page-editor";
import { CommentsSection } from "@/components/workspace/comments-section";
import { ShareModal } from "@/components/workspace/share-modal";
import { ExportMenu } from "@/components/workspace/export-menu";
import { UserMenu } from "@/components/ui/user-menu";
import { PageTemplates, type Template } from "@/components/workspace/page-templates";

interface Page {
  id: string;
  title: string;
  content: string;
  icon?: string;
  parentId: string | null;
  workspaceId: string;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  children?: Page[];
}

interface Workspace {
  id: string;
  name: string;
  icon?: string;
}

export default function PageView({
  params,
}: {
  params: Promise<{ id: string; pageId: string }>;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id: workspaceId, pageId } = use(params);

  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [creatingPage, setCreatingPage] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchWorkspace() {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`/api/workspaces?userId=${session.user.id}`);
        const data = await res.json();
        const found = data.workspaces?.find((w: any) => w.id === workspaceId);
        setWorkspace(found);
      } catch (error) {
        console.error("Error fetching workspace:", error);
      }
    }

    if (session?.user?.id) {
      fetchWorkspace();
    }
  }, [session?.user?.id, workspaceId]);

  useEffect(() => {
    async function fetchPages() {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(
          `/api/pages?workspaceId=${workspaceId}&includeArchived=true`
        );
        const data = await res.json();
        setPages(data.pages || []);
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    }

    if (session?.user?.id) {
      fetchPages();
    }
  }, [session?.user?.id, workspaceId]);

  useEffect(() => {
    async function fetchCurrentPage() {
      if (!session?.user?.id) return;
      setLoading(true);

      try {
        const res = await fetch(`/api/pages?id=${pageId}`);
        const data = await res.json();
        setCurrentPage(data.page);
      } catch (error) {
        console.error("Error fetching page:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user?.id && pageId) {
      fetchCurrentPage();
    }
  }, [session?.user?.id, pageId]);

 async function handleCreatePage(parentId?: string, template?: Template) {
  // Filter out event objects
  if (parentId && typeof parentId === 'object' && 'target' in parentId) {
    console.log(" Event object detected, ignoring");
    parentId = undefined;
    template = undefined;
  }

  if (!session?.user?.id || creatingPage) {
    console.log(" Prevented duplicate page creation");
    return;
  }

  setCreatingPage(true);
  console.log(" Creating new page...");

  try {
    const pageData = {
      title: template?.name || "Untitled",
      icon: template?.emoji || "📝",
      content: template?.content || "",
      workspaceId,
      parentId: parentId || null,
    };

    console.log(" Sending request:", pageData);

    const res = await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pageData),
    });

    console.log(" Response status:", res.status);

    if (res.ok) {
      const data = await res.json();
      console.log(" Page created:", data.page);

      setPages((prev) => [...prev, data.page]);
      setShowTemplates(false);
      router.push(`/workspace/${workspaceId}/page/${data.page.id}`);
    } else {
      const errorData = await res.json();
      console.error(" Failed to create page:", res.status, errorData);
      alert(`Failed to create page: ${errorData.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error(" Error creating page:", error);
    alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    setTimeout(() => {
      setCreatingPage(false);
    }, 500);
  }
}

  async function handleUpdatePage(updates: Partial<Page>) {
    if (!currentPage) return;

    try {
      const res = await fetch("/api/pages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentPage.id,
          ...updates,
        }),
      });

      if (res.ok) {
        const { page } = await res.json();
        setCurrentPage(page);
        setPages((prev) =>
          prev.map((p) => (p.id === page.id ? page : p))
        );
      }
    } catch (error) {
      console.error("Error updating page:", error);
    }
  }

  async function handleDeletePage(id: string) {
    if (!session?.user?.id) return;

    try {
      await fetch(`/api/pages?id=${id}`, { method: "DELETE" });
      setPages((prev) => prev.filter((p) => p.id !== id));

      // If deleting current page, redirect to workspace
      if (id === pageId) {
        router.push(`/workspace/${workspaceId}`);
      }
    } catch (error) {
      console.error("Error deleting page:", error);
    }
  }

  // Toggle favorite handler
  async function handleToggleFavorite(id: string, isFavorite: boolean) {
    try {
      await fetch("/api/pages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          isFavorite,
        }),
      });

      setPages((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isFavorite } : p))
      );

      if (currentPage?.id === id) {
        setCurrentPage((prev) => (prev ? { ...prev, isFavorite } : null));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  }

  // Restore page handler
  async function handleRestorePage(id: string) {
    if (!session) return;

    try {
      await fetch("/api/pages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          isArchived: false,
        }),
      });

      setPages((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isArchived: false } : p))
      );
    } catch (error) {
      console.error("Error restoring page:", error);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading page...</p>
        </div>
      </div>
    );
  }

  if (!session || !currentPage) return null;

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      {/* Top Nav */}
      <nav className="h-14 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between px-4 sm:px-6 z-30">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Home Button - Desktop */}
          <Link
            href={`/workspace/${workspaceId}`}
            className="hidden lg:flex p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            <Share className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Share</span>
          </button>

          {/* Mobile Share Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="sm:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
          >
            <Share className="w-5 h-5" />
          </button>

          {/* Export Menu */}
          {currentPage && <ExportMenu page={currentPage} />}

          <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 hidden sm:block" />

          {/* User Menu */}
          <UserMenu />
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            workspaceId={workspaceId}
            pages={pages}
            currentPageId={pageId}
            onCreatePage={() => setShowTemplates(true)}
            onDeletePage={handleDeletePage}
            onToggleFavorite={handleToggleFavorite}
            onRestorePage={handleRestorePage}
            creatingPage={creatingPage}
          />
        </div>

        {/* Mobile Sidebar */}
        {showMobileSidebar && (
          <div className="lg:hidden fixed inset-0 z-40">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowMobileSidebar(false)}
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-800 shadow-2xl"
            >
              {/* Mobile Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
                <Link
                  href={`/workspace/${workspaceId}`}
                  onClick={() => setShowMobileSidebar(false)}
                  className="flex items-center gap-2"
                >
                  <Home className="w-5 h-5 text-purple-600" />
                  <h2 className="font-bold text-gray-900 dark:text-white truncate">
                    {workspace?.name || "Workspace"}
                  </h2>
                </Link>
                <button
                  onClick={() => setShowMobileSidebar(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="h-[calc(100%-60px)]">
                <Sidebar
                  workspaceId={workspaceId}
                  pages={pages}
                  currentPageId={pageId}
                  onCreatePage={() => {
                    setShowTemplates(true);
                    setShowMobileSidebar(false);
                  }}
                  onDeletePage={handleDeletePage}
                  onToggleFavorite={handleToggleFavorite}
                  onRestorePage={handleRestorePage}
                  creatingPage={creatingPage}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Page Editor */}
        <div className="flex-1 bg-slate-950 overflow-hidden">
          <PageEditor page={currentPage} onUpdate={handleUpdatePage} />
        </div>
      </div>

      {/* Comments Section */}
      <CommentsSection pageId={pageId} workspaceId={workspaceId} />

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          workspaceId={workspaceId}
          workspaceName={workspace?.name || "Workspace"}
          currentUserId={session.user.id}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <PageTemplates
          onSelect={(template) => {
            if (!creatingPage) {
              handleCreatePage(undefined, template);
            }
          }}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
}