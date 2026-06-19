"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { ExperienceListItem } from "./experience-manager.types";

type SortableExperienceCardProps = {
  entry: ExperienceListItem;
  selected: boolean;
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function SortableExperienceCard({
  entry,
  selected,
  disabled,
  onEdit,
  onDelete,
}: SortableExperienceCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: entry.id });

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
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-ink/45">
              {entry.period}
            </p>
            <Badge variant={entry.published ? "default" : "outline"}>
              {entry.published ? "Published" : "Draft"}
            </Badge>
          </div>
          <h2 className="mt-2 truncate text-xl font-black">{entry.role}</h2>
          {entry.websiteUrl ? (
            <a
              href={entry.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex text-xs font-bold text-tomato underline underline-offset-4"
            >
              {entry.websiteUrl}
            </a>
          ) : null}
          {entry.summary ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/60">
              {entry.summary}
            </p>
          ) : null}
          {entry.signals.length ? (
            <p className="mt-3 text-xs font-bold text-ink/45">
              {entry.signals.length} signal
              {entry.signals.length === 1 ? "" : "s"}
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
