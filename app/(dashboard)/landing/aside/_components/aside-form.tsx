"use client";

import { RotateCcw } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { updateLandingAside } from "@/lib/actions/landing.actions";
import type { TLandingAsideSchema } from "@/lib/schemas/landing.schema";
import type { LandingContent } from "@/lib/types/landing";

type AsideFormProps = LandingContent["aside"];

const linesToText = (items: string[]) => items.join("\n");
const textToLines = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const normalize = (aside: AsideFormProps): TLandingAsideSchema => ({
  studyTitle: aside.studyTitle ?? "",
  studyDescription: aside.studyDescription ?? "",
  studyItems: aside.studyItems ?? [],
  toolboxTitle: aside.toolboxTitle ?? "",
  toolboxDescription: aside.toolboxDescription ?? "",
  skillGroups: aside.skillGroups.map((group) => ({
    title: group.title ?? "",
    description: group.description ?? "",
    skills: group.skills ?? [],
  })),
});

export function AsideForm(props: AsideFormProps) {
  const router = useRouter();
  const initialPayload = normalize(props);
  const [formData, setFormData] = useState<TLandingAsideSchema>(initialPayload);
  const [studyItemsText, setStudyItemsText] = useState(
    linesToText(initialPayload.studyItems)
  );
  const [skillTexts, setSkillTexts] = useState(
    initialPayload.skillGroups.map((group) => linesToText(group.skills))
  );
  const [isPending, startTransition] = useTransition();

  const payload: TLandingAsideSchema = {
    ...formData,
    studyItems: textToLines(studyItemsText),
    skillGroups: formData.skillGroups.map((group, index) => ({
      ...group,
      skills: textToLines(skillTexts[index] ?? ""),
    })),
  };
  const isDirty = JSON.stringify(payload) !== JSON.stringify(initialPayload);

  const updateGroup = (
    index: number,
    key: "title" | "description",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      skillGroups: prev.skillGroups.map((group, groupIndex) =>
        groupIndex === index ? { ...group, [key]: value } : group
      ),
    }));
  };

  const updateSkillText = (index: number, value: string) => {
    setSkillTexts((prev) =>
      prev.map((text, textIndex) => (textIndex === index ? value : text))
    );
  };

  const onCancel = () => {
    setFormData(initialPayload);
    setStudyItemsText(linesToText(initialPayload.studyItems));
    setSkillTexts(
      initialPayload.skillGroups.map((group) => linesToText(group.skills))
    );
  };

  const onSubmit = () => {
    startTransition(() => {
      updateLandingAside(payload)
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
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-2">
        <ModuleCard className="space-y-5">
          <div>
            <p className="font-script text-3xl text-tomato">Current study</p>
            <p className="mt-1 text-sm leading-6 text-ink/55">
              Short copy for the first aside block.
            </p>
          </div>
          <TextField
            label="Study title"
            defaultValue={formData.studyTitle}
            onChange={(studyTitle) =>
              setFormData((prev) => ({ ...prev, studyTitle }))
            }
          />
          <TextareaField
            label="Study description"
            defaultValue={formData.studyDescription}
            onChange={(studyDescription) =>
              setFormData((prev) => ({ ...prev, studyDescription }))
            }
          />
          <TextareaField
            label="Study list"
            defaultValue={studyItemsText}
            hint="One current study item per line."
            onChange={setStudyItemsText}
          />
        </ModuleCard>

        <ModuleCard className="space-y-5 bg-honey/25">
          <div>
            <p className="font-script text-3xl text-tomato">Toolbox intro</p>
            <p className="mt-1 text-sm leading-6 text-ink/55">
              This explains the groups before the reader scans the tools.
            </p>
          </div>
          <TextField
            label="Toolbox title"
            defaultValue={formData.toolboxTitle}
            onChange={(toolboxTitle) =>
              setFormData((prev) => ({ ...prev, toolboxTitle }))
            }
          />
          <TextareaField
            label="Toolbox description"
            defaultValue={formData.toolboxDescription}
            onChange={(toolboxDescription) =>
              setFormData((prev) => ({ ...prev, toolboxDescription }))
            }
          />
        </ModuleCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {formData.skillGroups.map((group, index) => (
          <ModuleCard key={index} className="space-y-4 bg-paper/70">
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-ink/45">
              Toolbox group {index + 1}
            </p>
            <TextField
              label="Title"
              defaultValue={group.title}
              onChange={(title) => updateGroup(index, "title", title)}
            />
            <TextareaField
              label="Description"
              defaultValue={group.description}
              onChange={(description) =>
                updateGroup(index, "description", description)
              }
            />
            <TextareaField
              label="Skills"
              defaultValue={skillTexts[index] ?? ""}
              hint="One skill per line."
              onChange={(value) => updateSkillText(index, value)}
            />
          </ModuleCard>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {isDirty ? (
          <CancelButton onCancel={onCancel} className="sm:max-w-52" />
        ) : null}
        <SaveButton
          isPending={isPending}
          onSubmit={onSubmit}
          disabled={!isDirty}
          className="sm:max-w-52"
        />
      </div>
    </div>
  );
}
