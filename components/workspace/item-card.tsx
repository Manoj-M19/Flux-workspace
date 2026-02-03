"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface ItemCardProps {
  item: {
    id: string;
    type: string;
    title: string;
    content?: string;
    completed: boolean;
    position_x: number;
    position_y: number;
  };
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
}

export function ItemCard({ item, onUpdate, onDelete }: ItemCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(e, info) => {
        setIsDragging(false);
        const newX = item.position_x + info.offset.x;
        const newY = item.position_y + info.offset.y;
        onUpdate(item.id, {
          position_x: newX,
          position_y: newY,
        });
      }}
      whileHover={{ scale: isDragging ? 1 : 1.02 }}
      style={{
        position: "absolute",
        left: item.position_x,
        top: item.position_y,
        width: 320,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      className={`
        select-none
        ${isDragging ? "z-50" : "z-10"}
      `}
    >
      <div className="p-6 rounded-2xl border-2 border-border/50 bg-background shadow-lg hover:border-border transition-colors">
        <div className="flex items-start justify-between mb-4">
          <span
            className={`
            px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider
            ${
              item.type === "note"
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                : item.type === "task"
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
            }
          `}
          >
            {item.type}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(item.id)}
            className="w-6 h-6 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-500 flex items-center justify-center transition-colors"
          >
            ×
          </motion.button>
        </div>
        <div className="flex items-start gap-3">
          {item.type === "task" && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdate(item.id, { completed: !item.completed })}
              className={`
                w-5 h-5 rounded-md border-2 shrink-0 mt-0.5 transition-colors
                ${
                  item.completed
                    ? "bg-green-500 border-green-500"
                    : "border-border hover:border-primary"
                }
              `}
            >
              {item.completed && (
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full text-white"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M4 10l4 4 8-8" />
                </motion.svg>
              )}
            </motion.button>
          )}
          <div className="flex-1">
            <h3
              className={`text-lg font-medium mb-2 ${
                item.completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {item.title}
            </h3>
            {item.content && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.content}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <span>Drag to move</span>
          <div className="flex gap-0.5">
            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
