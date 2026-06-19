"use client";

import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  CancelButton,
  NumberField,
  SaveButton,
  TextareaField,
  TextField,
} from "@/components/common/form-controls";
import { ModuleCard } from "@/components/common/module-card";
import { Button } from "@/components/ui/button";
import { updateLandingNotes } from "@/lib/actions/landing.actions";
import type { TLandingSelectedNotesSchema } from "@/lib/schemas/landing.schema";
import type { LandingContent } from "@/lib/types/landing";

type NotesFormProps = LandingContent["selectedNotes"];

const toPayload = ({
  eyebrow,
  title,
  linkLabel,
  linkHref,
  featuredCount,
}: NotesFormProps): TLandingSelectedNotesSchema => ({
  eyebrow,
  title,
  linkLabel,
  linkHref,
  featuredCount,
});

export function NotesForm(props: NotesFormProps) {
  const router = useRouter();
  const initialPayload = toPayload(props);
  const [formData, setFormData] =
    useState<TLandingSelectedNotesSchema>(initialPayload);
  const [isPending, startTransition] = useTransition();
  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialPayload);

  const [isCountInvalid, setIsCountInvalid] = useState(false);

  const onCancel = () => setFormData(initialPayload);

  const onSubmit = () => {
    startTransition(() => {
      updateLandingNotes(formData)
        .then((res) => {
          if (res && "error" in res) toast.error(res.error);
          else {
            toast.success("Save success");
            router.refresh();
          }
        })
        .catch((error) =>
          toast.error(error?.error ?? "Something went wrong, try again.")
        );
    });
  };

  return (
    <ModuleCard className="max-w-2xl space-y-5">
      <TextField
        label="Eyebrow"
        defaultValue={formData.eyebrow}
        onChange={(eyebrow) => setFormData((prev) => ({ ...prev, eyebrow }))}
      />
      <TextareaField
        label="Title"
        defaultValue={formData.title}
        onChange={(title) => setFormData((prev) => ({ ...prev, title }))}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Link label"
          defaultValue={formData.linkLabel}
          onChange={(linkLabel) =>
            setFormData((prev) => ({ ...prev, linkLabel }))
          }
        />
        <TextField
          label="Link href"
          defaultValue={formData.linkHref}
          onChange={(linkHref) =>
            setFormData((prev) => ({ ...prev, linkHref }))
          }
        />
      </div>
      <NumberField
        label="Featured notes count"
        defaultValue={formData.featuredCount}
        max={20}
        hint="The public endpoint will return up to this many note records."
        onChange={(featuredCount) =>
          setFormData((prev) => ({ ...prev, featuredCount }))
        }
        onValidityChange={setIsCountInvalid}
      />
      <div className="grid sm:grid-cols-2 gap-3">
        {isDirty ? <CancelButton onCancel={onCancel} /> : null}
        <SaveButton
          isPending={isPending}
          onSubmit={onSubmit}
          disabled={!isDirty || isCountInvalid}
        />
      </div>
    </ModuleCard>
  );
}
