"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { TagsInput } from "@/app/(dashboard)/notes/manage/_components/note-tags";
import {
  CancelButton,
  PublishSwitch,
  SaveButton,
  TextareaField,
  TextField,
} from "@/components/common/form-controls";
import { ModuleCard } from "@/components/common/module-card";
import { createBuild, updateBuild } from "@/lib/actions/builds.actions";
import type { TBuildItemSchema } from "@/lib/schemas/build.schema";

import { emptyBuildForm, type BuildListItem } from "./builds-manager.types";

type BuildFormProps = {
  item: BuildListItem | null;
  onCancel: () => void;
};

export function BuildForm({ item, onCancel }: BuildFormProps) {
  const router = useRouter();
  const initial = item ?? emptyBuildForm;
  const [formData, setFormData] = useState<TBuildItemSchema>(initial);
  const [tool, setTool] = useState("");
  const [isPending, startTransition] = useTransition();
  const isDirty = JSON.stringify(formData) !== JSON.stringify(initial);

  const addTool = () => {
    const nextTool = tool.trim();
    if (!nextTool || formData.stack.includes(nextTool)) return;
    setFormData((prev) => ({ ...prev, stack: [...prev.stack, nextTool] }));
    setTool("");
  };

  const removeTool = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      stack: prev.stack.filter((item) => item !== value),
    }));
  };

  const onSubmit = () => {
    startTransition(() => {
      const action = item
        ? updateBuild(item.id, formData)
        : createBuild(formData);

      action
        .then((res) => {
          if (res && "error" in res) toast.error(res.error);
          else {
            toast.success(item ? "Build updated" : "Build created");
            if (!item) setFormData(emptyBuildForm);
            onCancel();
            router.refresh();
          }
        })
        .catch(() => toast.error("Something went wrong, try again."));
    });
  };

  return (
    <ModuleCard className="h-fit space-y-5 bg-sky/20">
      <div>
        <p className="font-script text-3xl text-tomato">
          {item ? "Edit build" : "New build"}
        </p>
        <p className="text-sm leading-6 text-ink/60">
          Write like a project note, not a sales pitch.
        </p>
      </div>

      <TextField
        label="Title"
        defaultValue={formData.title}
        onChange={(title) => setFormData((prev) => ({ ...prev, title }))}
      />
      <TextField
        label="Category"
        defaultValue={formData.category}
        onChange={(category) => setFormData((prev) => ({ ...prev, category }))}
      />
      <div className="space-y-2">
        <label
          htmlFor="build-status"
          className="text-sm font-medium leading-none"
        >
          Status
        </label>
        <select
          id="build-status"
          value={formData.status}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              status: event.target.value as TBuildItemSchema["status"],
            }))
          }
          className="h-11 w-full rounded-xl border border-input bg-transparent px-3 text-sm outline-none transition-colors focus:border-ring"
        >
          <option value="active">Active</option>
          <option value="in-progress">In progress</option>
        </select>
      </div>
      <TextareaField
        label="Summary"
        defaultValue={formData.summary}
        onChange={(summary) => setFormData((prev) => ({ ...prev, summary }))}
      />
      <TextareaField
        label="Proof note"
        defaultValue={formData.proofNote}
        hint="One short line explaining why this project matters."
        onChange={(proofNote) =>
          setFormData((prev) => ({ ...prev, proofNote }))
        }
      />
      <TextField
        label="GitHub URL"
        defaultValue={formData.githubUrl}
        onChange={(githubUrl) =>
          setFormData((prev) => ({ ...prev, githubUrl }))
        }
      />
      <TextField
        label="Live URL"
        defaultValue={formData.liveUrl}
        onChange={(liveUrl) => setFormData((prev) => ({ ...prev, liveUrl }))}
      />
      <div className="space-y-2">
        <p className="text-sm font-bold">Stack</p>
        <TagsInput
          tags={formData.stack}
          newTag={tool}
          onNewTagChange={setTool}
          onAddTag={addTool}
          onRemoveTag={removeTool}
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
      <PublishSwitch
        checked={formData.featured}
        checkedLabel="Featured"
        unCheckedLabel="Not featured"
        hint="Featured builds can appear on the landing page."
        onChange={(featured) => setFormData((prev) => ({ ...prev, featured }))}
      />

      <div className="flex flex-col gap-3">
        {isDirty ? (
          <CancelButton onCancel={() => setFormData(initial)} />
        ) : null}

        <SaveButton
          isPending={isPending}
          disabled={!isDirty}
          label={item ? "Save build" : "Create build"}
          onSubmit={onSubmit}
        />
      </div>
    </ModuleCard>
  );
}
