"use client";

import { ArrowLeft } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

import {
  CancelButton,
  ImagePicker,
  PublishSwitch,
  SaveButton,
  TextareaField,
  TextField,
} from "@/components/common/form-controls";
import { ModuleCard } from "@/components/common/module-card";
import { TextEditor } from "@/components/common/tiptap/text-editor";
import { Button } from "@/components/ui/button";
import { createNote, updateNote } from "@/lib/actions/notes.actions";
import type { TNoteSchema } from "@/lib/schemas/note.schema";
import { handleImageUpload } from "@/lib/services/upload.service";

import { TagsInput } from "./note-tags";

export type NoteFormData = TNoteSchema & {
  id?: string;
};

type NoteFormProps = {
  mode: "create" | "edit";
  initialData?: NoteFormData | null;
};

const emptyNote: TNoteSchema = {
  title: "",
  excerpt: "",
  content: "<p></p>",
  published: false,
  featured: false,
  allowComments: false,
  bannerImage: "",
  bannerCaption: "",
  tags: [],
  series: "",
  seriesOrder: undefined,
};

const toPayload = (note?: NoteFormData | null): TNoteSchema =>
  note
    ? {
        title: note.title,
        excerpt: note.excerpt,
        content: note.content,
        published: note.published,
        featured: note.featured,
        allowComments: note.allowComments ?? false,
        bannerImage: note.bannerImage || "",
        bannerCaption: note.bannerCaption || "",
        tags: note.tags || [],
        series: note.series || "",
        seriesOrder: note.seriesOrder,
      }
    : emptyNote;

export function NoteForm({ mode, initialData }: NoteFormProps) {
  const router = useRouter();
  const imageRef = useRef<HTMLInputElement | null>(null);
  const initialPayload = toPayload(initialData);
  const [formData, setFormData] = useState<TNoteSchema>(initialPayload);
  const [newTag, setNewTag] = useState("");
  const [isPending, startTransition] = useTransition();

  const payload: TNoteSchema = formData;
  const isDirty = JSON.stringify(payload) !== JSON.stringify(initialPayload);

  const onUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(event, {
      folder: "notes",
      onComplete: (url) => {
        toast.success("Banner uploaded");
        setFormData((prev) => ({ ...prev, bannerImage: url }));
      },
      onError: (message) => toast.error(message),
    });
  };

  const onTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
    }));
  };

  const onCancel = () => {
    setFormData(initialPayload);
    setNewTag("");
  };

  const onAddTag = () => {
    const tag = newTag.trim();
    if (!tag || formData.tags.includes(tag)) return;
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    setNewTag("");
  };

  const onRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((item) => item !== tag),
    }));
  };

  const onSubmit = () => {
    if (!payload.tags.length) return toast.error("Add at least one tag");

    startTransition(() => {
      const action =
        mode === "edit" && initialData?.id
          ? updateNote(initialData.id, payload)
          : createNote(payload);

      action
        .then((res) => {
          if (res && "error" in res) {
            toast.error(res.error);
            return;
          }

          toast.success(mode === "edit" ? "Note updated" : "Note created");
          router.push(`/notes/manage/${res.data.slug}`);
          router.refresh();
        })
        .catch(() => toast.error("Something went wrong, try again."));
    });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
      <div className="space-y-5">
        <Button asChild variant="outline" className="xl:hidden">
          <Link href="/notes/manage">
            <ArrowLeft />
            Back to notes
          </Link>
        </Button>
        <ModuleCard className="space-y-5">
          <TextField
            label="Title"
            defaultValue={formData.title}
            maxLength={140}
            onChange={onTitleChange}
          />

          <TextareaField
            label="Excerpt"
            defaultValue={formData.excerpt}
            maxLength={320}
            onChange={(excerpt) =>
              setFormData((prev) => ({ ...prev, excerpt }))
            }
          />
        </ModuleCard>

        <ModuleCard className="space-y-4">
          <p className="font-script text-3xl text-tomato">Content</p>
          <TextEditor
            value={formData.content}
            onChange={(content) =>
              setFormData((prev) => ({ ...prev, content }))
            }
          />
        </ModuleCard>
      </div>

      <aside className="space-y-5">
        <Button asChild variant="outline" className="w-full hidden xl:flex">
          <Link href="/notes/manage">
            <ArrowLeft />
            Back to notes
          </Link>
        </Button>
        <ModuleCard className="space-y-4 bg-honey/25">
          <SaveButton
            isPending={isPending}
            disabled={!isDirty}
            label={mode === "edit" ? "Save note" : "Create note"}
            onSubmit={onSubmit}
          />
          {isDirty ? <CancelButton onCancel={onCancel} /> : null}
        </ModuleCard>

        <ModuleCard className="space-y-4">
          <PublishSwitch
            checked={formData.published}
            hint="Published notes can appear on the public website."
            onChange={(published) =>
              setFormData((prev) => ({
                ...prev,
                published,
              }))
            }
          />
          <PublishSwitch
            checked={formData.featured}
            hint="Featured notes can appear on the landing page."
            onChange={(featured) =>
              setFormData((prev) => ({ ...prev, featured }))
            }
            checkedLabel="Featured"
            unCheckedLabel="Not Featured"
          />
          <PublishSwitch
            checked={formData.allowComments}
            hint="Allow visitors to leave comments on the public note."
            onChange={(allowComments) =>
              setFormData((prev) => ({ ...prev, allowComments }))
            }
            checkedLabel="Comments on"
            unCheckedLabel="Comments off"
          />
        </ModuleCard>

        <ModuleCard className="space-y-4">
          <ImagePicker
            label="Banner image"
            value={formData.bannerImage || ""}
            inputRef={imageRef}
            hint="Optional. This can appear above the note."
            onUpload={onUpload}
          />
          <TextareaField
            label="Banner caption"
            defaultValue={formData.bannerCaption || ""}
            onChange={(bannerCaption) =>
              setFormData((prev) => ({ ...prev, bannerCaption }))
            }
          />
        </ModuleCard>

        <ModuleCard className="space-y-3">
          <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-ink/50">
            Tags
          </p>
          <TagsInput
            tags={formData.tags}
            newTag={newTag}
            onNewTagChange={setNewTag}
            onAddTag={onAddTag}
            onRemoveTag={onRemoveTag}
            disabled={isPending}
          />
        </ModuleCard>

        <ModuleCard className="space-y-4">
          <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-ink/50">
            Series
          </p>
          <TextField
            label="Series name"
            defaultValue={formData.series}
            hint="Group this note into a series. Notes with the same series name appear together."
            onChange={(series) =>
              setFormData((prev) => ({ ...prev, series }))
            }
          />
          <TextField
            label="Series order"
            defaultValue={formData.seriesOrder?.toString() || ""}
            hint="Order within the series (1, 2, 3...)."
            onChange={(seriesOrder) =>
              setFormData((prev) => ({
                ...prev,
                seriesOrder: seriesOrder ? Number(seriesOrder) : undefined,
              }))
            }
          />
        </ModuleCard>
      </aside>
    </div>
  );
}
