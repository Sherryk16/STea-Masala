"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { LoaderCircle, TriangleAlert } from "lucide-react";

import { sanitizeHtml, htmlToPlainText, countWords, readingTimeMinutes } from "@/lib/blog/sanitize";
import { uploadImageAction, toEmbedUrlAction } from "@/app/admin/post-actions";
import {
  EditorToolbar,
  EditorFileInput,
  type EditorCommand,
} from "@/components/admin/editor/EditorToolbar";

type Props = {
  /** Form field name. A hidden input keeps the HTML in sync for submit. */
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  /** Notified on every edit, so the parent can back the draft up. */
  onChange?: (html: string) => void;
};

export function RichTextEditor({
  name = "content",
  defaultValue = "",
  placeholder = "Tell your story…",
  onChange,
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isComposingRef = useRef(false);

  const [html, setHtml] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [, startUploadTransition] = useTransition();

  // Seed the editable region once. Never let React manage its children, or the
  // caret would jump on every keystroke.
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== defaultValue) {
      editorRef.current.innerHTML = defaultValue;
    }
    // Intentionally runs once: defaultValue is the initial value only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const sync = useCallback(() => {
    // While an IME composition is in flight, writing state back can move the
    // caret. Sync once on compositionend instead.
    if (isComposingRef.current) return;
    if (editorRef.current) {
      const current = editorRef.current.innerHTML;
      setHtml(current);
      onChangeRef.current?.(current);
    }
  }, []);

  /** Replaces the current selection with sanitized HTML. */
  const insertHtml = useCallback((rawHtml: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    // insertHTML keeps the browser's native undo stack intact, unlike
    // manipulating the DOM directly.
    document.execCommand("insertHTML", false, sanitizeHtml(rawHtml));
    sync();
  }, [sync]);

  const uploadAndInsert = useCallback(
    async (file: File, alt: string) => {
      setIsUploading(true);
      setError(null);

      startUploadTransition(async () => {
        try {
          const formData = new FormData();
          formData.set("file", file);
          formData.set("folder", "content");

          const result = await uploadImageAction(formData);

          if (result.status === "done" && result.url) {
            insertHtml(`<figure><img src="${result.url}" alt="${alt}" loading="lazy"><figcaption>${alt}</figcaption></figure><p><br></p>`);
          } else {
            setError(result.message ?? "The image could not be uploaded.");
          }
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : "The image could not be uploaded.");
        } finally {
          setIsUploading(false);
        }
      });
    },
    [insertHtml],
  );

  const handleCommand = useCallback(
    (command: EditorCommand) => {
      const editor = editorRef.current;
      if (!editor) return;

      setError(null);
      editor.focus();

      switch (command.kind) {
        case "exec":
          document.execCommand(command.command, false, command.value);
          sync();
          break;

        case "block": {
          // Chrome and Safari want angle brackets; Firefox accepts either.
          const applied = document.execCommand("formatBlock", false, `<${command.tag}>`);
          if (!applied) document.execCommand("formatBlock", false, command.tag);
          sync();
          break;
        }

        case "link": {
          const selection = window.getSelection();
          if (!selection || selection.isCollapsed) {
            setError("Select some text first, then add a link to it.");
            return;
          }

          const raw = window.prompt("Link to (https://… or /page)");
          if (raw === null) return;

          const href = raw.trim();
          const isSafe =
            href.startsWith("/") || /^https?:\/\/[^\s]+$/i.test(href) || /^mailto:[^\s]+@/i.test(href);

          if (!isSafe) {
            setError("Use a full https:// address, an internal /path, or a mailto: link.");
            return;
          }

          document.execCommand("createLink", false, href);
          sync();
          break;
        }

        case "image-url": {
          const raw = window.prompt("Image URL (an uploaded image, or an image on this site)");
          if (raw === null || !raw.trim()) return;

          const alt = window.prompt("Describe this image for screen readers") ?? "";
          // Rejected by the sanitizer if the host is not allowed.
          insertHtml(`<figure><img src="${raw.trim()}" alt="${alt}"><figcaption>${alt}</figcaption></figure><p><br></p>`);
          break;
        }

        case "upload":
          fileInputRef.current?.click();
          break;

        case "video": {
          const raw = window.prompt("Paste a YouTube, Vimeo or Dailymotion link");
          if (raw === null || !raw.trim()) return;

          startUploadTransition(async () => {
            const embedUrl = await toEmbedUrlAction(raw.trim());

            if (!embedUrl) {
              setError("That link is not a supported YouTube, Vimeo or Dailymotion video.");
              return;
            }

            insertHtml(`<iframe src="${embedUrl}"></iframe><p><br></p>`);
          });
          break;
        }

        case "clear":
          document.execCommand("removeFormat");
          document.execCommand("formatBlock", false, "<p>");
          sync();
          break;

        case "undo":
          document.execCommand("undo");
          sync();
          break;

        case "redo":
          document.execCommand("redo");
          sync();
          break;
      }
    },
    [insertHtml, sync],
  );

  /**
   * Pastes are filtered through the same allow-list as the server, and pasted
   * images are uploaded so they do not break the broken-image-host rule.
   */
  const handlePaste = useCallback(
    async (event: React.ClipboardEvent<HTMLDivElement>) => {
      const pastedImage = [...event.clipboardData.items]
        .find((item) => item.type.startsWith("image/"))
        ?.getAsFile();

      if (pastedImage) {
        event.preventDefault();
        await uploadAndInsert(pastedImage, pastedImage.name || "Pasted image");
        return;
      }

      const pastedHtml = event.clipboardData.getData("text/html");
      if (!pastedHtml) return; // plain-text paste: let the browser handle it

      event.preventDefault();
      insertHtml(pastedHtml);
    },
    [insertHtml, uploadAndInsert],
  );

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      // Always swallow the drop, otherwise dropping a file navigates the tab
      // away from the editor and loses the draft.
      event.preventDefault();

      const file = [...event.dataTransfer.files].find((item) =>
        item.type.startsWith("image/"),
      );
      if (!file) return;

      await uploadAndInsert(file, file.name);
    },
    [uploadAndInsert],
  );

  const plainText = htmlToPlainText(html);
  const words = countWords(plainText);
  const minutes = readingTimeMinutes(plainText);

  return (
    <div className="relative">
      <EditorToolbar
        onCommand={handleCommand}
        isUploading={isUploading}
        isFocusMode={isFocusMode}
        onToggleFocus={() => setIsFocusMode((focused) => !focused)}
      />

      <div
        className={`relative bg-black/30 border border-white/15 rounded-b-sm transition-all ${
          isFocusMode ? "min-h-[70vh]" : "min-h-[420px]"
        }`}
      >
        {isFocusMode && (
          <div className="absolute right-3 top-3 z-10 text-[10px] tracking-widest uppercase text-white/30 bg-black/50 px-2 py-1 rounded-sm pointer-events-none">
            Focus mode
          </div>
        )}

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Post content"
          data-placeholder={placeholder}
          onInput={sync}
          onBlur={sync}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onCompositionStart={() => {
            isComposingRef.current = true;
          }}
          onCompositionEnd={() => {
            isComposingRef.current = false;
            sync();
          }}
          className="editor-surface prose-blog px-4 py-5 sm:px-6 sm:py-6 focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-white/25"
        />

        <EditorFileInput inputRef={fileInputRef} onSelect={(file) => uploadAndInsert(file, file.name)} />
      </div>

      {/* Mirrors the editable region for plain form submission. */}
      <input type="hidden" name={name} value={html} />

      <div className="flex flex-wrap items-center justify-between gap-3 mt-2 text-xs text-white/35">
        <span>
          {words} word{words === 1 ? "" : "s"} · {minutes} min read
        </span>

        {isUploading ? (
          <span className="flex items-center gap-1.5 text-white/50">
            <LoaderCircle size={13} className="animate-spin" />
            Uploading image…
          </span>
        ) : (
          error && (
            <span role="alert" className="flex items-center gap-1.5 text-red-300">
              <TriangleAlert size={13} />
              {error}
            </span>
          )
        )}
      </div>
    </div>
  );
}