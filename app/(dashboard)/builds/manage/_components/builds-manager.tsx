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
import { deleteBuild, reorderBuilds } from "@/lib/actions/builds.actions";

import { BuildForm } from "./build-form";
import type { BuildListItem } from "./builds-manager.types";
import { SortableBuildCard } from "./sortable-build-card";

export type { BuildListItem } from "./builds-manager.types";

export function BuildsManager({ items }: { items: BuildListItem[] }) {
  const router = useRouter();
  const [builds, setBuilds] = useState(items);
  const [editing, setEditing] = useState<BuildListItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<BuildListItem | null>(
    null
  );
  const [isPending, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor));

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = builds.findIndex((item) => item.id === active.id);
    const newIndex = builds.findIndex((item) => item.id === over.id);
    const nextBuilds = arrayMove(builds, oldIndex, newIndex).map(
      (build, index) => ({ ...build, order: index + 1 })
    );

    setBuilds(nextBuilds);
    startTransition(() => {
      reorderBuilds(nextBuilds.map((item) => item.id))
        .then((res) => {
          if (res && "error" in res) toast.error(res.error);
          else {
            toast.success("Build order saved");
            router.refresh();
          }
        })
        .catch(() => toast.error("Could not reorder builds."));
    });
  };

  const runDelete = () => {
    if (!pendingDelete) return;

    startTransition(() => {
      deleteBuild(pendingDelete.id)
        .then((res) => {
          if (res && "error" in res) toast.error(res.error);
          else {
            toast.success("Build deleted");
            setPendingDelete(null);
            router.refresh();
          }
        })
        .catch(() => toast.error("Could not delete build."));
    });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_26rem]">
      <ModuleCard className="space-y-5">
        <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-5">
          <div>
            <p className="font-script text-3xl text-tomato">Manage builds</p>
            <p className="text-sm leading-6 text-ink/60">
              Drag projects into the public order. Featured builds power the
              selected works area on the homepage.
            </p>
          </div>
          <Button type="button" onClick={() => setEditing(null)}>
            <Plus />
            New
          </Button>
        </div>

        {builds.length ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={builds.map((build) => build.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {builds.map((build) => (
                  <SortableBuildCard
                    key={build.id}
                    build={build}
                    selected={editing?.id === build.id}
                    disabled={isPending}
                    onEdit={() => setEditing(build)}
                    onDelete={() => setPendingDelete(build)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="rounded-2xl border border-dashed border-ink/20 bg-muted/20 p-8 text-center">
            <p className="text-2xl font-black">No builds yet.</p>
            <p className="mt-2 text-sm text-ink/60">
              Add the first project from the form.
            </p>
          </div>
        )}
      </ModuleCard>

      <BuildForm
        key={editing?.id ?? "new-build"}
        item={editing}
        onCancel={() => setEditing(null)}
      />

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this build?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the build from the CMS and public API. You cannot
              undo this after deleting.
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
