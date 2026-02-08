"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Trash2, GripVertical } from "lucide-react";

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

  const typeColors = {
    note: "from-blue-500 to-cyan-500",
    task: "from-green-500 to-emerald-500",
    link: "from-purple-500 to-pink-500",
  };

  const typeEmojis = {
    note: "📝",
    task: "✅",
    link: "🔗",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
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
        select-none group
        ${isDragging ? "z-50" : "z-10"}
      `}
    >
      <div className="relative p-6 rounded-3xl border-2 border-purple-100/50 bg-white/90 backdrop-blur-sm shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-300 transition-all">
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl bg-linear-to-br ${typeColors[item.type as keyof typeof typeColors]} flex items-center justify-center text-xl shadow-lg`}
            >
              {typeEmojis[item.type as keyof typeof typeEmojis]}
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {item.type}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(item.id)}
            className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="flex items-start gap-3">
          {item.type === "task" && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdate(item.id, { completed: !item.completed })}
              className={`
                w-6 h-6 rounded-lg border-2 shrink-0 mt-0.5 transition-all flex items-center justify-center
                ${
                  item.completed
                    ? "bg-linear-to-br from-green-500 to-emerald-500 border-green-500"
                    : "border-purple-300 hover:border-purple-500"
                }
              `}
            >
              {item.completed && (
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-4 h-4 text-white"
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
              className={`text-lg font-semibold mb-2 ${
                item.completed ? "line-through text-gray-400" : "text-gray-900"
              }`}
            >
              {item.title}
            </h3>
            {item.content && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.content}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-purple-100 flex items-center justify-between text-xs text-gray-500">
          <span>Drag to move</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-purple-300" />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
