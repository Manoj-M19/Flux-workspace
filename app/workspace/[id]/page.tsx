"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Home, FileText, Clock } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/workspace/sidebar";
import { PageTemplates, type Template } from "@/components/workspace/page-templates";
import { UserMenu } from "@/components/ui/user-menu";

interface Page {
  id: string;
  title: string;
  icon?: string;
  content: string;
  parentId: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  children?: Page[];
}

export default function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id: workspaceId } = use(params);

  const [pages, setPages] = useState<Page[]>([]);
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [creatingPage, setCreatingPage] = useState(false);

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
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data = await res.json();
        const found = data.workspaces?.find((w: any) => w.id === workspaceId);
        
        if (found) {
          setWorkspace(found);
        }
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
      setLoading(true);

      try {
        const res = await fetch(
          `/api/pages?workspaceId=${workspaceId}&includeArchived=true`
        );
        
        if (!res.ok) throw new Error("Failed to fetch pages");
        
        const data = await res.json();
        setPages(data.pages || []);
      } catch (error) {
        console.error("Error fetching pages:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user?.id) {
      fetchPages();
    }
  }, [session?.user?.id, workspaceId]);

  async function handleCreatePage(template?: Template) {
    if (!session?.user?.id || creatingPage) {
      return;
    }

    setCreatingPage(true);

    try {
      const pageData = {
        title: template?.name || "Untitled",
        icon: template?.emoji || "📝",
        content: template?.content || "",
        workspaceId,
        parentId: null,
      };

      const res = await fetch('/api/pages', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageData),
      });

      if (res.ok) {
        const { page } = await res.json();
        setPages((prev) => [...prev, page]);
        setShowTemplates(false);
        router.push(`/workspace/${workspaceId}/page/${page.id}`);
      }
    } catch (error) {
      console.error("Error creating page:", error);
    } finally {
      setTimeout(() => setCreatingPage(false), 500);
    }
  }

  async function handleDeletePage(id: string) {
    try {
      await fetch(`/api/pages?id=${id}`, { method: "DELETE" });
      setPages((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting page:", error);
    }
  }

  async function handleToggleFavorite(id: string, isFavorite: boolean) {
    try {
      await fetch("/api/pages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isFavorite }),
      });

      setPages((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isFavorite } : p))
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  }

  async function handleRestorePage(id: string) {
    try {
      await fetch("/api/pages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isArchived: false }),
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
          <p className="text-gray-600 dark:text-gray-400">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const recentPages = [...pages]
    .filter((p) => !p.isArchived)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      {/* Top Nav */}
      <nav className="h-14 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{workspace?.icon || "✨"}</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {workspace?.name || "Workspace"}
            </span>
          </div>
        </div>

        <UserMenu />
      </nav>

      {/* Main */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          workspaceId={workspaceId}
          pages={pages}
          currentPageId={undefined}
          onCreatePage={() => setShowTemplates(true)}
          onDeletePage={handleDeletePage}
          onToggleFavorite={handleToggleFavorite}
          onRestorePage={handleRestorePage}
          creatingPage={creatingPage}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-800">
          <div className="max-w-4xl mx-auto px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Header */}
              <div className="mb-12">
                <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  Welcome back!
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  {pages.filter((p) => !p.isArchived).length === 0
                    ? "Create your first page to get started"
                    : `You have ${pages.filter((p) => !p.isArchived).length} page${
                        pages.filter((p) => !p.isArchived).length !== 1 ? "s" : ""
                      } in this workspace`}
                </p>
              </div>

              {/* Create Page Card */}
              <div className="mb-12">
                <button
                  onClick={() => setShowTemplates(true)}
                  disabled={creatingPage}
                  className="w-full group p-8 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-3xl hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {creatingPage ? "Creating..." : "Create New Page"}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Start from a template or blank page
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Recent Pages */}
              {recentPages.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Recent Pages
                    </h2>
                  </div>

                  <div className="space-y-2">
                    {recentPages.map((page) => (
                      <Link
                        key={page.id}
                        href={`/workspace/${workspaceId}/page/${page.id}`}
                        className="block p-4 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-2xl transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{page.icon || "📝"}</span>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {page.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Last edited {new Date(page.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <FileText className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <PageTemplates
          onSelect={(template) => {
            if (!creatingPage) {
              handleCreatePage(template);
            }
          }}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
}