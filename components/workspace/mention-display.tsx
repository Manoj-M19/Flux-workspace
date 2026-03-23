"use client";

interface MentionDisplayProps {
  content: string;
}

export function MentionDisplay({ content }: MentionDisplayProps) {
  // Parse mentions from content
  const parts = content.split(/(@[\w\s]+)/g);

  return (
    <span className="whitespace-pre-wrap wrap-break-words">
      {parts.map((part, index) => {
        if (part.startsWith("@")) {
          return (
            <span
              key={index}
              className="text-purple-500 dark:text-purple-400 font-semibold bg-purple-50 dark:bg-purple-900/30 px-1 py-0.5 rounded"
            >
              {part}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}