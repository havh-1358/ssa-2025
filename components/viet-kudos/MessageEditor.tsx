"use client";

import { useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import DOMPurify from "dompurify";

const MAX_CHARS = 1000;
const WARN_CHARS = 800;

type MessageEditorProps = {
  onChange: (text: string) => void;
  error?: string;
};

export function MessageEditor({ onChange, error }: MessageEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: "",
    onUpdate({ editor: e }) {
      const text = e.getText();
      const sanitized = DOMPurify.sanitize(text, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
      });
      onChange(sanitized);
    },
  });

  const charCount = editor?.getText().length ?? 0;
  const showCounter = charCount >= WARN_CHARS;
  const counterColor =
    charCount > MAX_CHARS ? "var(--color-error)" : "var(--color-placeholder)";

  const toolbarBtn = useMemo(
    () =>
      (
        label: string,
        action: () => void,
        isActive: boolean,
        ariaLabel: string
      ) => (
        <button
          key={label}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            action();
          }}
          aria-label={ariaLabel}
          aria-pressed={isActive}
          className={[
            "w-8 h-8 flex items-center justify-center rounded",
            "font-[family-name:var(--font-montserrat)] font-bold text-[14px]",
            "text-[var(--color-modal-text-dark)]",
            "transition-colors duration-100",
            "focus-visible:outline-2 focus-visible:outline-[var(--color-error)]",
            isActive
              ? "bg-[var(--color-accent-gold-hover,rgba(255,234,158,0.3))]"
              : "hover:bg-[var(--color-accent-gold-subtle,rgba(255,234,158,0.15))]",
          ].join(" ")}
        >
          {label}
        </button>
      ),
    []
  );

  return (
    <div className="flex flex-col gap-[var(--field-gap)]">
      <label
        className="font-[family-name:var(--font-montserrat)] font-bold
          text-[14px] leading-5 text-[var(--color-modal-text-dark)]"
      >
        Nội dung *
      </label>

      <div
        className={[
          "rounded-[var(--border-input-radius)] border overflow-hidden",
          "bg-[var(--color-input-bg)]",
          error ? "border-[var(--color-error)]" : "border-[var(--color-input-border)]",
        ].join(" ")}
      >
        {/* Toolbar */}
        <div
          className="flex items-center gap-1 px-3 py-2
            bg-[var(--color-toolbar-bg)] border-b border-[var(--color-input-border)]"
          role="toolbar"
          aria-label="Text formatting"
        >
          {editor &&
            toolbarBtn(
              "B",
              () => editor.chain().focus().toggleBold().run(),
              editor.isActive("bold"),
              "Bold"
            )}
          {editor &&
            toolbarBtn(
              "I",
              () => editor.chain().focus().toggleItalic().run(),
              editor.isActive("italic"),
              "Italic"
            )}
          {editor &&
            toolbarBtn(
              "U",
              () => editor.chain().focus().toggleUnderline().run(),
              editor.isActive("underline"),
              "Underline"
            )}
        </div>

        {/* Editor area */}
        <div className="relative" style={{ height: "268px", overflowY: "auto" }}>
          <EditorContent
            editor={editor}
            className="h-full px-4 py-3
              font-[family-name:var(--font-montserrat)] text-[16px]
              text-[var(--color-modal-text-dark)]
              [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-full"
          />
          {showCounter && (
            <span
              className="absolute right-3 bottom-2 text-[12px] font-[family-name:var(--font-montserrat)]"
              style={{ color: counterColor }}
              aria-live="polite"
            >
              {charCount}/{MAX_CHARS}
            </span>
          )}
        </div>
      </div>

      {error && (
        <p
          className="font-[family-name:var(--font-montserrat)]
            text-[12px] leading-4 text-[var(--color-error)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}
