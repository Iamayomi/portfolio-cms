"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  CancelButton,
  SaveButton,
  TextareaField,
  TextField,
} from "@/components/common/form-controls";
import { ModuleCard } from "@/components/common/module-card";
import { updateExperienceHero } from "@/lib/actions/experience.actions";
import type { TExperienceHeroSchema } from "@/lib/schemas/experience.schema";

export function ExperienceHeroForm(props: TExperienceHeroSchema) {
  const router = useRouter();
  const [formData, setFormData] = useState<TExperienceHeroSchema>(props);
  const [isPending, startTransition] = useTransition();
  const isDirty = JSON.stringify(formData) !== JSON.stringify(props);

  const onSubmit = () => {
    startTransition(() => {
      updateExperienceHero(formData)
        .then((res) => {
          if (res && "error" in res) toast.error(res.error);
          else {
            toast.success("Experience hero saved");
            router.refresh();
          }
        })
        .catch(() => toast.error("Something went wrong, try again."));
    });
  };

  return (
    <ModuleCard className="max-w-3xl space-y-5">
      <TextField
        label="Eyebrow"
        defaultValue={formData.eyebrow}
        onChange={(eyebrow) => setFormData((prev) => ({ ...prev, eyebrow }))}
      />
      <TextareaField
        label="Title"
        defaultValue={formData.title}
        maxLength={140}
        onChange={(title) => setFormData((prev) => ({ ...prev, title }))}
      />
      <TextareaField
        label="Description"
        defaultValue={formData.description}
        maxLength={320}
        onChange={(description) =>
          setFormData((prev) => ({ ...prev, description }))
        }
      />
      <TextareaField
        label="Operating note"
        defaultValue={formData.operatingNote}
        maxLength={220}
        hint="Short note for the bottom-corner annotation on the public experience page."
        onChange={(operatingNote) =>
          setFormData((prev) => ({ ...prev, operatingNote }))
        }
      />

      <div className="grid sm:grid-cols-2 gap-3">
        {isDirty ? <CancelButton onCancel={() => setFormData(props)} /> : null}

        <SaveButton
          isPending={isPending}
          disabled={!isDirty}
          label="Save hero"
          onSubmit={onSubmit}
        />
      </div>
    </ModuleCard>
  );
}
