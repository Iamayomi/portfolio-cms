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
import { Badge } from "@/components/ui/badge";
import { deleteBook, reorderBooks } from "@/lib/actions/bookshelf.actions";

import { BookForm } from "./book-form";
import type { BookListItem } from "./bookshelf-manager.types";
import { SortableBookCard } from "./sortable-book-card";

export type { BookListItem } from "./bookshelf-manager.types";

export function BookshelfManager({ items }: { items: BookListItem[] }) {
  const router = useRouter();
  const [books, setBooks] = useState(items);
  const [editing, setEditing] = useState<BookListItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<BookListItem | null>(
    null
  );
  const [isPending, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor));

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = books.findIndex((item) => item.id === active.id);
    const newIndex = books.findIndex((item) => item.id === over.id);
    const nextBooks = arrayMove(books, oldIndex, newIndex).map(
      (book, index) => ({ ...book, order: index + 1 })
    );

    setBooks(nextBooks);
    startTransition(() => {
      reorderBooks(nextBooks.map((item) => item.id))
        .then((res) => {
          if (res && "error" in res) toast.error(res.error);
          else {
            toast.success("Book order saved");
            router.refresh();
          }
        })
        .catch(() => toast.error("Could not reorder books."));
    });
  };

  const runDelete = () => {
    if (!pendingDelete) return;

    startTransition(() => {
      deleteBook(pendingDelete.id)
        .then((res) => {
          if (res && "error" in res) toast.error(res.error);
          else {
            toast.success("Book deleted");
            setPendingDelete(null);
            router.refresh();
          }
        })
        .catch(() => toast.error("Could not delete book."));
    });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_26rem]">
      <ModuleCard className="space-y-5">
        <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-5">
          <div>
            <p className="font-script text-3xl text-tomato">Manage books</p>
            <p className="text-sm leading-6 text-ink/60">
              Drag books into the public order. Published books appear on the
              bookshelf page.
            </p>
          </div>
          <Button type="button" onClick={() => setEditing(null)}>
            <Plus />
            New
          </Button>
        </div>

        {books.length ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={books.map((book) => book.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {books.map((book) => (
                  <SortableBookCard
                    key={book.id}
                    book={book}
                    selected={editing?.id === book.id}
                    disabled={isPending}
                    onEdit={() => setEditing(book)}
                    onDelete={() => setPendingDelete(book)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="rounded-2xl border border-dashed border-ink/20 bg-muted/20 p-8 text-center">
            <p className="text-2xl font-black">No books yet.</p>
            <p className="mt-2 text-sm text-ink/60">
              Add the first book from the form.
            </p>
          </div>
        )}
      </ModuleCard>

      <BookForm
        key={editing?.id ?? "new-book"}
        item={editing}
        onCancel={() => setEditing(null)}
      />

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this book?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the book from the CMS and public API. You cannot
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
