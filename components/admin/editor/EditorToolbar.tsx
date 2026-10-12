"use client";

import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  Pilcrow,
  Quote,
  Code,
  List,
  ListOrdered,
  Minus,
  Link2,
  ImagePlus,
  Image as ImageIcon,
  Video,
  Undo2,
  Redo2,
  Eraser,
  LoaderCircle,
  Maximize2,
  Minimize2,
} from "lucide-react";

export type EditorCommand =
  | { kind: "exec"; command: string; value?: string }
  | { kind: "block"; tag: string }
  | { kind: "link" }
  | { kind: "image-url" }
  | { kind: "upload" }
  | { kind: "video" }
  | { kind: "clear" }
  | { kind: "undo" }
  | { kind: "redo" };

type Props = {
  onCommand: (command: EditorCommand) => void;
  isUploading: boolean;
  isFocusMode: boolean;
  onToggleFocus: () => void;
};

type ButtonProps = {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
};

function ToolButton({ label, onClick, children, disabled }: ButtonProps) {
  return (
    <button
      type="button"
      // mousedown + preventDefault keeps the editor selection/caret alive,
      // which a plain onClick would destroy.
      onMouseDown={(event) => {
        event.preventDefault();
        onClick();
      }}
      title={label}
      aria-label={label}
      disabled={disabled}
      className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-sm transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/50"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-5 bg-white/10 mx-1 shrink-0" aria-hidden />;
}

export function EditorToolbar({ onCommand, isUploading, isFocusMode, onToggleFocus }: Props) {
  const run = (command: EditorCommand) => () => onCommand(command);

  const icon = (Icon: typeof Bold, size = 16) => <Icon size={size} />;

  return (
    <div className="flex flex-wrap items-center gap-0.5 bg-black/30 border border-white/15 border-b-0 rounded-t-sm p-1.5">
      <ToolButton label="Bold (Ctrl+B)" onClick={run({ kind: "exec", command: "bold" })}>
        {icon(Bold)}
      </ToolButton>
      <ToolButton label="Italic (Ctrl+I)" onClick={run({ kind: "exec", command: "italic" })}>
        {icon(Italic)}
      </ToolButton>
      <ToolButton label="Underline (Ctrl+U)" onClick={run({ kind: "exec", command: "underline" })}>
        {icon(Underline)}
      </ToolButton>
      <ToolButton
        label="Strikethrough"
        onClick={run({ kind: "exec", command: "strikeThrough" })}
      >
        {icon(Strikethrough)}
      </ToolButton>

      <Divider />

      <ToolButton label="Heading 2" onClick={run({ kind: "block", tag: "h2" })}>
        {icon(Heading2)}
      </ToolButton>
      <ToolButton label="Heading 3" onClick={run({ kind: "block", tag: "h3" })}>
        {icon(Heading3)}
      </ToolButton>
      <ToolButton label="Heading 4" onClick={run({ kind: "block", tag: "h4" })}>
        {icon(Heading4)}
      </ToolButton>
      <ToolButton label="Paragraph" onClick={run({ kind: "block", tag: "p" })}>
        {icon(Pilcrow)}
      </ToolButton>

      <Divider />

      <ToolButton
        label="Bulleted list"
        onClick={run({ kind: "exec", command: "insertUnorderedList" })}
      >
        {icon(List)}
      </ToolButton>
      <ToolButton
        label="Numbered list"
        onClick={run({ kind: "exec", command: "insertOrderedList" })}
      >
        {icon(ListOrdered)}
      </ToolButton>
      <ToolButton label="Quote" onClick={run({ kind: "block", tag: "blockquote" })}>
        {icon(Quote)}
      </ToolButton>
      <ToolButton label="Code block" onClick={run({ kind: "block", tag: "pre" })}>
        {icon(Code)}
      </ToolButton>
      <ToolButton label="Divider" onClick={run({ kind: "exec", command: "insertHorizontalRule" })}>
        {icon(Minus)}
      </ToolButton>

      <Divider />

      <ToolButton label="Add link" onClick={run({ kind: "link" })}>
        {icon(Link2)}
      </ToolButton>
      <ToolButton label="Upload image" onClick={run({ kind: "upload" })} disabled={isUploading}>
        {isUploading ? <LoaderCircle size={16} className="animate-spin" /> : icon(ImagePlus)}
      </ToolButton>
      <ToolButton label="Insert image by URL" onClick={run({ kind: "image-url" })}>
        {icon(ImageIcon)}
      </ToolButton>
      <ToolButton label="Embed video" onClick={run({ kind: "video" })}>
        {icon(Video)}
      </ToolButton>

      <Divider />

      <ToolButton label="Undo" onClick={run({ kind: "undo" })}>
        {icon(Undo2)}
      </ToolButton>
      <ToolButton label="Redo" onClick={run({ kind: "redo" })}>
        {icon(Redo2)}
      </ToolButton>
      <ToolButton label="Clear formatting" onClick={run({ kind: "clear" })}>
        {icon(Eraser)}
      </ToolButton>

      <div className="flex-1" />

      <ToolButton
        label={isFocusMode ? "Exit focus mode" : "Focus mode"}
        onClick={onToggleFocus}
      >
        {isFocusMode ? icon(Minimize2) : icon(Maximize2)}
      </ToolButton>
    </div>
  );
}

/** Hidden native file input, triggered programmatically by the toolbar. */
export function EditorFileInput({
  onSelect,
  inputRef,
}: {
  onSelect: (file: File) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <input
      ref={inputRef}
      type="file"
      accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
      className="hidden"
      tabIndex={-1}
      onChange={(event) => {
        const file = event.target.files?.[0];
        if (file) onSelect(file);
        // Reset so picking the same file twice still fires a change event.
        event.target.value = "";
      }}
    />
  );
}