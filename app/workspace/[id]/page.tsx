"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Canvas } from "@/components/workspace/canvas";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Item {
  id: string;
  type: string;
  title: string;
  content?: string;
  completed: boolean;
  position_x: number;
  position_y: number;
  createdAt: string;
  updatedAt: string;
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
  }, [workspaceId]);


  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === "n" && !showForm && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setShowForm(true);
      }

      if (e.key === "Escape" && showForm) {
        setShowForm(false);
      }
    }

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showForm]);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch(`/api/items?workspaceId=${workspaceId}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (error) {
      console.error("Error fetching items:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function createItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItem.title.trim()) return;

    try {
      const randomX = Math.random() * 500 + 100;
      const randomY = Math.random() * 500 + 100;

      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newItem,
          workspaceId,
          userId: DEMO_USER_ID,
          position_x: randomX,
          position_y: randomY,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        
        // Optimistically add to UI
        setItems((prev) => [data.item, ...prev]);
        
        // Reset form
        setNewItem({ type: "note", title: "", content: "" });
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error creating item:", error);
    }
  }

  async function updateItem(id: string, updates: any) {
    try {
      // Optimistic update - update UI immediately
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );

      // Send to server
      const res = await fetch("/api/items", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!res.ok) {
        // Revert on error
        fetchItems();
      }
    } catch (error) {
      console.error("Error updating item:", error);
      // Revert on error
      fetchItems();
    }
  }

  async function deleteItem(id: string) {
    try {
      // Optimistic delete - remove from UI immediately
      setItems((prev) => prev.filter((item) => item.id !== id));

      // Send delete request
      await fetch(`/api/items?id=${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Error deleting item:", error);
      // Revert on error
      fetchItems();
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Main Canvas Area */}
      <main className="flex-1 overflow-hidden relative">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
              <p className="text-muted-foreground">Loading workspace...</p>
            </div>
          </div>
        ) : (
          <Canvas
            items={items}
            onUpdateItem={updateItem}
            onDeleteItem={deleteItem}
          />
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                <Plus className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-display font-light mb-2">
                Your canvas is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Click the + button to add your first item
              </p>
              <p className="text-sm text-muted-foreground">
                Or press <kbd className="px-2 py-1 bg-muted rounded text-xs">N</kbd> on your keyboard
              </p>
            </div>
          </motion.div>
        )}

        {/* Floating Add Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center focus-ring z-30 hover:shadow-xl transition-shadow"
          title="Add item (N)"
        >
          <Plus
            className={`w-6 h-6 transition-transform duration-200 ${
              showForm ? "rotate-45" : ""
            }`}
          />
        </motion.button>

        {/* Keyboard Hint (bottom left) */}
        {!showForm && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 left-8 text-xs text-muted-foreground flex items-center gap-2 pointer-events-none"
          >
            <kbd className="px-2 py-1 bg-muted rounded">N</kbd>
            <span>New item</span>
            <span className="mx-2">•</span>
            <kbd className="px-2 py-1 bg-muted rounded">ESC</kbd>
            <span>Close</span>
          </motion.div>
        )}

        {/* Create Item Modal */}
        <AnimatePresence>
          {showForm && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowForm(false)}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
              >
                <form
                  onSubmit={createItem}
                  className="p-6 bg-background border-2 border-border rounded-2xl shadow-2xl"
                >
                  <h2 className="text-2xl font-display font-medium mb-6">
                    Create New Item
                  </h2>

                  <div className="space-y-4">
                    {/* Type selector */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Type
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: "note", label: "📝 Note" },
                          { value: "task", label: "✅ Task" },
                          { value: "link", label: "🔗 Link" },
                        ].map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() =>
                              setNewItem({ ...newItem, type: type.value })
                            }
                            className={`
                              px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium
                              ${
                                newItem.type === type.value
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-border/50"
                              }
                            `}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Title input */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newItem.title}
                        onChange={(e) =>
                          setNewItem({ ...newItem, title: e.target.value })
                        }
                        placeholder="Enter a title..."
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                        required
                        autoFocus
                      />
                    </div>

                    {/* Content textarea */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Content
                      </label>
                      <textarea
                        value={newItem.content}
                        onChange={(e) =>
                          setNewItem({ ...newItem, content: e.target.value })
                        }
                        placeholder="Add some details..."
                        rows={4}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                      >
                        Create
                      </button>
                    </div>
                  </div>

                  {/* Keyboard hint */}
                  <p className="mt-4 text-xs text-muted-foreground text-center">
                    Press <kbd className="px-1.5 py-0.5 bg-muted rounded">ESC</kbd> to cancel
                  </p>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}