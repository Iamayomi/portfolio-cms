"use client";

import { TextareaField, TextField } from "@/components/common/form-controls";
import { ModuleCard } from "@/components/common/module-card";

import type { ContactEditorState } from "./contact-editor.types";

export function ContactCopySection({
  formData,
  setFormData,
}: ContactEditorState) {
  return (
    <ModuleCard className="space-y-6">
      <div>
        <p className="font-script text-3xl text-tomato">Page copy</p>
        <p className="text-sm leading-6 text-ink/60">
          Keep the contact page warm, direct, and easy to act on.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Eyebrow"
          defaultValue={formData.hero.eyebrow}
          onChange={(eyebrow) =>
            setFormData((prev) => ({
              ...prev,
              hero: { ...prev.hero, eyebrow },
            }))
          }
        />
        <TextField
          label="Recipient email"
          defaultValue={formData.recipientEmail}
          hint="Work requests from the public form are sent here."
          onChange={(recipientEmail) =>
            setFormData((prev) => ({ ...prev, recipientEmail }))
          }
        />
      </div>

      <TextareaField
        label="Title"
        defaultValue={formData.hero.title}
        maxLength={140}
        onChange={(title) =>
          setFormData((prev) => ({
            ...prev,
            hero: { ...prev.hero, title },
          }))
        }
      />
      <TextareaField
        label="Description"
        defaultValue={formData.hero.description}
        maxLength={320}
        onChange={(description) =>
          setFormData((prev) => ({
            ...prev,
            hero: { ...prev.hero, description },
          }))
        }
      />
      <TextareaField
        label="Helper note"
        defaultValue={formData.helperNote}
        maxLength={260}
        hint="This appears beside the public contact form."
        onChange={(helperNote) =>
          setFormData((prev) => ({ ...prev, helperNote }))
        }
      />
    </ModuleCard>
  );
}
