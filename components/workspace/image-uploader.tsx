"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUploader({
  images,
  onImagesChange,
  maxImages = 5
}: ImageUploaderProps) {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  function addImageFromUrl() {
    if (!imageUrl.trim()) return;

    if (images.length >= maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    try {
      new URL(imageUrl);
      onImagesChange([...images, imageUrl]);
      setImageUrl("");
      setShowUrlInput(false);
    } catch {
      alert("Please enter a valid URL");
    }
  }

  function removeImage(url: string) {
    onImagesChange(images.filter((img) => img !== url));
  }

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          <AnimatePresence>
            {images.map((url, index) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-700"
              >
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/400x400?text=Invalid+Image";
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {images.length < maxImages && (
        <div>
          {showUrlInput ? (
            <div className="space-y-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addImageFromUrl();
                  }
                  if (e.key === "Escape") {
                    setShowUrlInput(false);
                    setImageUrl("");
                  }
                }}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3 py-2 border-2 border-purple-200 dark:border-purple-800 dark:bg-slate-700 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addImageFromUrl}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  Add Image
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUrlInput(false);
                    setImageUrl("");
                  }}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl transition-all hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/10"
            >
              <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                Add image from URL
              </p>
              <p className="text-xs text-gray-500">
                {maxImages - images.length} remaining
              </p>
            </button>
          )}
        </div>
      )}
    </div>
  );
}