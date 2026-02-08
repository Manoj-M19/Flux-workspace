"use client";

import { Canvas } from "@/components/workspace/canvas";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Plus, Search, Settings, Sparkles, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CommandPalette } from "@/components/ui/command-palette";

interface Item {
  id:string;
  type:string;
  title:string;
  content?:string;
  completed:boolean;
  position_x:number;
  position_y:number;
  createdAt:string;
  updatedAt:string;
}

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const {data:session,status} = useSession();
  const workspaceId = params.id as string;

  const [items,setItems] = useState<Item[]>([]);
  const [loading,setLoading] = useState(true);
  const [showForm,setShowForm] = useState(false);
  const [workspaceName,setWorkspaceName] = useState("Workspace");
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const [newItem,setNewItem] = useState({
    type:"note",
    title:"",
    content:"",
  });

  useEffect(()=> {
    if(status === "unauthenticated"){
      router.push("/")
    }
  },[status,router]);

  useEffect(()=> {
    if(session?.user?.id) {
      fetchItems();
      fetchWorkspaceName();
    }
  },[workspaceId,session]);

  useEffect(()=> {
    function handlekeyPress(e:KeyboardEvent) {
      if(e.key ==="n" && !showForm && document.activeElement?.tagName !=="INPUT" && document.activeElement?.tagName !=="TEXTAREA") {
        e.preventDefault();
        setShowForm(true);
      }

      if(e.key === "Escape" && showForm) {
        setShowForm(false);
      }
    }

    window.addEventListener("keydown",handlekeyPress);
    return () => window.removeEventListener("keydown",handlekeyPress);
  },[showForm]);

  useEffect(()=> {
    function handlekeyPress(e:KeyboardEvent) {
      if((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCommandPalette(true)
      }
    }
    window.addEventListener("keydown",handlekeyPress);
    return () => window.removeEventListener("keydown",handlekeyPress)
  })

  function handleCreateFromPalette(type:string) {
    setNewItem({ ...newItem,type});
    setShowForm(true);
  }

  async function fetchWorkspaceName() {
    try {
      const res = await fetch(`/api/workspaces?userId=${session?.user?.id}`);
      const data = await res.json();
      const workspace = data.workspaces?.find((w:any) => w.id === workspaceId);
      if (workspace) {
         setWorkspaceName(workspace.name);
      }
    } catch (error) {
      console.error("Error fetching workspace name:",error);
    }
  }

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch(`/api/items?workspaceId=${workspaceId}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (error) {
      console.error("Error fetching items:",error)
    } finally {
      setLoading(false);
    }
  }

  async function createItem(e:React.FormEvent) {
    e.preventDefault();
    if(!newItem.title.trim() || !session?.user?.id) return;

    try {
      const randomX = Math.random() * 500 +100;
      const randomY = Math.random() * 500 + 100;

      const res = await fetch("/api/items", {
        method:'POST',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          ...newItem,
          workspaceId,
          userId:session.user.id,
          position_x:randomX,
          position_y:randomY,
        }),
      });

      if(res.ok) {
        const data = await res.json();
        setItems((prev)=> [data.item,...prev]);
        setNewItem({type:"note",title:"",content:""});
        setShowForm(false);
      }
    } catch(error) {
      console.error("Error creating item:",error);
    }
  } 

  async function updateItem(id:string,updates:any) {
    try {
      setItems((prev)=>
        prev.map((item)=> (item.id === id? {...item,...updates}:item))
      );

      const res = await fetch('/api/items',{
        method:"PATCH",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          id,
          ...updates
        }),
      });
      if(!res.ok) {
        fetchItems();
      }
    } catch(error) {
      console.error("Error updating item:", error);
      fetchItems();
    }
  }

  async function deleteItem(id:string){
    try {
      setItems((prev)=> prev.filter((item) => item.id !== id))
      await fetch(`/api/items?id=${id}`,{method:"DELETE"})
    } catch (error) {
      console.error("Error deleting item:",error)
      fetchItems();
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="h-screen bg-[#FAFAFF] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-[#FAFAFF]">
      {/* Top Navigation */}
      <nav className="relative z-50 border-b border-purple-100/50 bg-white/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Breadcrumb & Title */}
            <div className="flex items-center gap-4">
              <Link
                href="/workspaces"
                className="p-2 hover:bg-purple-100 rounded-xl transition-colors"
                title="Back to workspaces"
              >
                <Home className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="h-6 w-px bg-purple-200" />
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {workspaceName}
                  </h1>
                </div>
              </div>
            </div>

            {/* Center: Search */}
            <div className="hidden md:block flex-1 max-w-md mx-12">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search in workspace..."
                  className="w-full pl-10 pr-4 py-2 bg-white/80 border border-purple-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <button
                className="hidden sm:flex items-center gap-2 px-4 py-2 hover:bg-purple-100 rounded-xl transition-colors text-gray-700"
              >
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Share</span>
              </button>
              <button className="p-2 hover:bg-purple-100 rounded-xl transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Canvas Area */}
      <main className="flex-1 overflow-hidden relative">
        {/* Linear background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-200/10 rounded-full blur-3xl" />
        </div>

        {items.length === 0 && !loading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Your canvas is empty
              </h2>
              <p className="text-gray-600 mb-6 max-w-sm">
                Click the + button to add your first item or press{" "}
                <kbd className="px-2 py-1 bg-white border border-purple-200 rounded text-sm font-mono">
                  N
                </kbd>
              </p>
            </div>
          </motion.div>
        ) : (
          <Canvas items={items} onUpdateItem={updateItem} onDeleteItem={deleteItem} />
        )}

        {/* Floating Add Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowForm(!showForm)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl shadow-purple-500/50 flex items-center justify-center z-30 hover:shadow-purple-500/70 transition-all"
          title="Add item (N)"
        >
          <Plus
            className={`w-7 h-7 transition-transform duration-200 ${
              showForm ? "rotate-45" : ""
            }`}
          />
        </motion.button>

        {/* Keyboard Hints */}
        {!showForm && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 left-8 flex items-center gap-4 text-xs text-gray-500 pointer-events-none"
          >
            <div className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm border border-purple-100 rounded-full">
              <kbd className="px-2 py-1 bg-purple-100 text-purple-600 rounded font-mono">N</kbd>
              <span>New item</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm border border-purple-100 rounded-full">
              <kbd className="px-2 py-1 bg-purple-100 text-purple-600 rounded font-mono">ESC</kbd>
              <span>Close</span>
            </div>
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
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
              >
                <form
                  onSubmit={createItem}
                  className="p-8 bg-white rounded-3xl shadow-2xl border-2 border-purple-100"
                >
                  <h2 className="text-3xl font-bold mb-6">Create New Item</h2>

                  <div className="space-y-6">
                    {/* Type selector */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Type
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: "note", emoji: "📝", label: "Note" },
                          { value: "task", emoji: "✅", label: "Task" },
                          { value: "link", emoji: "🔗", label: "Link" },
                        ].map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() =>
                              setNewItem({ ...newItem, type: type.value })
                            }
                            className={`
                              p-4 rounded-2xl border-2 transition-all text-center
                              ${
                                newItem.type === type.value
                                  ? "border-purple-500 bg-purple-50 shadow-lg shadow-purple-500/20"
                                  : "border-purple-100 hover:border-purple-300 hover:bg-purple-50/50"
                              }
                            `}
                          >
                            <div className="text-3xl mb-2">{type.emoji}</div>
                            <div className="text-sm font-medium text-gray-700">
                              {type.label}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Title input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newItem.title}
                        onChange={(e) =>
                          setNewItem({ ...newItem, title: e.target.value })
                        }
                        placeholder="Enter a title..."
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        required
                        autoFocus
                      />
                    </div>

                    {/* Content textarea */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      <textarea
                        value={newItem.content}
                        onChange={(e) =>
                          setNewItem({ ...newItem, content: e.target.value })
                        }
                        placeholder="Add some details..."
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-medium rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105"
                      >
                        Create
                      </button>
                    </div>
                  </div>

                  {/* Keyboard hint */}
                  <p className="mt-4 text-xs text-gray-500 text-center">
                    Press{" "}
                    <kbd className="px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded font-mono">
                      ESC
                    </kbd>{" "}
                    to cancel
                  </p>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
      {/* Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onCreateItem={handleCreateFromPalette}
      />
    </div>
  );
}
