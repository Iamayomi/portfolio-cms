"use client";

import { TextField } from "@/components/common/form-controls";
import { ModuleCard } from "@/components/common/module-card";
import type { TContactPageSchema } from "@/lib/schemas/contact.schema";

import type { ContactEditorState } from "./contact-editor.types";

const socialFields: Array<{
  key: keyof TContactPageSchema["socials"];
  label: string;
  hint: string;
}> = [
  {
    key: "email",
    label: "Email",
    hint: "Use a direct email address or mailto link.",
  },
  {
    key: "github",
    label: "GitHub",
    hint: "Username or full profile URL.",
  },
  {
    key: "x",
    label: "X / Twitter",
    hint: "Handle or full profile URL.",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    hint: "Profile slug or full profile URL.",
  },
  {
    key: "instagram",
    label: "Instagram",
    hint: "Handle or full profile URL.",
  },
  {
    key: "youtube",
    label: "YouTube",
    hint: "Channel URL or @handle.",
  },
  {
    key: "tiktok",
    label: "TikTok",
    hint: "Profile URL or @handle.",
  },
  {
    key: "medium",
    label: "Medium",
    hint: "Username or Medium profile URL.",
  },
  {
    key: "facebook",
    label: "Facebook",
    hint: "Username or full profile URL.",
  },
  {
    key: "threads",
    label: "Threads",
    hint: "Handle or full profile URL.",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    hint: "Phone number or wa.me link.",
  },
  {
    key: "telegram",
    label: "Telegram",
    hint: "Username or t.me link.",
  },
  {
    key: "website",
    label: "Website",
    hint: "Any other personal or product link.",
  },
];

export function ContactSocialsSection({
  formData,
  setFormData,
}: ContactEditorState) {
  return (
    <ModuleCard className="space-y-6">
      <div>
        <p className="font-script text-3xl text-tomato">Social handles</p>
        <p className="text-sm leading-6 text-ink/60">
          Leave any handle blank to hide it from the public page.
        </p>
      </div>

      <div className="grid gap-4">
        {socialFields.map((field) => (
          <TextField
            key={field.key}
            label={field.label}
            hint={field.hint}
            defaultValue={formData.socials[field.key]}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                socials: { ...prev.socials, [field.key]: value },
              }))
            }
          />
        ))}
      </div>
    </ModuleCard>
  );
}
