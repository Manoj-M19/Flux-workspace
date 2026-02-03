"use client";

import { AnimatePresence } from "framer-motion";
import { ItemCard } from "./item-card";

interface CanvasProps {
  items: any[];
  onUpdateItem: (id: string, updates: any) => void;
  onDeleteItem: (id: string) => void;
}

export function Canvas({ items, onUpdateItem, onDeleteItem }: CanvasProps) {
  return (
    <div className="relative w-full h-full overflow-auto grid-bg">
      <div
        className="relative p-12"
        style={{
          minWidth: "2000px",
          minHeight: "2000px",
          width: "max-content",
          height: "max-content",
        }}
      >
        <AnimatePresence>
          {items.map((item) => [
            <ItemCard
              key={item.id}
              item={item}
              onUpdate={onUpdateItem}
              onDelete={onDeleteItem}
            />,
          ])}
        </AnimatePresence>
      </div>
    </div>
  );
}
