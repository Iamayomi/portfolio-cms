"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { TagsInput } from "@/app/(dashboard)/notes/manage/_components/note-tags";
import {
  PublishSwitch,
  SaveButton,
  TextareaField,
  TextField,
} from "@/components/common/form-controls";
import { ModuleCard } from "@/components/common/module-card";
import { Button } from "@/components/ui/button";
import {
  createExperience,
  updateExperience,
} from "@/lib/actions/experience.actions";
import type { TExperienceItemSchema } from "@/lib/schemas/experience.schema";

import {
  emptyExperienceForm,
  type ExperienceListItem,
} from "./experience-manager.types";

type ExperienceFormProps = {
  item: ExperienceListItem | null;
  onCancel: () => void;
};

export function ExperienceForm({ item, onCancel }: ExperienceFormProps) {
  const router = useRouter();
  const initial = item ?? emptyExperienceForm;
  const [formData, setFormData] = useState<TExperienceItemSchema>(initial);
  const [signal, setSignal] = useState("");
  const [isPending, startTransition] = useTransition();
  const isDirty = JSON.stringify(formData) !== JSON.stringify(initial);

  const addSignal = () => {
    const nextSignal = signal.trim();
    if (!nextSignal || formData.signals.includes(nextSignal)) return;
    setFormData((prev) => ({
      ...prev,
      signals: [...prev.signals, nextSignal],
    }));
    setSignal("");
  };

  const removeSignal = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      signals: prev.signals.filter((item) => item !== value),
    }));
  };

  const onSubmit = () => {
    startTransition(() => {
      const action = item
        ? updateExperience(item.id, formData)
        : createExperience(formData);

      action
        .then((res) => {
          if (res && "error" in res) toast.error(res.error);
          else {
            toast.success(item ? "Experience updated" : "Experience created");
            if (!item) setFormData(emptyExperienceForm);
            onCancel();
            router.refresh();
          }
        })
        .catch(() => toast.error("Something went wrong, try again."));
    });
  };

  return (
    <ModuleCard className="h-fit space-y-5 bg-honey/20">
      <div>
        <p className="font-script text-3xl text-tomato">
          {item ? "Edit entry" : "New entry"}
        </p>
        <p className="text-sm leading-6 text-ink/60">
          Keep it short. The frontend should read like a clear timeline.
        </p>
      </div>

      <TextField
        label="Timeline / period"
        defaultValue={formData.period}
        onChange={(period) => setFormData((prev) => ({ ...prev, period }))}
      />
      <TextField
        label="Role"
        defaultValue={formData.role}
        onChange={(role) => setFormData((prev) => ({ ...prev, role }))}
      />
      <TextField
        label="Website URL"
        defaultValue={formData.websiteUrl}
        hint="Optional link to the company, product, or project."
        onChange={(websiteUrl) =>
          setFormData((prev) => ({ ...prev, websiteUrl }))
        }
      />
      <TextareaField
        label="Summary"
        defaultValue={formData.summary}
        onChange={(summary) => setFormData((prev) => ({ ...prev, summary }))}
      />
      <div className="space-y-2">
        <p className="text-sm font-bold">Signals / what I did</p>
        <TagsInput
          tags={formData.signals}
          newTag={signal}
          onNewTagChange={setSignal}
          onAddTag={addSignal}
          onRemoveTag={removeSignal}
          disabled={isPending}
        />
      </div>
      <PublishSwitch
        checked={formData.published}
        checkedLabel="Published"
        unCheckedLabel="Draft"
        onChange={(published) =>
          setFormData((prev) => ({ ...prev, published }))
        }
      />

      <div className="flex flex-col gap-3">
        {isDirty ? (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => {
              setFormData(initial);
              onCancel();
            }}
          >
            <RotateCcw />
            Cancel
          </Button>
        ) : null}
        <SaveButton
          isPending={isPending}
          disabled={!isDirty}
          label={item ? "Save entry" : "Create entry"}
          onSubmit={onSubmit}
        />
      </div>
    </ModuleCard>
  );
}
