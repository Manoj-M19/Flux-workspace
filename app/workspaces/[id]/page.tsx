"use client";
import { Navbar } from "@/components/layout/navbar";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Item {
  id: string;
  type: string;
  title: string;
  content?: string;
  completed: boolean;
}

export default function WorkspacePage() {
  const params = useParams();
  const workspaceId = params.id as string;

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [newItem, setNewItem] = useState({
    type: "note",
    title: "",
    content: "",
  });

  const DEMO_USER_ID = "demo-user";

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch(`/api/items?workspaceId=${workspaceId}`);
      const data = await res.json();
      setItems(data.items);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItem.title.trim()) return;

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newItem,
          workspaceId,
          userId: DEMO_USER_ID,
        }),
      });

      if (res.ok) {
        setNewItem({ type: "note", title: "", content: "" });
        setShowForm(false);
        fetchItems();
      }
    } catch (error) {
      console.error("Error creating items:", error);
    }
  }

  async function deleteItem(id: string) {
    try {
      await fetch(`/api/items?id=${id}`, { method: "DELETE" });
      fetchItems();
    } catch (error) {
      console.error("Error deleting Item:", error);
    }
  }

  async function toggleComplete(item: Item) {
    try {
      await fetch("/api/items", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          completed: !item.completed,
        }),
      });
      fetchItems();
    } catch (error) {
      console.error("Error updating item:", error);
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
      <Navbar/>
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-light tracking-tight">Workspace</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {showForm ? "Cancel" : "+ Add Item"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={createItem}
            className="mb-8 p-6 border border-border rounded-lg"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={newItem.type}
                  onChange={(e) =>
                    setNewItem({ ...newItem, type: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="note">📝 Note</option>
                  <option value="task">✅ Task</option>
                  <option value="link">🔗 Link</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) =>
                    setNewItem({ ...newItem, title: e.target.value })
                  }
                  placeholder="Enter title..."
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Content
                </label>
                <textarea
                  value={newItem.content}
                  onChange={(e) =>
                    setNewItem({ ...newItem, content: e.target.value })
                  }
                  placeholder="Enter content..."
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Item
              </button>
            </div>
          </form>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground py-12">
              No items yet. Click "Add Item" to create one!
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-6 border border-border rounded-lg hover:border-foreground/20 transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 text-xs rounded-full bg-muted">
                    {item.type === "note" && "📝"}
                    {item.type === "task" && "✅"}
                    {item.type === "link" && "🔗"}
                    {" " + item.type}
                  </span>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                  >
                    ×
                  </button>
                </div>

                <div className="flex items-start gap-3">
                  {item.type === "task" && (
                    <button
                      onClick={() => toggleComplete(item)}
                      className={`w-5 h-5 rounded border-2 shrink-0 mt-0.5 transition-colors ${
                        item.completed
                          ? "bg-primary border-primary"
                          : "border-border"
                      }`}
                    />
                  )}
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-medium mb-2 ${item.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {item.title}
                    </h3>
                    {item.content && (
                      <p className="text-sm text-muted-foreground">
                        {item.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
