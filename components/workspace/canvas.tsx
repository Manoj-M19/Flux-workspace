"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ItemCard } from "./item-card";
import { InlineNoteCreator } from "./inline-note-creator";

interface CanvasProps {
  items: Array<{
    id: string;
    type: string;
    title: string;
    content?: string;
    completed: boolean;
    position_x: number;
    position_y: number;
    color?: string;
    images?: string[];
    priority?: string;
    dueDate?: string | Date;
    createdAt?: string;
    updatedAt?: string;
    workspaceId?: string;
    userId?: string;
  }>;
  onUpdateItem: (id: string, updates: any) => void;
  onDeleteItem: (id: string) => void;
  onCreateItem: (data: { 
    type: string; 
    title: string; 
    content: string; 
    images: string[]; 
    position: { x: number; y: number };
    priority?: string;
    dueDate?: string;
  }) => void;
}

export function Canvas({ items, onUpdateItem, onDeleteItem, onCreateItem }: CanvasProps) {
  const [creatorPosition, setCreatorPosition] = useState<{ x: number; y: number } | null>(null);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only create if clicking directly on canvas (not on items)
    const target = e.target as HTMLElement;
    if (
      target === e.currentTarget || 
      target.classList.contains('canvas-content') ||
      target.classList.contains('canvas-grid')
    ) {
      const rect = e.currentTarget.getBoundingClientRect();
      const scrollLeft = e.currentTarget.scrollLeft;
      const scrollTop = e.currentTarget.scrollTop;
      
      const x = Math.max(0, e.clientX - rect.left + scrollLeft);
      const y = Math.max(0, e.clientY - rect.top + scrollTop);
      
      setCreatorPosition({ x, y });
    }
  };

  const handleCreateNote = (data: { 
    type: string; 
    title: string; 
    content: string; 
    images: string[] 
  }) => {
    if (creatorPosition) {
      onCreateItem({
        ...data,
        position: creatorPosition,
      });
      setCreatorPosition(null);
    }
  };

  return (
    <div 
      className="relative w-full h-full overflow-auto bg-linear-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 cursor-crosshair"
      onClick={handleCanvasClick}
    >
      {/* Grid background */}
      <div 
        className="canvas-grid absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-linear(to right, rgba(229, 231, 235, 0.3) 1px, transparent 1px),
            linear-linear(to bottom, rgba(229, 231, 235, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }}
      />
      
      {/* Canvas content */}
      <div
        className="canvas-content relative p-12"
        style={{
          minWidth: "3000px",
          minHeight: "2000px",
          width: "max-content",
          height: "max-content",
        }}
      >
        {/* Items */}
        <AnimatePresence>
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onUpdate={onUpdateItem}
              onDelete={onDeleteItem}
            />
          ))}
        </AnimatePresence>

        {/* Inline Creator */}
        <AnimatePresence>
          {creatorPosition && (
            <InlineNoteCreator
              position={creatorPosition}
              onSave={handleCreateNote}
              onCancel={() => setCreatorPosition(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Hint */}
      {items.length === 0 && !creatorPosition && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Click anywhere to create
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Just like Notion - click and start typing
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <kbd className="px-2 py-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded text-xs">
                Click
              </kbd>
              <span>anywhere to add note</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}