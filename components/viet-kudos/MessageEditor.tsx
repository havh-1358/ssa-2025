"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import DOMPurify from "dompurify";
import { ROUTES } from "@/lib/constants/routes";

const MAX_CHARS = 1000;
const WARN_CHARS = 800;

type ToolbarButtonProps = {
  label: React.ReactNode;
  ariaLabel: string;
  isActive: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
};

function ToolbarButton({ label, ariaLabel, isActive, onMouseDown }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={onMouseDown}
      aria-label={ariaLabel}
      aria-pressed={isActive}
      className={[
        "h-10 flex items-center justify-center px-4",
        "border border-[var(--color-input-border)]",
        "font-[family-name:var(--font-montserrat)] font-bold text-[14px]",
        "text-[var(--color-modal-text-dark)]",
        "transition-colors duration-100",
        "focus-visible:outline-2 focus-visible:outline-[var(--color-error)]",
        isActive
          ? "bg-[rgba(255,234,158,0.3)]"
          : "bg-transparent hover:bg-[rgba(255,234,158,0.15)]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

type MessageEditorProps = {
  onChange: (text: string) => void;
  error?: string;
};

export function MessageEditor({ onChange, error }: MessageEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
    ],
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
  const showCounter = charCount > 0;
  const counterColor =
    charCount > MAX_CHARS
      ? "var(--color-error)"
      : charCount >= WARN_CHARS
        ? "var(--color-error)"
        : "var(--color-placeholder)";

  function handleLinkInsert(e: React.MouseEvent) {
    e.preventDefault();
    if (!editor) return;
    const url = window.prompt("Enter URL:");
    if (!url) return;
    const trimmed = url.trim();
    if (trimmed) {
      editor.chain().focus().setLink({ href: trimmed }).run();
    }
  }

  return (
    <div className="flex flex-col gap-[var(--field-gap)]">
      <div
        className={[
          "overflow-hidden",
          "bg-[var(--color-input-bg)]",
          error ? "border border-[var(--color-error)]" : "border border-[var(--color-input-border)]",
        ].join(" ")}
        style={{ borderRadius: "8px 8px 8px 8px" }}
      >
        {/* Toolbar — B | I | S | list | link | quote | Tiêu chuẩn cộng đồng */}
        <div
          className="flex items-center bg-[var(--color-toolbar-bg)] border-b border-[var(--color-input-border)]"
          role="toolbar"
          aria-label="Text formatting"
        >
          <ToolbarButton
            label="B"
            ariaLabel="Bold"
            isActive={editor?.isActive("bold") ?? false}
            onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleBold().run(); }}
          />
          <ToolbarButton
            label="I"
            ariaLabel="Italic"
            isActive={editor?.isActive("italic") ?? false}
            onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleItalic().run(); }}
          />
          <ToolbarButton
            label={<svg width="24" height="24" viewBox="18 11 20 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.6258 17.377C22.4258 15.077 24.1258 12.377 26.5258 11.877C29.6258 10.877 34.1258 12.277 34.0258 16.077H31.0258C31.0258 15.777 30.9258 15.477 30.9258 15.277C30.7258 14.677 30.3258 14.377 29.7258 14.177C28.9258 13.877 27.6258 13.977 26.9258 14.477C25.4258 15.777 26.8258 17.077 28.4258 17.577H23.8258C23.7258 17.477 23.7258 17.377 23.6258 17.377ZM37.4258 20.577V18.577H19.4258V20.577H29.0258C29.2258 20.677 29.4258 20.677 29.6258 20.777C30.2258 21.077 30.7258 21.277 30.9258 21.877C31.0258 22.277 31.1258 22.777 30.9258 23.177C30.7258 23.677 30.3258 23.877 29.8258 24.077C28.0258 24.577 25.8258 23.877 25.9258 21.677H22.9258C22.8258 24.277 25.0258 26.077 27.4258 26.377C31.2258 27.177 35.7258 24.777 33.7258 20.477L37.4258 20.577Z" fill="#00101A"/></svg>}
            ariaLabel="Strikethrough"
            isActive={editor?.isActive("strike") ?? false}
            onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleStrike().run(); }}
          />
          <ToolbarButton
            label={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 13V11H21V13H7ZM7 19V17H21V19H7ZM7 7V5H21V7H7ZM3 8V5H2V4H4V8H3ZM2 17V16H5V20H2V19H4V18.5H3V17.5H4V17H2ZM4.25 10C4.44891 10 4.63968 10.079 4.78033 10.2197C4.92098 10.3603 5 10.5511 5 10.75C5 10.95 4.92 11.14 4.79 11.27L3.12 13H5V14H2V13.08L4 11H2V10H4.25Z" fill="#00101A"/></svg>}
            ariaLabel="Numbered list"
            isActive={editor?.isActive("orderedList") ?? false}
            onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleOrderedList().run(); }}
          />
          <ToolbarButton
            label={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.9614 13.1545C11.3714 13.5445 11.3714 14.1845 10.9614 14.5745C10.5714 14.9645 9.93141 14.9645 9.54141 14.5745C7.59141 12.6245 7.59141 9.45445 9.54141 7.50445L13.0814 3.96445C15.0314 2.01445 18.2014 2.01445 20.1514 3.96445C22.1014 5.91445 22.1014 9.08445 20.1514 11.0345L18.6614 12.5245C18.6714 11.7045 18.5414 10.8845 18.2614 10.1045L18.7314 9.62445C19.9114 8.45445 19.9114 6.55445 18.7314 5.38445C17.5614 4.20445 15.6614 4.20445 14.4914 5.38445L10.9614 8.91445C9.78141 10.0845 9.78141 11.9845 10.9614 13.1545ZM13.7814 8.91445C14.1714 8.52445 14.8114 8.52445 15.2014 8.91445C17.1514 10.8645 17.1514 14.0345 15.2014 15.9845L11.6614 19.5245C9.71141 21.4745 6.54141 21.4745 4.59141 19.5245C2.64141 17.5745 2.64141 14.4045 4.59141 12.4545L6.08141 10.9645C6.07141 11.7845 6.20141 12.6045 6.48141 13.3945L6.01141 13.8645C4.83141 15.0345 4.83141 16.9345 6.01141 18.1045C7.18141 19.2845 9.08141 19.2845 10.2514 18.1045L13.7814 14.5745C14.9614 13.4045 14.9614 11.5045 13.7814 10.3345C13.3714 9.94445 13.3714 9.30445 13.7814 8.91445Z" fill="#00101A"/></svg>}
            ariaLabel="Link"
            isActive={editor?.isActive("link") ?? false}
            onMouseDown={handleLinkInsert}
          />
          <ToolbarButton
            label={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.9989 6V14H14.8789L12.8789 18H18.6189L20.9989 13.24V6M14.9989 8H18.9989V12.76L17.3789 16H16.1189L18.1189 12H14.9989M2.99891 6V14H4.87891L2.87891 18H8.61891L10.9989 13.24V6M4.99891 8H8.99891V12.76L7.37891 16H6.11891L8.11891 12H4.99891V8Z" fill="#00101A"/></svg>}
            ariaLabel="Quote"
            isActive={editor?.isActive("blockquote") ?? false}
            onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleBlockquote().run(); }}
          />

          {/* Tiêu chuẩn cộng đồng — width 336px, height 40px, border-radius 0 8px 0 0 */}
          <a
            href={ROUTES.GENERAL_STANDARDS}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-row items-center justify-center
              border-l border-[var(--color-input-border)]
              font-[family-name:var(--font-montserrat)] font-bold
              text-[var(--color-community-link)]
              hover:opacity-80 transition-opacity
              focus-visible:outline-2 focus-visible:outline-[var(--color-error)]"
            style={{
              width: "336px",
              height: "40px",
              padding: "10px 16px",
              gap: "8px",
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "0.15px",
              textDecoration: "underline",
              textAlign: "right",
              whiteSpace: "nowrap",
            }}
          >
            Tiêu chuẩn cộng đồng
          </a>
        </div>

        {/* Editor area — 200px textarea, min-height 120px */}
        <div className="relative" style={{ minHeight: "120px", height: "200px", overflowY: "auto" }}>
          <EditorContent
            editor={editor}
            className="h-full pl-6 pr-4 py-4
              font-[family-name:var(--font-montserrat)] text-[16px]
              text-[var(--color-modal-text-dark)]
              [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-full
              [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]
              [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-[var(--color-placeholder)]
              [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left
              [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none
              [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
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

      {/* D.1_Gợi ý — Montserrat 700 16px #00101A center, letterSpacing 0.5px */}
      <p
        className="font-[family-name:var(--font-montserrat)] font-bold
          text-[16px] leading-6 text-center text-[var(--color-modal-text-dark)]"
        style={{ letterSpacing: "0.5px" }}
      >
        Bạn có thể &ldquo;@ + tên&rdquo; để nhắc tới đồng nghiệp khác
      </p>

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
