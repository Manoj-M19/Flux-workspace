"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Trash2, GripVertical, Palette, Edit2, Save } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { RichTextDisplay } from "@/components/ui/rich-text-display";
import { ImageUploader } from "./image-uploader";
import { PriorityBadge } from "./priority-badge";
import { DueDateBadge } from "./due-date-badge";

interface ItemCardProps {
  item: {
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
  };
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
}

const colors = [
  { name: "purple", class: "from-purple-500 to-pink-500", bg: "bg-purple-50 dark:bg-purple-900/20", border: "border-purple-200 dark:border-purple-800" },
  { name: "blue", class: "from-blue-500 to-cyan-500", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-800" },
  { name: "green", class: "from-green-500 to-emerald-500", bg: "bg-green-50 dark:bg-green-900/20", border: "border-green-200 dark:border-green-800" },
  { name: "yellow", class: "from-yellow-500 to-orange-500", bg: "bg-yellow-50 dark:bg-yellow-900/20", border: "border-yellow-200 dark:border-yellow-800" },
  { name: "red", class: "from-red-500 to-pink-500", bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-200 dark:border-red-800" },
  { name: "gray", class: "from-gray-500 to-slate-500", bg: "bg-gray-50 dark:bg-slate-800", border: "border-gray-200 dark:border-gray-700" },
];

export function ItemCard({ item, onUpdate, onDelete }: ItemCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editTitle, setEditTitle] = useState(item.title);
  const [editContent, setEditContent] = useState(item.content || "");
  const [editImages, setEditImages] = useState(item.images || []);
  const [editPriority, setEditPriority] = useState(item.priority || "medium");
  const [editDueDate, setEditDueDate] = useState(
    item.dueDate ? new Date(item.dueDate).toISOString().split('T')[0] : ""
  );

  const currentColor = colors.find(c => c.name === item.color) || colors[0];

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
      <div className={`relative p-6 rounded-3xl border-2 ${currentColor.border} ${currentColor.bg} backdrop-blur-sm shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-purple-500/20 transition-all`}>
        {/* Drag Handle */}
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${currentColor.class} flex items-center justify-center text-xl shadow-lg`}>
              {typeEmojis[item.type as keyof typeof typeEmojis]}
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {item.type}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Color Picker */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full hover:bg-white/50 dark:hover:bg-black/20 text-gray-400 hover:text-purple-500 flex items-center justify-center transition-all"
              >
                <Palette className="w-4 h-4" />
              </motion.button>

              {showColorPicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-full right-0 mt-2 p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 flex gap-2 z-50"
                >
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => {
                        onUpdate(item.id, { color: color.name });
                        setShowColorPicker(false);
                      }}
                      className={`w-8 h-8 rounded-full bg-linear-to-br ${color.class} hover:scale-110 transition-transform ${currentColor.name === color.name ? "ring-2 ring-offset-2 ring-gray-400" : ""
                        }`}
                    />
                  ))}
                </motion.div>
              )}
            </div>

            {/* Edit Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsEditing(!isEditing)}
              className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 text-gray-400 hover:text-purple-500 flex items-center justify-center transition-all"
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            </motion.button>

            {/* Delete Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(item.id)}
              className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="flex items-start gap-3">
          {item.type === "task" && !isEditing && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdate(item.id, { completed: !item.completed })}
              className={`
                w-6 h-6 rounded-lg border-2 shrink-0 mt-0.5 transition-all flex items-center justify-center
                ${item.completed
                  ? `bg-linear-to-br ${currentColor.class} border-transparent`
                  : `border-gray-300 dark:border-gray-600 hover:${currentColor.border}`
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
            {isEditing ? (
              <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-purple-200 dark:border-purple-800 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Title"
                />

                <RichTextEditor
                  content={editContent}
                  onChange={setEditContent}
                  placeholder="Add your content with formatting..."
                  minHeight="120px"
                />

                {/* Task-specific fields */}
                {item.type === "task" && (
                  <>
                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Priority
                      </label>
                      <div className="flex gap-2">
                        {["high", "medium", "low"].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setEditPriority(p)}
                            className={`
                              flex-1 px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all
                              ${editPriority === p
                                ? p === "high"
                                  ? "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-600 dark:text-red-400"
                                  : p === "medium"
                                    ? "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500 text-yellow-600 dark:text-yellow-400"
                                    : "bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-400"
                                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                              }
                            `}
                          >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-purple-200 dark:border-purple-800 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </>
                )}

                <ImageUploader
                  images={editImages}
                  onImagesChange={setEditImages}
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onUpdate(item.id, {
                        title: editTitle,
                        content: editContent,
                        images: editImages,
                        ...(item.type === "task" && {
                          priority: editPriority,
                          dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
                        }),
                      });
                      setIsEditing(false);
                    }}
                    className="flex-1 px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditTitle(item.title);
                      setEditContent(item.content || "");
                      setEditImages(item.images || []);
                      setEditPriority(item.priority || "medium");
                      setEditDueDate(
                        item.dueDate ? new Date(item.dueDate).toISOString().split('T')[0] : ""
                      );
                      setIsEditing(false);
                    }}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3
                  className={`text-lg font-semibold mb-2 ${item.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"
                    }`}
                >
                  {item.title}
                </h3>

                {/* Priority & Due Date Badges */}
                {item.type === "task" && (
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {item.priority && (
                      <PriorityBadge priority={item.priority as "high" | "medium" | "low"} />
                    )}
                    {item.dueDate && (
                      <DueDateBadge dueDate={item.dueDate} />
                    )}
                  </div>
                )}

                {item.content && (
                  <RichTextDisplay content={item.content} />
                )}
              </>
            )}
          </div>
        </div>

        {/* Images Gallery */}
        {item.images && item.images.length > 0 && !isEditing && (
          <div className="mt-4">
            <div className={`grid ${item.images.length === 1 ? "grid-cols-1" :
                item.images.length === 2 ? "grid-cols-2" :
                  "grid-cols-2"
              } gap-2`}>
              {item.images.slice(0, 4).map((url, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-700 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(url, '_blank');
                  }}
                >
                  <img
                    src={url}
                    alt={`Image ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {idx === 3 && item.images!.length > 4 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold">
                      +{item.images!.length - 4}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={`mt-4 pt-4 border-t ${currentColor.border} flex items-center justify-between text-xs text-gray-500 dark:text-gray-400`}>
          <span>Drag to move</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600`} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}