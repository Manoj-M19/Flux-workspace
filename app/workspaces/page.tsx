"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

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
      setWorkspaces(data.workspaces);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
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
    if (!confirm("Delete this workspace?")) return;

    try {
      await fetch(`/api/workspaces?id=${id}`, { method: "DELETE" });
      fetchWorkspaces();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  }
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-light tracking-tight mb-8">
          Your Workspaces
        </h1>

        <form onSubmit={createWorkspace} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              placeholder="New workspace name..."
              className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create
            </button>
          </div>
        </form>

        <div className="grid gap-4">
          {workspaces.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No workspaces yet. Create one above!
            </p>
          ) : (
            workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className="p-6 border border-border rounded-lg hover:border-foreground/20 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <Link href={`/workspace/${workspace.id}`} className="flex-1">
                    <h2 className="text-xl font-medium mb-1">
                      {workspace.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {workspace.slug}
                    </p>
                  </Link>
                  <button
                    onClick={() => deleteWorkspace(workspace.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
