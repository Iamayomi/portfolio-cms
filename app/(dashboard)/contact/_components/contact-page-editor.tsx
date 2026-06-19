"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateContactPage } from "@/lib/actions/contact.actions";
import type { TContactPageSchema } from "@/lib/schemas/contact.schema";

import { ContactCopySection } from "./contact-copy-section";
import { ContactCvSection } from "./contact-cv-section";
import { ContactEditorActions } from "./contact-editor-actions";
import { ContactSocialsSection } from "./contact-socials-section";

type ContactPageEditorProps = {
  content: TContactPageSchema;
};

export function ContactPageEditor({ content }: ContactPageEditorProps) {
  const [formData, setFormData] = useState<TContactPageSchema>({
    ...content,
    cvUrl: content.cvUrl,
  });
  const [isPending, startTransition] = useTransition();
  const contactFormData = { ...formData, cvUrl: content.cvUrl };
  const isDirty =
    JSON.stringify(contactFormData) !== JSON.stringify({
      ...content,
      cvUrl: content.cvUrl,
    });
  const editorState = { formData, setFormData };

  const onSubmit = () => {
    startTransition(() => {
      updateContactPage(contactFormData)
        .then((res) => {
          if (res && "error" in res) toast.error(res.error);
          else toast.success("Contact updated");
        })
        .catch(() => toast.error("Update error."));
    });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_25rem]">
      <ContactCopySection {...editorState} />
      <div className="space-y-5">
        <ContactCvSection
          initialCvUrl={content.cvUrl}
          onSaved={(cvUrl) => setFormData((prev) => ({ ...prev, cvUrl }))}
        />
        <ContactSocialsSection {...editorState} />
      </div>
      <ContactEditorActions
        isDirty={isDirty}
        isPending={isPending}
        onCancel={() => setFormData(content)}
        onSubmit={onSubmit}
      />
    </div>
  );
}
