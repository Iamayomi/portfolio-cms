"use client";

import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { updateLandingHero } from "@/lib/actions/landing.actions";
import { LandingContent } from "@/lib/types/landing";
import { handleImageUpload } from "@/lib/services/upload.service";
import { THeroSectionSchema } from "@/lib/schemas/landing.schema";

import { Button } from "@/components/ui/button";
import {
  CancelButton,
  ImagePicker,
  PublishSwitch,
  SaveButton,
  TextareaField,
  TextField,
} from "@/components/common/form-controls";
import { ModuleCard } from "@/components/common/module-card";
import { Label } from "@/components/ui/label";

export const HeroForm = (hero: LandingContent["hero"]) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    ...hero,
  });

  const imageRef = useRef<HTMLInputElement | null>(null);

  const initialSnapshotsText = useMemo(
    () =>
      hero.snapshots.map((item) => `${item.label}: ${item.value}`).join("\n"),
    [hero.snapshots]
  );

  const [snapshotsText, setSnapshotsText] = useState(initialSnapshotsText);

  const parseSnapshots = (value: string) =>
    value
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [label, ...rest] = line.split(":");
        return {
          label: label?.trim() || "Note",
          value: rest.join(":").trim() || line,
        };
      });

  const payload = {
    ...formData,
    snapshots: parseSnapshots(snapshotsText),
  };

  const isDirty = JSON.stringify(payload) !== JSON.stringify(hero);

  const onCancel = () => {
    setFormData({ ...hero });
    setSnapshotsText(initialSnapshotsText);
  };

  const onUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(event, {
      onComplete: (url) => {
        toast.success("Image uploaded");
        setFormData((prev) => ({ ...prev, portraitImageUrl: url }));
      },
      onError: (message) => toast.error(message),
    });
  };

  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(() => {
      updateLandingHero(payload as THeroSectionSchema)
        .then((res) => {
          if (res && "error" in res) {
            toast.error(res.error);
          } else {
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
    <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <ModuleCard className="space-y-6">
        <TextField
          label="Page label"
          defaultValue={formData.pageLabel}
          onChange={(pageLabel) =>
            setFormData((prev) => ({ ...prev, pageLabel }))
          }
        />
        <TextField
          label="Greeting"
          defaultValue={formData.greeting}
          onChange={(greeting) =>
            setFormData((prev) => ({ ...prev, greeting }))
          }
        />
        <TextareaField
          label="Headline"
          defaultValue={formData.headline}
          onChange={(headline) =>
            setFormData((prev) => ({ ...prev, headline }))
          }
        />
        <TextareaField
          label="Intro"
          defaultValue={formData.intro}
          onChange={(intro) => setFormData((prev) => ({ ...prev, intro }))}
        />

        <ImagePicker
          label="Floating portrait image"
          hint="A good choice would be a portrait with the face well centered. This maps to the cursor-following portrait."
          value={formData.portraitImageUrl}
          inputRef={imageRef}
          onUpload={onUpload}
        />
      </ModuleCard>

      <ModuleCard className="space-y-8 bg-honey/30 max-h-fit">
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-1">
          <div className="space-y-3">
            <TextField
              label="Primary CTA label"
              defaultValue={formData.primaryCta.label}
              onChange={(label) =>
                setFormData((prev) => ({
                  ...prev,
                  primaryCta: {
                    ...prev.primaryCta,
                    label,
                  },
                }))
              }
            />

            <TextField
              label="Primary CTA href"
              defaultValue={formData.primaryCta.href}
              onChange={(href) =>
                setFormData((prev) => ({
                  ...prev,
                  primaryCta: {
                    ...prev.primaryCta,
                    href,
                  },
                }))
              }
            />
            <div>
              <Label>Publish Primary CTA?</Label>
              <PublishSwitch
                checked={formData.primaryCta.published}
                onChange={(published) =>
                  setFormData((prev) => ({
                    ...prev,
                    primaryCta: { ...prev.primaryCta, published },
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-3">
            <TextField
              label="Secondary CTA label"
              defaultValue={formData.secondaryCta.label}
              onChange={(label) =>
                setFormData((prev) => ({
                  ...prev,
                  secondaryCta: {
                    ...prev.secondaryCta,
                    label,
                  },
                }))
              }
            />
            <TextField
              label="Secondary CTA href"
              defaultValue={formData.secondaryCta.href}
              onChange={(href) =>
                setFormData((prev) => ({
                  ...prev,
                  secondaryCta: {
                    ...prev.secondaryCta,
                    href,
                  },
                }))
              }
            />

            <div>
              <Label>Publish Secondary CTA?</Label>
              <PublishSwitch
                checked={formData.secondaryCta.published}
                onChange={(published) =>
                  setFormData((prev) => ({
                    ...prev,
                    secondaryCta: { ...prev.secondaryCta, published },
                  }))
                }
              />
            </div>
          </div>
        </div>

        <TextareaField
          label="Side notes"
          name="snapshots"
          hint="One per line. Use the format Label: short note."
          defaultValue={snapshotsText}
          onChange={setSnapshotsText}
        />

        <div className="grid sm:grid-cols-2 gap-3">
          {isDirty ? <CancelButton onCancel={onCancel} /> : null}

          <SaveButton
            isPending={isPending}
            onSubmit={onSubmit}
            disabled={!isDirty}
          />
        </div>
      </ModuleCard>
    </div>
  );
};
