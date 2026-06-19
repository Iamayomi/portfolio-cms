"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { BuildListItem } from "./builds-manager.types";

type SortableBuildCardProps = {
  build: BuildListItem;
  selected: boolean;
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function SortableBuildCard({
  build,
  selected,
  disabled,
  onEdit,
  onDelete,
}: SortableBuildCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: build.id });

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
              {build.category}
            </p>
            <Badge variant="outline">{build.status.replace("-", " ")}</Badge>
            <Badge variant={build.published ? "default" : "outline"}>
              {build.published ? "Published" : "Draft"}
            </Badge>
            {build.featured ? (
              <Badge className="bg-honey text-ink">Featured</Badge>
            ) : null}
          </div>
          <h2 className="mt-2 truncate text-xl font-black">{build.title}</h2>
          {build.summary ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/60">
              {build.summary}
            </p>
          ) : null}
          {build.stack.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {build.stack.slice(0, 5).map((tool) => (
                <Badge key={tool} variant="outline">
                  {tool}
                </Badge>
              ))}
            </div>
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
