"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import {
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Link2,
  Minus,
  Palette,
  BoldIcon,
  ItalicIcon,
} from "lucide-react";
import Bold from "@tiptap/extension-bold"; 
import Italic from "@tiptap/extension-italic"; 

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
  const editor = useEditor({
  immediatelyRender: false,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
    }),
    Placeholder.configure({
      placeholder,
    }),
    Link.configure({
      openOnClick: false,
    }),
    Underline,
    TextStyle,
    Color,
  ],
  content,
  onUpdate: ({ editor }) => {
    onChange(editor.getHTML());
  },
  onCreate: ({ editor }) => {
    console.log('Editor created, italic available:', editor.can().toggleItalic());
  },
  editorProps: {
    attributes: {
      class: "prose prose-sm max-w-none focus:outline-none px-4 py-3",
      style: `min-height: ${minHeight}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;`,
    },
  },
});

  if (!editor) {
    return null;
  }

  const toggleLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const COLORS = [
    { name: 'Default', color: null },
    { name: 'White', color: '#FFFFFF' },
    { name: 'Gray', color: '#9CA3AF' },
    { name: 'Red', color: '#EF4444' },
    { name: 'Orange', color: '#F97316' },
    { name: 'Yellow', color: '#EAB308' },
    { name: 'Green', color: '#10B981' },
    { name: 'Blue', color: '#3B82F6' },
    { name: 'Purple', color: '#8B5CF6' },
    { name: 'Pink', color: '#EC4899' },
    { name: 'Cyan', color: '#06B6D4' },
    { name: 'Indigo', color: '#6366F1' },
  ];

  return (
    <div className="border-2 border-purple-100 dark:border-purple-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-purple-100 dark:border-purple-800 flex-wrap bg-gray-50 dark:bg-slate-800">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBold().run();
            }}
            className={`
              p-2 rounded-lg transition-all
              ${editor.isActive("bold")
                ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                : "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"
              }
            `}
            title="Bold (Ctrl+B)"
          >
            <BoldIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              console.log('Before toggle - isItalic:', editor.isActive("italic"));
              editor.chain().focus().toggleItalic().run();
              console.log('After toggle - isItalic:', editor.isActive("italic"));
              console.log('HTML:', editor.getHTML());
            }}
            className={`
    p-2 rounded-lg transition-all
    ${editor.isActive("italic")
                ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                : "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"
              }
  `}
            title="Italic (Ctrl+I)"
          >
            <ItalicIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleUnderline().run();
            }}
            className={`
              p-2 rounded-lg transition-all
              ${editor.isActive("underline")
                ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                : "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"
              }
            `}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleStrike().run();
            }}
            className={`
              p-2 rounded-lg transition-all
              ${editor.isActive("strike")
                ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                : "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"
              }
            `}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleCode().run();
            }}
            className={`
              p-2 rounded-lg transition-all
              ${editor.isActive("code")
                ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                : "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"
              }
            `}
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-300 dark:border-gray-600">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            }}
            className={`
              px-2 py-1 rounded-lg text-sm font-bold transition-all
              ${editor.isActive("heading", { level: 1 })
                ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                : "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"
              }
            `}
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            }}
            className={`
              px-2 py-1 rounded-lg text-sm font-bold transition-all
              ${editor.isActive("heading", { level: 2 })
                ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                : "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"
              }
            `}
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleHeading({ level: 3 }).run();
            }}
            className={`
              px-2 py-1 rounded-lg text-sm font-bold transition-all
              ${editor.isActive("heading", { level: 3 })
                ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                : "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"
              }
            `}
            title="Heading 3"
          >
            H3
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-300 dark:border-gray-600">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBulletList().run();
            }}
            className={`
              p-2 rounded-lg transition-all
              ${editor.isActive("bulletList")
                ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                : "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"
              }
            `}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleOrderedList().run();
            }}
            className={`
              p-2 rounded-lg transition-all
              ${editor.isActive("orderedList")
                ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                : "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"
              }
            `}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Other */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-300 dark:border-gray-600">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBlockquote().run();
            }}
            className={`
              p-2 rounded-lg transition-all
              ${editor.isActive("blockquote")
                ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                : "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"
              }
            `}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleCodeBlock().run();
            }}
            className={`
              p-2 rounded-lg transition-all
              ${editor.isActive("codeBlock")
                ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                : "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"
              }
            `}
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleLink();
            }}
            className={`
              p-2 rounded-lg transition-all
              ${editor.isActive("link")
                ? "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                : "hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"
              }
            `}
            title="Add Link"
          >
            <Link2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().setHorizontalRule().run();
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400 transition-all"
            title="Horizontal Line"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Text Color */}
        <div className="flex items-center gap-1 pl-2">
          <div className="relative group">
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
              title="Text Color"
            >
              <Palette className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <div
                className="w-4 h-1 rounded"
                style={{
                  backgroundColor: editor.getAttributes('textStyle').color || '#9CA3AF'
                }}
              />
            </button>

            {/* Color Palette Dropdown */}
            <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-slate-700 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-200px">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Text Color
              </p>
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map((colorOption) => (
                  <button
                    key={colorOption.name}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (colorOption.color === null) {
                        editor.chain().focus().unsetColor().run();
                      } else {
                        editor.chain().focus().setColor(colorOption.color).run();
                      }
                    }}
                    className={`
                      w-8 h-8 rounded-lg border-2 transition-all hover:scale-110
                      ${editor.getAttributes('textStyle').color === colorOption.color
                        ? 'border-purple-500 ring-2 ring-purple-300 dark:ring-purple-700'
                        : 'border-gray-300 dark:border-gray-600'
                      }
                    `}
                    style={{
                      backgroundColor: colorOption.color || '#e5e7eb',
                      border: colorOption.color === '#FFFFFF' ? '2px solid #d1d5db' : undefined
                    }}
                    title={colorOption.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}