"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  CancelButton,
  ImagePicker,
  PublishSwitch,
  SaveButton,
  TextareaField,
  TextField,
} from "@/components/common/form-controls";
import { ModuleCard } from "@/components/common/module-card";
import { updateGuestbookEntry } from "@/lib/actions/guestbook.actions";
import { handleImageUpload } from "@/lib/services/upload.service";
import type { TGuestbookEntrySchema } from "@/lib/schemas/guestbook.schema";

import { emptyGuestbookForm, type GuestbookEntryItem } from "./guestbook-manager.types";

type GuestbookEntryFormProps = {
  item: GuestbookEntryItem | null;
  onCancel: () => void;
};

export function GuestbookEntryForm({ item, onCancel }: GuestbookEntryFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initial = item ?? emptyGuestbookForm;
  const [formData, setFormData] = useState<TGuestbookEntrySchema>(initial);
  const [isPending, startTransition] = useTransition();
  const isDirty = JSON.stringify(formData) !== JSON.stringify(initial);

  const onImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(event, {
      folder: "guestbook",
      onComplete: (url) => {
        setFormData((prev) => ({ ...prev, avatarUrl: url }));
      },
      onError: (msg) => toast.error(msg),
    });
  };

  const onSubmit = () => {
    if (!item) return;

    startTransition(() => {
      updateGuestbookEntry(item.id, formData)
        .then((res) => {
          if (res && "error" in res) toast.error(res.error);
          else {
            toast.success("Entry updated");
            onCancel();
            router.refresh();
          }
        })
        .catch(() => toast.error("Something went wrong, try again."));
    });
  };

  if (!item) {
    return (
      <ModuleCard className="h-fit space-y-5 bg-sky/20">
        <div>
          <p className="font-script text-3xl text-tomato">Edit entry</p>
          <p className="text-sm leading-6 text-ink/60">
            Select an entry from the list to edit it.
          </p>
        </div>
      </ModuleCard>
    );
  }

  return (
    <ModuleCard className="h-fit space-y-5 bg-sky/20">
      <div>
        <p className="font-script text-3xl text-tomato">Edit entry</p>
        <p className="text-sm leading-6 text-ink/60">
          Update the guestbook entry details.
        </p>
      </div>

      <TextField
        label="Name"
        defaultValue={formData.name}
        onChange={(name) => setFormData((prev) => ({ ...prev, name }))}
      />
      <TextField
        label="Email"
        defaultValue={formData.email}
        onChange={(email) => setFormData((prev) => ({ ...prev, email }))}
      />
      <TextField
        label="Website"
        defaultValue={formData.website}
        onChange={(website) => setFormData((prev) => ({ ...prev, website }))}
      />
      <ImagePicker
        label="Avatar"
        value={formData.avatarUrl || ""}
        inputRef={fileInputRef}
        hint="Optional profile image for the visitor."
        onUpload={onImageUpload}
        containerClassName="!h-32"
        className="!object-contain"
      />
      <TextareaField
        label="Message"
        defaultValue={formData.message}
        onChange={(message) => setFormData((prev) => ({ ...prev, message }))}
      />
      <PublishSwitch
        checked={formData.approved}
        checkedLabel="Approved"
        unCheckedLabel="Pending"
        hint="Approved entries are visible on the public guestbook page."
        onChange={(approved) => setFormData((prev) => ({ ...prev, approved }))}
      />

      <div className="flex flex-col gap-3">
        {isDirty ? (
          <CancelButton onCancel={() => setFormData(initial)} />
        ) : null}

        <SaveButton
          isPending={isPending}
          disabled={!isDirty}
          label="Save entry"
          onSubmit={onSubmit}
        />
      </div>
    </ModuleCard>
  );
}
