"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ArrowRight } from "lucide-react";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  const DEMO_USER_ID = "demo-user";

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  async function fetchWorkspaces() {
    setLoading(true);
    try {
      const res = await fetch(`/api/workspaces?userId=${DEMO_USER_ID}`);
      const data = await res.json();
      setWorkspaces(data.workspaces || []);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      setWorkspaces([]);
    } finally {
      setLoading(false);
    }
  }

  async function createWorkspace(e: React.FormEvent) {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newWorkspaceName,
          userId: DEMO_USER_ID,
        }),
      });

      if (res.ok) {
        setNewWorkspaceName("");
        fetchWorkspaces();
      }
    } catch (error) {
      console.error("Error creating workspace:", error);
    }
  }

  async function deleteWorkspace(id: string) {
    if (
      !confirm("Delete this workspace? All items inside will be deleted too.")
    )
      return;

    try {
      await fetch(`/api/workspaces?id=${id}`, { method: "DELETE" });
      fetchWorkspaces();
    } catch (error) {
      console.error("Error deleting workspace:", error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-muted-foreground">Loading workspaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            ← Back to home
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-display font-light tracking-tight"
          >
            Your Workspaces
          </motion.h1>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={createWorkspace}
          className="mb-12"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              placeholder="New workspace name..."
              className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create
            </motion.button>
          </div>
        </motion.form>

        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {workspaces.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-display font-light mb-2">
                  No workspaces yet
                </h2>
                <p className="text-muted-foreground">
                  Create your first workspace above to get started
                </p>
              </motion.div>
            ) : (
              workspaces.map((workspace, index) => (
                <motion.div
                  key={workspace.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <div className="p-6 border-2 border-border/50 rounded-2xl hover:border-border hover:shadow-lg transition-all group">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/workspace/${workspace.id}`}
                        className="flex-1 flex items-center justify-between group/link"
                      >
                        <div>
                          <h2 className="text-2xl font-medium mb-2 group-hover/link:text-primary transition-colors">
                            {workspace.name}
                          </h2>
                          <p className="text-sm text-muted-foreground font-mono">
                            {workspace.slug}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-1 transition-all" />
                      </Link>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteWorkspace(workspace.id)}
                        className="ml-4 opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
