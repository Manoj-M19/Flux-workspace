"use client";


import { Home,Share,Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Sidebar } from "@/components/workspace/sidebar";
import { PageEditor } from "@/components/workspace/page-editor";
import { UserMenu} from "@/components/ui/user-menu"

interface Page {
    id:string;
    title:string;
    icon?:string;
    content:string;
    parentId?:string;
    isFavorite:boolean;
    children?:Page[];
}

export default function PageView({
    params,
}: {
    params:Promise<{id:string;pageId:string}>
}) {
    const {data:session,status} = useSession();
    const router = useRouter();
    const {id:workspaceId,pageId} = use(params);

    const [pages,setPages] = useState<Page[]>([]);
    const [currentPage,setCurrentPage] = useState<Page |null>(null);
    const [loading,setLoading] = useState(true);

    useEffect(()=> {
        if(status ==="unauthenticated") {
            router.push("/")
        }
    },[status,router]);

    useEffect(()=> {
        async function fetchPages() {
            if(!session?.user?.id) {
                return;
            }

            try {
                const res = await fetch(`/api/pages?workspaceId=${workspaceId}`);
                const data = await res.json();
                setPages(data.pages || []);

                const page = data.pages?.find((p:Page) => p.id === pageId);
                setCurrentPage(page || null);
            } catch (error) {
                console.error("Error fetching pages:",error)
            } finally{
                setLoading(false);
            }
        } 

        if(session?.user?.id) {
            fetchPages()
        }
    },[session?.user?.id, workspaceId,pageId]);
  
    async function handleCreatePage(parentId?:string) {
         if(!session?.user?.id) return ;

         try {
            const res = await fetch('/api/pages',{
                method:'POST',
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    title:"Untitled",
                    workspaceId,
                    parentId:parentId || null,
                }),
            });

            if(res.ok) {
                const {page} = await res.json();
                setPages((prev) => [...prev,page]);
                router.push(`/workspace/${workspaceId}/page/${page.id}`);
            }
         } catch (error) {
            console.error("Error creating page:",error);
         }
    }

    async function handleUpdatePage(updates:{
        title?:string;
        icon?:string;
        content?:string;
    }) {
        if(!session?.user?.id || !currentPage) return;

       setCurrentPage((prev) => (prev? {...prev,...updates} : null));

       try {
        await fetch("/api/pages", {
            method:"PATCH",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                id:currentPage.id,
                ...updates,
            }),
        });
       } catch (error) {
        console.error("Error updating page:",error);
       }
    }

    async function handleDeletePage(id:string) {
         if(!session?.user?.id) return;

         try {
            await fetch(`/api/pages?id=${id}`,{
                method:'DELETE',
            });

            setPages((prev)=> prev.filter((p) => p.id !==id));

            if(id === pageId) {
                router.push(`/workspace/${workspaceId}`);
            }
         } catch (error) {
            console.error("Error deleting page:",error);
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

  if (!session || !currentPage) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Page not found</p>
          <Link
            href={`/workspace/${workspaceId}`}
            className="mt-4 text-purple-600 hover:underline"
          >
            Back to workspace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-slate-900">
      {/* Top Nav */}
      <nav className="h-14 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link
            href={`/workspace/${workspaceId}`}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300">
            <Share className="w-4 h-4" />
            <span className="text-sm font-medium">Share</span>
          </button>

          <div className="h-6 w-px bg-gray-200 dark:bg-slate-700" />

          <UserMenu />
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          workspaceId={workspaceId}
          pages={pages}
          currentPageId={pageId}
          onCreatePage={handleCreatePage}
          onDeletePage={handleDeletePage}
        />

        {/* Page Editor */}
        <div className="flex-1 bg-white dark:bg-slate-800">
          <PageEditor page={currentPage} onUpdate={handleUpdatePage} />
        </div>
      </div>
    </div>
  );
}