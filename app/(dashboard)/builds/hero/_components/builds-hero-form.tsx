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
import { updateBuildsHero } from "@/lib/actions/builds.actions";
import type { TBuildsHeroSchema } from "@/lib/schemas/build.schema";

export function BuildsHeroForm(props: TBuildsHeroSchema) {
  const router = useRouter();
  const [formData, setFormData] = useState<TBuildsHeroSchema>(props);
  const [isPending, startTransition] = useTransition();
  const isDirty = JSON.stringify(formData) !== JSON.stringify(props);

  const onSubmit = () => {
    startTransition(() => {
      updateBuildsHero(formData)
        .then((res) => {
          if (res && "error" in res) toast.error(res.error);
          else {
            toast.success("Builds hero saved");
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

      <div className="grid sm:grid-cols-2 gap-3">
        {isDirty ? <CancelButton onCancel={() => setFormData(props)} /> : null}
        <SaveButton
          isPending={isPending}
          disabled={!isDirty}
          onSubmit={onSubmit}
        />
      </div>
    </ModuleCard>
  );
}
