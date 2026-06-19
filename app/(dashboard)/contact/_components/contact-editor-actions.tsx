"use client";

import { CancelButton, SaveButton } from "@/components/common/form-controls";

type ContactEditorActionsProps = {
  isDirty: boolean;
  isPending: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

export function ContactEditorActions({
  isDirty,
  isPending,
  onCancel,
  onSubmit,
}: ContactEditorActionsProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-ink/10 pt-5 md:flex-row md:justify-end xl:col-span-2">
      {isDirty ? (
        <CancelButton onCancel={onCancel} className="sm:max-w-40" />
      ) : null}
      <SaveButton
        className="md:w-auto"
        isPending={isPending}
        disabled={!isDirty}
        onSubmit={onSubmit}
      />
    </div>
  );
}
