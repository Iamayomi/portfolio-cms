"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code,
  Heading,
  Highlighter,
  Italic,
  LinkIcon,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
  Undo2,
} from "lucide-react";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import SubscriptExtension from "@tiptap/extension-subscript";
import SuperscriptExtension from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import UnderlineExtension from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Selection } from "@tiptap/extensions";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState, type ComponentType } from "react";
import { FaYoutube } from "react-icons/fa";
import { toast } from "sonner";

import {
  codeLanguages,
  getCodeLanguageLabel,
  lowlight,
  type CodeLanguage,
} from "./nodes/code-highlighting";
import HorizontalRule from "./nodes/horizontal-rule-node-extension";
import Image from "./nodes/image-node";
import { ImageUploadButton } from "./nodes/image-upload-button";
import ImageUploadNode from "./nodes/image-upload-node-extension";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FILE_CONFIG, handleUpload } from "@/lib/services/upload.service";
import { cn } from "@/lib/utils";

type TextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

type DialogMode = "link" | "youtube";
type IconComponent = ComponentType<{ className?: string }>;
type HeadingLevel = 1 | 2 | 3 | 4;
type ListType = "bulletList" | "orderedList" | "taskList";

const highlightColors = [
  { label: "Honey", value: "#f8d978" },
  { label: "Mint", value: "#cbeec7" },
  { label: "Sky", value: "#bfe8f2" },
  { label: "Blush", value: "#f5b8d6" },
  { label: "Tomato", value: "#ffb3aa" },
];

function ToolbarSeparator() {
  return <div className="mx-1 h-8 w-px bg-ink/10" aria-hidden="true" />;
}

function ToolbarButton({
  label,
  icon: Icon,
  active = false,
  onClick,
  children,
}: {
  label: string;
  icon?: IconComponent;
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      title={label}
      variant={active ? "default" : "outline"}
      size="sm"
      className={cn("h-9 min-w-9 rounded-xl px-2")}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {Icon ? <Icon className="size-4" /> : null}
      {children}
    </Button>
  );
}

function applyHeading(editor: Editor, level: HeadingLevel | null) {
  if (!level) {
    return editor.chain().focus().setParagraph().run();
  }

  return editor.chain().focus().setHeading({ level }).run();
}

function applyList(editor: Editor, type: ListType) {
  if (type === "bulletList") {
    return editor.chain().focus().toggleBulletList().run();
  }

  if (type === "orderedList") {
    return editor.chain().focus().toggleOrderedList().run();
  }

  return editor.chain().focus().toggleTaskList().run();
}

function applyCodeBlock(editor: Editor, language: CodeLanguage) {
  return editor.chain().focus().toggleCodeBlock({ language }).run();
}

function applyCodeLanguage(editor: Editor, language: CodeLanguage) {
  if (editor.isActive("codeBlock")) {
    return editor
      .chain()
      .focus()
      .updateAttributes("codeBlock", { language })
      .run();
  }

  return editor.chain().focus().setCodeBlock({ language }).run();
}

export function TextEditor({
  value = "",
  onChange,
  disabled = false,
}: TextEditorProps) {
  const [dialogMode, setDialogMode] = useState<DialogMode | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [highlightOpen, setHighlightOpen] = useState(false);
  const [selectedCodeLanguage, setSelectedCodeLanguage] =
    useState<CodeLanguage>("typescript");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: {
          levels: [1, 2, 3, 4],
        },
        horizontalRule: false,
      }),
      CodeBlockLowlight.configure({
        defaultLanguage: "typescript",
        lowlight,
      }),
      Highlight.configure({ multicolor: true }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-none border border-ink/15",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "cursor-pointer text-tomato underline underline-offset-4",
        },
      }),
      Placeholder,
      SubscriptExtension,
      SuperscriptExtension,
      TaskList,
      TaskItem.configure({ nested: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Typography,
      UnderlineExtension,
      HorizontalRule,
      Selection,
      Youtube.configure({
        controls: true,
        nocookie: true,
        width: 720,
        height: 405,
        HTMLAttributes: {
          class: "rounded-none",
        },
      }),
      ImageUploadNode.configure({
        accept: "image/*",
        limit: 1,
        maxSize: FILE_CONFIG.IMAGE.maxSize,
        upload: async (file, onProgress) => {
          if (!FILE_CONFIG.IMAGE.mimeTypes.includes(file.type))
            throw new Error("Unsupported image type.");

          onProgress?.({ progress: 12 });
          const url = await handleUpload(file, "notes");
          onProgress?.({ progress: 100 });
          return url;
        },
        onError: (error) => toast.error(error.message),
      }),
    ],
    immediatelyRender: false,
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editable: !disabled,
    editorProps: {
      attributes: {
        class:
          "notes-editor min-h-[440px] rounded-b-2xl border-x border-b border-ink/15 bg-paper/90 p-5 text-base leading-8 outline-none",
        autocomplete: "on",
        autocorrect: "off",
        autocapitalize: "on",
      },
    },
  });

  if (!editor) return null;

  const openInputDialog = (mode: DialogMode) => {
    setDialogMode(mode);
    setInputValue(
      mode === "link" ? editor.getAttributes("link").href || "" : ""
    );
  };

  const applyDialogValue = () => {
    const url = inputValue.trim();
    if (!dialogMode || !url) return;

    if (dialogMode === "link") {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }

    if (dialogMode === "youtube") {
      editor.commands.setYoutubeVideo({ src: url });
    }

    toast.success(
      dialogMode === "youtube" ? "YouTube embed added" : "Link added"
    );
    setDialogMode(null);
    setInputValue("");
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 rounded-t-2xl border border-ink/15 bg-muted/30 p-2">
        <ToolbarButton
          label="Undo"
          icon={Undo2}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <ToolbarButton
          label="Redo"
          icon={Redo2}
          onClick={() => editor.chain().focus().redo().run()}
        />

        <ToolbarSeparator />

        <ToolbarButton
          label="Paragraph"
          active={editor.isActive("paragraph")}
          onClick={() => applyHeading(editor, null)}
        >
          P
        </ToolbarButton>
        {([1, 2, 3, 4] as const).map((level) => (
          <ToolbarButton
            key={level}
            label={`Heading ${level}`}
            icon={level === 1 ? Heading : undefined}
            active={editor.isActive("heading", { level })}
            onClick={() => applyHeading(editor, level)}
          >
            {level === 1 ? null : `H${level}`}
          </ToolbarButton>
        ))}

        <ToolbarSeparator />

        <ToolbarButton
          label="Bullet list"
          icon={List}
          active={editor.isActive("bulletList")}
          onClick={() => applyList(editor, "bulletList")}
        />
        <ToolbarButton
          label="Numbered list"
          icon={ListOrdered}
          active={editor.isActive("orderedList")}
          onClick={() => applyList(editor, "orderedList")}
        />
        <ToolbarButton
          label="Task list"
          icon={ListChecks}
          active={editor.isActive("taskList")}
          onClick={() => applyList(editor, "taskList")}
        />

        <ToolbarButton
          label="Quote"
          icon={Quote}
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarButton
          label="Rule"
          icon={Minus}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        />

        <ToolbarSeparator />

        <ToolbarButton
          label="Bold"
          icon={Bold}
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="Italic"
          icon={Italic}
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="Strike"
          icon={Strikethrough}
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
        <ToolbarButton
          label="Code"
          icon={Code}
          active={editor.isActive("codeBlock")}
          onClick={() => applyCodeBlock(editor, selectedCodeLanguage)}
        />
        <CodeLanguageDropdown
          editor={editor}
          selectedLanguage={selectedCodeLanguage}
          onSelectLanguage={(language) => {
            setSelectedCodeLanguage(language);
            applyCodeLanguage(editor, language);
          }}
        />
        <ToolbarButton
          label="Underline"
          icon={Underline}
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <HighlightPalette
          editor={editor}
          open={highlightOpen}
          onOpenChange={() => setHighlightOpen((current) => !current)}
          onClose={() => setHighlightOpen(false)}
        />
        <ToolbarButton
          label="Link"
          icon={LinkIcon}
          active={editor.isActive("link")}
          onClick={() => openInputDialog("link")}
        />

        <ToolbarSeparator />

        <ToolbarButton
          label="Subscript"
          icon={Subscript}
          active={editor.isActive("subscript")}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
        />
        <ToolbarButton
          label="Superscript"
          icon={Superscript}
          active={editor.isActive("superscript")}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
        />

        <ToolbarSeparator />

        <ToolbarButton
          label="Align left"
          icon={AlignLeft}
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        />
        <ToolbarButton
          label="Align center"
          icon={AlignCenter}
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        />
        <ToolbarButton
          label="Align right"
          icon={AlignRight}
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        />

        <ToolbarSeparator />

        <ToolbarButton
          label="YouTube"
          icon={FaYoutube}
          onClick={() => openInputDialog("youtube")}
        />
        <ImageUploadButton
          editor={editor}
          // text="Add"
          className="h-9 rounded-xl border border-ink/15 bg-paper px-3 text-sm font-bold hover:bg-muted"
        />
      </div>

      <EditorContent editor={editor} />

      <AlertDialog
        open={Boolean(dialogMode)}
        onOpenChange={(open) => {
          if (!open) {
            setDialogMode(null);
            setInputValue("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialogMode === "youtube" ? "Embed YouTube" : "Add link"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialogMode === "youtube"
                ? "Paste the YouTube video URL."
                : "Paste the URL you want this text to open."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <Label htmlFor="editor-dialog-url">URL</Label>
            <Input
              id="editor-dialog-url"
              value={inputValue}
              placeholder="https://..."
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  applyDialogValue();
                }
              }}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!inputValue.trim()}
              onClick={applyDialogValue}
            >
              Add
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CodeLanguageDropdown({
  editor,
  selectedLanguage,
  onSelectLanguage,
}: {
  editor: Editor;
  selectedLanguage: CodeLanguage;
  onSelectLanguage: (language: CodeLanguage) => void;
}) {
  const activeLanguage = editor.getAttributes("codeBlock")
    .language as CodeLanguage | null;
  const language = activeLanguage || selectedLanguage;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          type="button"
          title="Code language"
          variant="outline"
          size="sm"
          className="h-9 rounded-xl px-2"
          onMouseDown={(event) => event.preventDefault()}
        >
          <span className="text-xs font-bold">
            {getCodeLanguageLabel(language)}
          </span>
          <ChevronDown className="size-3" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          className="z-50 min-w-40 rounded-2xl border border-ink/15 bg-paper p-1 shadow-[4px_4px_0_var(--ink)] dark:shadow-[4px_4px_0_rgba(247,243,232,0.24)]"
        >
          {codeLanguages.map((codeLanguage) => (
            <DropdownMenu.Item
              key={codeLanguage.value}
              className={cn(
                "cursor-pointer rounded-xl px-3 py-2 text-sm font-bold outline-none transition hover:bg-muted focus:bg-muted",
                language === codeLanguage.value && "bg-muted text-tomato"
              )}
              onSelect={() => onSelectLanguage(codeLanguage.value)}
            >
              {codeLanguage.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function HighlightPalette({
  editor,
  open,
  onOpenChange,
  onClose,
}: {
  editor: Editor;
  open: boolean;
  onOpenChange: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative">
      <ToolbarButton
        label="Highlight"
        icon={Highlighter}
        active={editor.isActive("highlight")}
        onClick={onOpenChange}
      >
        <ChevronDown className="size-3" />
      </ToolbarButton>

      {open ? (
        <div className="absolute left-0 top-11 z-20 flex gap-2 rounded-2xl border border-ink/15 bg-paper p-2 shadow-[4px_4px_0_var(--ink)] dark:shadow-[4px_4px_0_rgba(247,243,232,0.24)]">
          {highlightColors.map((color) => (
            <button
              key={color.value}
              type="button"
              title={color.label}
              className="size-8 rounded-full border border-ink/20 transition hover:scale-105"
              style={{ backgroundColor: color.value }}
              onMouseDown={(event) => event.preventDefault()}
              onClick={(event) => {
                event.preventDefault();
                editor
                  .chain()
                  .focus()
                  .toggleHighlight({ color: color.value })
                  .run();
                onClose();
              }}
            />
          ))}

          <button
            type="button"
            title="Clear highlight"
            className="flex size-8 items-center justify-center rounded-full border border-ink/20 bg-paper"
            onMouseDown={(event) => event.preventDefault()}
            onClick={(event) => {
              event.preventDefault();
              editor.chain().focus().unsetHighlight().run();
              onClose();
            }}
          >
            <Minus className="size-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
