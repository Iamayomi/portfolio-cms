"use client";

import { useRef, useState, useTransition, type ChangeEvent } from "react";
import { Download, FileText, Upload } from "lucide-react";
import { toast } from "sonner";

import { CancelButton, SaveButton } from "@/components/common/form-controls";
import { ModuleCard } from "@/components/common/module-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateContactCv } from "@/lib/actions/contact.actions";
import { handleUploadDocument } from "@/lib/services/upload.service";
import { getDocumentTitle } from "@/lib/utils";

type ContactCvSectionProps = {
  initialCvUrl?: string;
  onSaved: (cvUrl: string) => void;
};

export function ContactCvSection({
  initialCvUrl,
  onSaved,
}: ContactCvSectionProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [cvUrl, setCvUrl] = useState(initialCvUrl || "");
  const [savedCvUrl, setSavedCvUrl] = useState(initialCvUrl || "");
  const [isPending, startTransition] = useTransition();
  const isDirty = cvUrl !== savedCvUrl;
  const documentTitle = getDocumentTitle(cvUrl);

  const onUpload = (event: ChangeEvent<HTMLInputElement>) => {
    handleUploadDocument(event, {
      onComplete: (cvUrl) => {
        setCvUrl(cvUrl);
        toast.success("CV uploaded");
      },
      onError: (message) => toast.error(message),
    });
  };

  const onSubmit = () => {
    startTransition(() => {
      updateContactCv(cvUrl)
        .then((res) => {
          if (res && "error" in res) toast.error(res.error);
          else {
            setSavedCvUrl(cvUrl);
            onSaved(cvUrl);
            toast.success("CV updated");
          }
        })
        .catch(() => toast.error("Could not update CV."));
    });
  };

  const onCancel = () => setCvUrl(savedCvUrl);

  return (
    <ModuleCard className="h-fit space-y-5 bg-honey/25">
      <div>
        <p className="font-script text-3xl text-tomato">CV document</p>
        <p className="text-sm leading-6 text-ink/60">
          Upload the document visitors can download from the contact page.
        </p>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-paper/70 p-4">
        <Label>Current file</Label>
        <div className="mt-3 flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-ink/15 bg-paper">
            <FileText className="size-5" />
          </span>
          <a
            href={cvUrl || "#"}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold max-w-full wrap-break-word"
          >
            {documentTitle}
          </a>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={onUpload}
      />
      <div className="grid gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => inputRef.current?.click()}
        >
          <Upload />
          {cvUrl ? "Change CV" : "Upload CV"}
        </Button>
        {cvUrl && !isDirty ? (
          <Button asChild type="button" variant="outline" className="w-full">
            <a href={cvUrl} download>
              <Download />
              Download
            </a>
          </Button>
        ) : null}
        {isDirty ? (
          <div className="grid gap-2">
            <SaveButton isPending={isPending} onSubmit={onSubmit} />
            <CancelButton onCancel={onCancel} />
          </div>
        ) : null}
      </div>
    </ModuleCard>
  );
}
