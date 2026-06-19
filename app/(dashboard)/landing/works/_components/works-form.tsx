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
import { updateLandingWorks } from "@/lib/actions/landing.actions";
import type { TLandingSelectedWorksSchema } from "@/lib/schemas/landing.schema";
import type { LandingContent } from "@/lib/types/landing";

type WorksFormProps = LandingContent["selectedWorks"];

const toPayload = ({
  eyebrow,
  title,
  linkLabel,
  linkHref,
  featuredCount,
}: WorksFormProps): TLandingSelectedWorksSchema => ({
  eyebrow,
  title,
  linkLabel,
  linkHref,
  featuredCount,
});

export function WorksForm(props: WorksFormProps) {
  const router = useRouter();
  const initialPayload = toPayload(props);
  const [formData, setFormData] =
    useState<TLandingSelectedWorksSchema>(initialPayload);
  const [isPending, startTransition] = useTransition();
  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialPayload);

  const [isCountInvalid, setIsCountInvalid] = useState(false);

  const onCancel = () => setFormData(initialPayload);

  const onSubmit = () => {
    startTransition(() => {
      updateLandingWorks(formData)
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
        label="Featured works count"
        defaultValue={formData.featuredCount}
        max={10}
        hint="The public endpoint will return up to this many featured build records."
        onChange={(featuredCount) =>
          setFormData((prev) => ({ ...prev, featuredCount }))
        }
        onValidityChange={setIsCountInvalid}
      />
      <p className="rounded-xl border border-ink/10 bg-muted/30 px-4 py-3 text-sm leading-6 text-ink/60">
        Featured works will come from build records marked as featured. This
        page only controls the section copy and archive link.
      </p>
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
