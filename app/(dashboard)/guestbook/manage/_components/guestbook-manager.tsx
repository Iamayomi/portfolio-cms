"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Check, Pencil, Trash2, X } from "lucide-react";
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
import {
  approveGuestbookEntry,
  deleteGuestbookEntry,
  rejectGuestbookEntry,
} from "@/lib/actions/guestbook.actions";
import { cn } from "@/lib/utils";
import { handleImageUpload } from "@/lib/services/upload.service";

import type { GuestbookEntryItem } from "./guestbook-manager.types";
import { GuestbookEntryForm } from "./guestbook-entry-form";

export type { GuestbookEntryItem } from "./guestbook-manager.types";

export function GuestbookManager({ items }: { items: GuestbookEntryItem[] }) {
  const router = useRouter();
  const [entries, setEntries] = useState(items);
  const [editing, setEditing] = useState<GuestbookEntryItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<GuestbookEntryItem | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  const runApprove = (entry: GuestbookEntryItem) => {
    startTransition(() => {
      approveGuestbookEntry(entry.id)
        .then((res) => {
          if (res && "error" in res) toast.error(res.error);
          else {
            toast.success("Entry approved");
            router.refresh();
          }
        })
        .catch(() => toast.error("Could not approve entry."));
    });
  };

  const runReject = (entry: GuestbookEntryItem) => {
    startTransition(() => {
      rejectGuestbookEntry(entry.id)
        .then((res) => {
          if (res && "error" in res) toast.error(res.error);
          else {
            toast.success("Entry rejected");
            router.refresh();
          }
        })
        .catch(() => toast.error("Could not reject entry."));
    });
  };

  const runDelete = () => {
    if (!pendingDelete) return;

    startTransition(() => {
      deleteGuestbookEntry(pendingDelete.id)
        .then((res) => {
          if (res && "error" in res) toast.error(res.error);
          else {
            toast.success("Entry deleted");
            setPendingDelete(null);
            router.refresh();
          }
        })
        .catch(() => toast.error("Could not delete entry."));
    });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_26rem]">
      <ModuleCard className="space-y-5">
        <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-5">
          <div>
            <p className="font-script text-3xl text-tomato">Manage entries</p>
            <p className="text-sm leading-6 text-ink/60">
              Review and approve guestbook entries. Only approved entries appear on the public page.
            </p>
          </div>
        </div>

        {entries.length ? (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={cn(
                  "rounded-2xl border border-ink/10 bg-paper/70 p-4",
                  entry.approved ? "border-honey/30" : "border-ink/20"
                )}
              >
                <div className="grid gap-3 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-start">
                  <div className="flex items-center gap-3">
                    {entry.avatarUrl ? (
                      <div className="relative size-10 overflow-hidden rounded-full">
                        <Image
                          src={entry.avatarUrl}
                          alt={entry.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="grid size-10 place-items-center rounded-full bg-ink/10 text-sm font-bold">
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold">{entry.name}</p>
                      {entry.website ? (
                        <a
                          href={entry.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-ink/50 hover:text-ink"
                        >
                          {entry.website}
                        </a>
                      ) : null}
                      <Badge variant={entry.approved ? "default" : "outline"}>
                        {entry.approved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-ink/70">
                      {entry.message}
                    </p>
                    <p className="mt-2 text-xs text-ink/40">
                      {new Date(entry.createdAt).toLocaleDateString("en", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2 md:justify-end">
                    {!entry.approved ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => runApprove(entry)}
                        disabled={isPending}
                      >
                        <Check />
                        Approve
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => runReject(entry)}
                        disabled={isPending}
                      >
                        <X />
                        Reject
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(entry)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setPendingDelete(entry)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-ink/20 bg-muted/20 p-8 text-center">
            <p className="text-2xl font-black">No entries yet.</p>
            <p className="mt-2 text-sm text-ink/60">
              Entries will appear here when visitors sign the guestbook.
            </p>
          </div>
        )}
      </ModuleCard>

      <GuestbookEntryForm
        key={editing?.id ?? "new-entry"}
        item={editing}
        onCancel={() => setEditing(null)}
      />

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the entry from the CMS and public API. You cannot
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
