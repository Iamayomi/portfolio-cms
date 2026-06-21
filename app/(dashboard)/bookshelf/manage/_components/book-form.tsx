"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  CancelButton,
  PublishSwitch,
  SaveButton,
  TextareaField,
  TextField,
} from "@/components/common/form-controls";
import { ModuleCard } from "@/components/common/module-card";
import { createBook, updateBook } from "@/lib/actions/bookshelf.actions";
import type { TBookSchema } from "@/lib/schemas/book.schema";

import { emptyBookForm, type BookListItem } from "./bookshelf-manager.types";

type BookFormProps = {
  item: BookListItem | null;
  onCancel: () => void;
};

export function BookForm({ item, onCancel }: BookFormProps) {
  const router = useRouter();
  const initial = item ?? emptyBookForm;
  const [formData, setFormData] = useState<TBookSchema>(initial);
  const [isPending, startTransition] = useTransition();
  const isDirty = JSON.stringify(formData) !== JSON.stringify(initial);

  const onSubmit = () => {
    startTransition(() => {
      const action = item
        ? updateBook(item.id, formData)
        : createBook(formData);

      action
        .then((res) => {
          if (res && "error" in res) toast.error(res.error);
          else {
            toast.success(item ? "Book updated" : "Book created");
            if (!item) setFormData(emptyBookForm);
            onCancel();
            router.refresh();
          }
        })
        .catch(() => toast.error("Something went wrong, try again."));
    });
  };

  return (
    <ModuleCard className="h-fit space-y-5 bg-sky/20">
      <div>
        <p className="font-script text-3xl text-tomato">
          {item ? "Edit book" : "New book"}
        </p>
        <p className="text-sm leading-6 text-ink/60">
          Add books that shaped how you think.
        </p>
      </div>

      <TextField
        label="Title"
        defaultValue={formData.title}
        onChange={(title) => setFormData((prev) => ({ ...prev, title }))}
      />
      <TextField
        label="Author"
        defaultValue={formData.author}
        onChange={(author) => setFormData((prev) => ({ ...prev, author }))}
      />
      <TextField
        label="Category"
        defaultValue={formData.category}
        hint="e.g. Systems, Architecture, Craft, Thinking"
        onChange={(category) =>
          setFormData((prev) => ({ ...prev, category }))
        }
      />
      <TextareaField
        label="Note"
        defaultValue={formData.note}
        hint="Why this book matters to you."
        onChange={(note) => setFormData((prev) => ({ ...prev, note }))}
      />
      <div className="space-y-2">
        <label className="text-sm font-medium">Rating (optional)</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="text-xl transition-colors"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  rating: prev.rating === star ? undefined : star,
                }))
              }
            >
              {formData.rating && star <= formData.rating ? "★" : "☆"}
            </button>
          ))}
        </div>
      </div>
      <PublishSwitch
        checked={formData.published}
        checkedLabel="Published"
        unCheckedLabel="Draft"
        onChange={(published) =>
          setFormData((prev) => ({ ...prev, published }))
        }
      />

      <div className="flex flex-col gap-3">
        {isDirty ? (
          <CancelButton onCancel={() => setFormData(initial)} />
        ) : null}

        <SaveButton
          isPending={isPending}
          disabled={!isDirty}
          label={item ? "Save book" : "Create book"}
          onSubmit={onSubmit}
        />
      </div>
    </ModuleCard>
  );
}
