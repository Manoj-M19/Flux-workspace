"use client";

import { useRef, useEffect } from "react";

interface LTRTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  autoFocus?: boolean;
  rows?: number;
  style?: React.CSSProperties;
}

export function LTRTextarea({
  value,
  onChange,
  placeholder = "",
  onKeyDown,
  autoFocus = false,
  rows = 3,
  style = {},
}: LTRTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current && autoFocus) {
      ref.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (ref.current) {
      ref.current.dir = "ltr";
      ref.current.style.direction = "ltr";
      ref.current.style.textAlign = "left";
      ref.current.style.unicodeBidi = "normal";
    }
  });

  return (
    <div
      dir="ltr"
      style={{
        direction: "ltr",
        textAlign: "left",
        unicodeBidi: "normal",
      }}
    >
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        rows={rows}
        dir="ltr"
        lang="en"
        style={{
          direction: "ltr",
          textAlign: "left",
          unicodeBidi: "normal",
          writingMode: "horizontal-tb",
          ...style,
        }}
      />
    </div>
  );
}