"use client";

import Link from "next/link";
import { Search, Grid3x3, Settings, Home } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary group-hover:scale-105 transition-transform" />
            <span className="font-display font-medium text-lg">Flux</span>
          </Link>

          <div className="flex-1 max-w-md mx-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search workspace..."
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border/50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/workspaces"
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Workspaces"
            >
              <Home className="w-5 h-5" />
            </Link>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
