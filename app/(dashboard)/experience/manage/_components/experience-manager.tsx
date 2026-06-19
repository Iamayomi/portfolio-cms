"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { ModuleCard } from "@/components/common/module-card";
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
import {
  deleteExperience,
  reorderExperiences,
} from "@/lib/actions/experience.actions";

import { ExperienceForm } from "./experience-form";
import type { ExperienceListItem } from "./experience-manager.types";
import { SortableExperienceCard } from "./sortable-experience-card";

export type { ExperienceListItem } from "./experience-manager.types";

export function ExperienceManager({ items }: { items: ExperienceListItem[] }) {
  const router = useRouter();
  const [entries, setEntries] = useState(items);
  const [editing, setEditing] = useState<ExperienceListItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ExperienceListItem | null>(
    null
  );
  const [isPending, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor));

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = entries.findIndex((item) => item.id === active.id);
    const newIndex = entries.findIndex((item) => item.id === over.id);
    const nextEntries = arrayMove(entries, oldIndex, newIndex).map(
      (entry, index) => ({ ...entry, order: index + 1 })
    );

    setEntries(nextEntries);
    startTransition(() => {
      reorderExperiences(nextEntries.map((item) => item.id))
        .then((res) => {
          if (res && "error" in res) toast.error(res.error);
          else {
            toast.success("Item reordered");
            router.refresh();
          }
        })
        .catch(() => toast.error("Could not reorder items."));
    });
  };

  const runDelete = () => {
    if (!pendingDelete) return;

    startTransition(() => {
      deleteExperience(pendingDelete.id)
        .then((res) => {
          if (res && "error" in res) toast.error(res.error);
          else {
            toast.success("Experience deleted");
            setPendingDelete(null);
            router.refresh();
          }
        })
        .catch(() => toast.error("Could not delete experience."));
    });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_26rem]">
      <ModuleCard className="space-y-5">
        <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-5">
          <div>
            <p className="font-script text-3xl text-tomato">Manage timeline</p>
            <p className="text-sm leading-6 text-ink/60">
              Drag entries into the exact order you want on the public page.
            </p>
          </div>
          <Button type="button" onClick={() => setEditing(null)}>
            <Plus />
            New
          </Button>
        </div>

        {entries.length ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={entries.map((entry) => entry.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {entries.map((entry) => (
                  <SortableExperienceCard
                    key={entry.id}
                    entry={entry}
                    selected={editing?.id === entry.id}
                    disabled={isPending}
                    onEdit={() => setEditing(entry)}
                    onDelete={() => setPendingDelete(entry)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="rounded-2xl border border-dashed border-ink/20 bg-muted/20 p-8 text-center">
            <p className="text-2xl font-black">No experience entries yet.</p>
            <p className="mt-2 text-sm text-ink/60">
              Add the first timeline item from the form.
            </p>
          </div>
        )}
      </ModuleCard>

      <ExperienceForm
        key={editing?.id ?? "new-experience"}
        item={editing}
        onCancel={() => setEditing(null)}
      />

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this experience?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the timeline item from the CMS. You cannot undo this
              after deleting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={runDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
