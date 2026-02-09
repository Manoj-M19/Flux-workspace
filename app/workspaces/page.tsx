"use client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion";
import { UserMenu } from "@/components/ui/user-menu";
import { 
  Plus, 
  Trash2, 
  ArrowRight,
  Sparkles,
  Clock,
  Users,
  Search,
  Grid3X3,
  List,
  Star,

} from "lucide-react";
import Link from "next/link";
 

interface Workspace {
  id:string
  name:string
  slug:string
  createdAt:string
}

export default function WorkspacesPage() {
  const router = useRouter()
  const {data:session,status} = useSession();

  const [workspaces,setWorkspaces] = useState<Workspace[]>([]);
  const [loading,setLoading] = useState(true);
  const [newWorkspaceName,setNewWorkspaceName] = useState("");
  const [showCreateModal,setShowCreateModal] = useState(false)
  const [viewMode,setViewMode] = useState<"grid" |"list">("grid");
  const [searchQuery,setSearchQuery] = useState("");

  useEffect(()=> {
    if(status === "unauthenticated") {
      router.push("/")
    }
  },[status,router]);

  useEffect(()=> {
    if(session?.user?.id) {
      fetchWorkspaces();
    }
  },[session])

async function fetchWorkspaces() {
  if(!session?.user?.id) return;

  setLoading(true);
  try {
    const res = await fetch(`/api/workspaces?userId=${session.user.id}`);
    const data = await res.json();
    setWorkspaces(data.workspaces || []);
  } catch (error) {
    console.error("Error fetchig workspaces:",error)
  } finally {
    setLoading(false);
  }
}

async function createWorkspace(e:React.FormEvent) {
  e.preventDefault();
  if(!newWorkspaceName.trim() || !session?.user?.id) return;

  try {
    const res = await fetch("/api/workspaces", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        name:newWorkspaceName,
        userId:session.user.id,
      }),
    });

    if(res.ok) {
      setNewWorkspaceName("")
      setShowCreateModal(false)
      fetchWorkspaces();

    }
  } catch (error){
    console.error("Error creating workspace:",error);
  }
}

async function deleteWorkspace(id:string,name:string) {
  if(!confirm(`Delete"${name}"? All items inside will be deleted too.`)) return;

  try{
    await fetch(`/api/workspaces?id=${id}`,{method:"DELETE"});
    fetchWorkspaces();
  } catch (error) {
    console.error("Error deleting workspace:",error);
  }
}

const filteredWorkspaces = workspaces.filter(w=>
  w.name.toLowerCase().includes(searchQuery.toLowerCase())
);

 if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFF] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Loading your workspaces...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFF]">
      {/* linear background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-purple-100/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            {/* Left: Title */}
            <div>
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors mb-2">
                ← Back to home
              </Link>
              <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your Workspaces
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {session.user.name}! 👋
              </p>
            </div>

        
<div className="flex items-center gap-3">
  <UserMenu />
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => setShowCreateModal(true)}
    className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-medium rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
  >
    <Plus className="w-5 h-5" />
    New Workspace
  </motion.button>
</div>

          <div className="flex items-center gap-4">

            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search workspaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-purple-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-white/80 backdrop-blur-sm border border-purple-100 rounded-full">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-full transition-all ${
                  viewMode === "grid" 
                    ? "bg-purple-100 text-purple-600" 
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-full transition-all ${
                  viewMode === "list" 
                    ? "bg-purple-100 text-purple-600" 
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>


      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {filteredWorkspaces.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {searchQuery ? "No workspaces found" : "Create your first workspace"}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? `No workspaces match "${searchQuery}"`
                : "Get started by creating a new workspace to organize your ideas and collaborate with your team."
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-purple-500/50 transition-all hover:scale-105 inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Workspace
              </button>
            )}
          </motion.div>
        ) : (
          <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            <AnimatePresence mode="popLayout">
              {filteredWorkspaces.map((workspace, index) => (
                <motion.div
                  key={workspace.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                  className="group"
                >
                  <div className="relative h-full">
    
                    <Link
                      href={`/workspace/${workspace.id}`}
                      className="block h-full p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-100/50 rounded-3xl hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 transition-all group-hover:-translate-y-1"
                    >
                  
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                   
                            }}
                            className="p-2 hover:bg-purple-100 rounded-full transition-colors"
                          >
                            <Star className="w-4 h-4 text-gray-400 hover:text-yellow-500" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              deleteWorkspace(workspace.id, workspace.name);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 rounded-full transition-all"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                      </div>

            
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {workspace.name}
                      </h3>

     
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(workspace.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          1 member
                        </div>
                      </div>

         
                      <div className="mt-6 flex items-center text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-all">
                        Open workspace
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>


      <AnimatePresence>
        {showCreateModal && (
          <>
         
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

         
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
            >
              <form
                onSubmit={createWorkspace}
                className="p-8 bg-white rounded-3xl shadow-2xl border-2 border-purple-100"
              >
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-3xl font-bold mb-2">
                  Create Workspace
                </h2>
                <p className="text-gray-600 mb-6">
                  Give your workspace a name to get started
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Workspace Name
                    </label>
                    <input
                      type="text"
                      value={newWorkspaceName}
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                      placeholder="e.g., Product Design"
                      className="w-full px-4 py-3 border-2 border-purple-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      autoFocus
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
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
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}