"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

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
import { deleteNoteComment } from "@/lib/actions/notes.actions";
import type { NoteCommentContent } from "@/lib/types/notes";
import { formatDate } from "@/lib/utils";

type NoteCommentModerationProps = {
  noteSlug: string;
  comments: NoteCommentContent[];
  canModerate: boolean;
};

export function NoteCommentModeration({
  noteSlug,
  comments,
  canModerate,
}: NoteCommentModerationProps) {
  const [target, setTarget] = useState<NoteCommentContent | null>(null);
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    if (!target?._id) return;

    startTransition(async () => {
      await deleteNoteComment(target._id!.toString(), noteSlug);
      setTarget(null);
    });
  };

  return (
    <>
      <div className="mt-5 divide-y border-t border-dashed divide-dashed divide-ink/10">
        {comments.map((comment) => (
          <article key={comment._id?.toString()} className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-bold">{comment.name}</p>
                {comment.parentId ? (
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink/40">
                    Reply
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink/45">
                  {formatDate(comment.createdAt)} / {comment.likes || 0} likes
                </p>
                {canModerate ? (
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() => setTarget(comment)}
                    aria-label={`Delete comment from ${comment.name}`}
                  >
                    <Trash2 />
                  </Button>
                ) : null}
              </div>
            </div>
            <p className="mt-2 text-sm leading-7 text-ink/70">
              {comment.content}
            </p>
          </article>
        ))}
      </div>

      <AlertDialog open={Boolean(target)} onOpenChange={() => setTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this comment thread?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the comment and every reply under it. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={onDelete}
            >
              Delete thread
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
