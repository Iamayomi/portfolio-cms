"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { BookListItem } from "./bookshelf-manager.types";

type SortableBookCardProps = {
  book: BookListItem;
  selected: boolean;
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function SortableBookCard({
  book,
  selected,
  disabled,
  onEdit,
  onDelete,
}: SortableBookCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: book.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "rounded-2xl border border-ink/10 bg-paper/70 p-4",
        selected && "border-tomato/45 bg-tomato/5"
      )}
    >
      <div className="grid gap-3 md:grid-cols-[2.5rem_minmax(0,1fr)_auto] md:items-start">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="cursor-grab"
          disabled={disabled}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </Button>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{book.category}</Badge>
            <Badge variant={book.published ? "default" : "outline"}>
              {book.published ? "Published" : "Draft"}
            </Badge>
            {book.rating ? (
              <Badge className="bg-honey text-ink">
                {"★".repeat(book.rating)}
              </Badge>
            ) : null}
          </div>
          <h2 className="mt-2 truncate text-xl font-black">{book.title}</h2>
          <p className="mt-1 text-sm text-ink/55">by {book.author}</p>
          {book.note ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/60">
              {book.note}
            </p>
          ) : null}
        </div>
        <div className="flex gap-2 md:justify-end">
          <Button type="button" variant="outline" size="sm" onClick={onEdit}>
            <Pencil />
            Edit
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onDelete}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  );
}
