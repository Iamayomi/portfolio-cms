"use client";

import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { ModuleCard } from "@/components/common/module-card";
import { Pagination } from "@/components/common/pagination";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteNote, deleteNotes } from "@/lib/actions/notes.actions";
import { cn, formatDateTime } from "@/lib/utils";

export type NoteListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  featured: boolean;
  readTime: string;
  updatedAt: string;
  tags: string[];
};

type NotesManagerProps = {
  notes: NoteListItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    showingStart: number;
    showingEnd: number;
    totalItems: number;
    limit: number;
  };
  filters: {
    q?: string;
    published?: string;
    featured?: string;
  };
};

export function NotesManager({
  notes,
  pagination,
  filters,
}: NotesManagerProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [pendingDelete, setPendingDelete] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const allSelected = notes.length > 0 && selected.length === notes.length;
  const deleteCopy = useMemo(
    () =>
      pendingDelete.length > 1
        ? `${pendingDelete.length} selected notes`
        : "this note",
    [pendingDelete.length]
  );

  const toggleAll = () => {
    setSelected(allSelected ? [] : notes.map((note) => note.slug));
  };

  const toggleOne = (slug: string) => {
    setSelected((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug]
    );
  };

  const runDelete = () => {
    const slugs = pendingDelete;

    startTransition(() => {
      const action =
        slugs.length === 1 ? deleteNote(slugs[0]) : deleteNotes(slugs);

      action
        .then((res) => {
          if (res && "error" in res) {
            toast.error(res.error);
            return;
          }

          toast.success(slugs.length > 1 ? "Notes deleted" : "Note deleted");
          setSelected([]);
          setPendingDelete([]);
          router.refresh();
        })
        .catch(() => toast.error("Something went wrong, try again."));
    });
  };

  return (
    <ModuleCard className="space-y-5">
      <div className="flex flex-col gap-3 border-b border-ink/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-script text-3xl text-tomato">Manage notes</p>
          <p className="text-sm leading-6 text-ink/60">
            Compact archive control. Search, filter, select, and clean up notes.
          </p>
        </div>
        <Button asChild>
          <Link href="/notes/manage/new">
            <Plus />
            New note
          </Link>
        </Button>
      </div>

      <form className="grid gap-3 md:grid-cols-[minmax(0,1fr)_10rem_10rem_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
          <Input
            name="q"
            defaultValue={filters.q}
            placeholder="Search notes..."
            className="pl-9"
          />
        </div>
        <select
          name="published"
          defaultValue={filters.published || "all"}
          className="h-10 rounded-xl border border-input bg-transparent px-3 text-sm"
        >
          <option value="all">All status</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
        <select
          name="featured"
          defaultValue={filters.featured || "all"}
          className="h-10 rounded-xl border border-input bg-transparent px-3 text-sm"
        >
          <option value="all">All notes</option>
          <option value="true">Featured</option>
          <option value="false">Not featured</option>
        </select>
        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>

      <div className="flex min-h-10 items-center justify-between gap-3">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-ink/45">
          {pagination.totalItems} total notes
        </p>
        {selected.length ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => setPendingDelete(selected)}
          >
            <Trash2 />
            Delete selected ({selected.length})
          </Button>
        ) : null}
      </div>

      {notes.length ? (
        <div className="overflow-hidden rounded-2xl border border-ink/10">
          <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_8rem_7rem_8rem] items-center gap-3 border-b border-ink/10 bg-muted/30 px-3 py-2 font-mono text-[0.65rem] font-black uppercase tracking-[0.18em] text-ink/45 max-lg:hidden">
            <input
              type="checkbox"
              aria-label="Select all notes"
              checked={allSelected}
              onChange={toggleAll}
            />
            <span>Title</span>
            <span>Status</span>
            <span>Featured</span>
            <span className="text-right">Actions</span>
          </div>

          <div className="divide-y divide-ink/10">
            {notes.map((note) => (
              <div key={note.slug}>
                <div
                  role="button"
                  tabIndex={0}
                  className="hidden cursor-pointer gap-3 px-3 py-3 transition hover:bg-muted/25 lg:grid lg:grid-cols-[2.5rem_minmax(0,1fr)_8rem_7rem_8rem] lg:items-center"
                  onClick={() => router.push(`/notes/manage/${note.slug}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter")
                      router.push(`/notes/manage/${note.slug}`);
                  }}
                >
                  <input
                    type="checkbox"
                    aria-label={`Select ${note.title}`}
                    checked={selected.includes(note.slug)}
                    onChange={() => toggleOne(note.slug)}
                    onClick={(event) => event.stopPropagation()}
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black">{note.title}</p>
                    <p className="truncate font-mono text-xs text-ink/45">
                      Last updated {formatDateTime(note.updatedAt)}
                    </p>
                  </div>

                  <Badge
                    variant={note.published ? "default" : "outline"}
                    className="w-fit"
                  >
                    {note.published ? "Published" : "Draft"}
                  </Badge>

                  <Badge
                    variant={note.featured ? "secondary" : "outline"}
                    className={cn("w-fit", note.featured && "bg-honey text-ink")}
                  >
                    {note.featured ? "Featured" : "No"}
                  </Badge>

                  <div className="flex items-center gap-2 lg:justify-end">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Link href={`/notes/manage/${note.slug}/edit`}>
                        <Edit3 />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={isPending}
                      onClick={(event) => {
                        event.stopPropagation();
                        setPendingDelete([note.slug]);
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>

                <article className="p-3 lg:hidden">
                  <div className="rounded-2xl border border-ink/10 bg-paper/70 p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        aria-label={`Select ${note.title}`}
                        checked={selected.includes(note.slug)}
                        onChange={() => toggleOne(note.slug)}
                        className="mt-1"
                      />
                      <button
                        type="button"
                        className="min-w-0 flex-1 text-left"
                        onClick={() => router.push(`/notes/manage/${note.slug}`)}
                      >
                        <p className="line-clamp-2 text-base font-black leading-6">
                          {note.title}
                        </p>
                        <p className="mt-1 font-mono text-xs leading-5 text-ink/45">
                          Updated {formatDateTime(note.updatedAt)}
                        </p>
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge
                        variant={note.published ? "default" : "outline"}
                        className="w-fit"
                      >
                        {note.published ? "Published" : "Draft"}
                      </Badge>
                      <Badge
                        variant={note.featured ? "secondary" : "outline"}
                        className={cn(
                          "w-fit",
                          note.featured && "bg-honey text-ink"
                        )}
                      >
                        {note.featured ? "Featured" : "Not featured"}
                      </Badge>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/notes/manage/${note.slug}/edit`}>
                          <Edit3 />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={isPending}
                        onClick={() => setPendingDelete([note.slug])}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-ink/20 bg-muted/20 p-8 text-center">
          <p className="text-2xl font-black">No notes found.</p>
          <p className="mt-2 text-sm text-ink/60">
            Try a different filter or start a new note.
          </p>
        </div>
      )}

      <Pagination
        pathname="/notes/manage"
        searchParams={{
          q: filters.q || "",
          published: filters.published || "",
          featured: filters.featured || "",
        }}
        itemName="notes"
        {...pagination}
      />

      <AlertDialog
        open={pendingDelete.length > 0}
        onOpenChange={(open) => !open && setPendingDelete([])}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteCopy}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {deleteCopy} from the CMS. This
              action cannot be undone.
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
    </ModuleCard>
  );
}
