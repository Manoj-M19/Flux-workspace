"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import { useState } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link2,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Sparkles,
} from "lucide-react";
import { AIMenu } from "@/components/workspace/ai-menu";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start typing...",
  minHeight = "150px",
}: RichTextEditorProps) {
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [aiMenuPosition, setAIMenuPosition] = useState({ x: 0, y: 0 });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-purple-500 underline cursor-pointer",
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none prose-invert max-w-none",
        style: `min-height: ${minHeight};`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-lg transition-all hover:bg-gray-200 dark:hover:bg-gray-700 ${active
          ? "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300"
          : "text-gray-700 dark:text-gray-300"
        }`}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
      {/* Toolbar */}
      <div className="border-b border-gray-300 dark:border-gray-700 p-2 bg-gray-50 dark:bg-slate-800 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
            title="Code"
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

        {/* Headings */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            active={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

        {/* Lists */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

        {/* Alignment */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

        {/* More Actions */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => {
              const url = window.prompt("Enter URL:");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            active={editor.isActive("link")}
            title="Add Link"
          >
            <Link2 className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() =>
              editor.chain().focus().setHorizontalRule().run()
            }
            title="Horizontal Line"
          >
            <Minus className="w-4 h-4" />
          </ToolbarButton>

          {/* Color Picker */}
          <div className="relative group">
            <button
              type="button"
              className="p-2 rounded-lg transition-all hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              title="Text Color"
            >
              <Palette className="w-4 h-4" />
            </button>
            <div className="hidden group-hover:block absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 shadow-lg z-10">
              <div className="grid grid-cols-5 gap-1">
                {[
                  "#000000",
                  "#FF0000",
                  "#00FF00",
                  "#0000FF",
                  "#FFFF00",
                  "#FF00FF",
                  "#00FFFF",
                  "#FFA500",
                  "#800080",
                  "#FFC0CB",
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      editor.chain().focus().setColor(color).run()
                    }
                    className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </ToolbarButton>
        </div>

        {/* AI Assistant Button */}
        <div className="flex items-center gap-1 pl-2 border-l border-gray-300 dark:border-gray-600">
          <button
            type="button"
            onClick={() => {
              const selection = editor?.state.selection;
              if (selection && !selection.empty) {
                const text = editor.state.doc.textBetween(
                  selection.from,
                  selection.to,
                  " "
                );
                if (text.trim()) {
                  setSelectedText(text);
                  setShowAIMenu(true);
                } else {
                  alert("Please select some text first");
                }
              } else {
                alert("Please select some text first");
              }
            }}
            className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all group cursor-pointer"
            title="AI Assistant (select text first)"
          >
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-4">
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>

      {/* AI Menu */}
      {showAIMenu && (
        <AIMenu
          selectedText={selectedText}
          onInsert={(newText) => {
            if (editor) {
              const { from, to } = editor.state.selection;

              // Clean and format the text properly
              let formattedContent = newText.trim();

              // Split by double newlines (paragraphs) OR single newlines
              const paragraphs = formattedContent
                .split(/\n\n+/)  // Split by 2+ newlines
                .filter(p => p.trim())
                .map(para => {
                  // Handle single line breaks within paragraph
                  const lines = para
                    .split(/\n/)
                    .filter(line => line.trim())
                    .join('<br/>');

                  return `<p>${lines}</p>`;
                });

              const htmlContent = paragraphs.join('');

              // Delete selection and insert formatted content
              editor
                .chain()
                .focus()
                .deleteRange({ from, to })
                .insertContent(htmlContent || newText)
                .run();

              setShowAIMenu(false);
              setSelectedText("");
            }
          }}
          onClose={() => {
            setShowAIMenu(false);
            setSelectedText("");
          }}
          position={aiMenuPosition}
        />
      )}
    </div>
  );
}