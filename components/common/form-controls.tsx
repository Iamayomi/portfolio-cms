"use client";

import Image from "next/image";
import { useEffect, useState, type ChangeEvent, type RefObject } from "react";
import { ImagePlus, RotateCcw, Save, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "../ui/switch";

type FieldProps = {
  label: string;
  name?: string;
  defaultValue?: string;
  hint?: string;
  className?: string;
  maxLength?: number;
  onChange: (value: string) => void;
};

type NumberFieldProps = Omit<FieldProps, "defaultValue" | "onChange"> & {
  defaultValue?: number;
  max: number;
  min?: number;
  onChange: (value: number) => void;
};

export function TextField({
  label,
  name,
  defaultValue,
  hint,
  className,
  maxLength,
  onChange,
}: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        value={defaultValue}
        onChange={(event) => onChange(event.target.value)}
      />
      {maxLength ? (
        <p className="text-xs text-muted-foreground">
          {defaultValue?.length}/{maxLength} characters
        </p>
      ) : null}
      {hint ? <p className="text-xs leading-5 text-ink/55">{hint}</p> : null}
    </div>
  );
}

export function TextareaField({
  label,
  name,
  defaultValue,
  hint,
  className,
  maxLength,
  onChange,
}: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        id={name}
        name={name}
        value={defaultValue}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-32 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      {maxLength ? (
        <p className="text-xs text-muted-foreground">
          {defaultValue?.length}/{maxLength} characters
        </p>
      ) : null}
      {hint ? <p className="text-xs leading-5 text-ink/55">{hint}</p> : null}
    </div>
  );
}

export function NumberField({
  label,
  name,
  defaultValue = 0,
  hint,
  className,
  max,
  min = 0,
  onChange,
  onValidityChange,
}: NumberFieldProps & {
  onValidityChange?: (isInvalid: boolean) => void;
}) {
  const [value, setValue] = useState(String(defaultValue));

  const parsedValue = value === "" ? undefined : Number(value);

  const isAboveMax =
    parsedValue !== undefined && max !== undefined && parsedValue > max;

  const isBelowMin = parsedValue !== undefined && parsedValue < min;

  const isInvalid = isAboveMax || isBelowMin;

  useEffect(() => {
    onValidityChange?.(isInvalid);
  }, [isInvalid, onValidityChange]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value.replace(/\D/g, "");
    const nextNumber = nextValue === "" ? undefined : Number(nextValue);

    setValue(nextValue);

    // Important: always send the actual typed value to the parent
    if (nextNumber !== undefined) {
      onChange(nextNumber);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>{label}</Label>

      <Input
        id={name}
        name={name}
        value={value}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        onChange={handleChange}
        aria-invalid={isInvalid}
      />

      {hint ? <p className="text-xs leading-5 text-ink/55">{hint}</p> : null}

      {isAboveMax ? (
        <p className="rounded-lg border border-tomato/35 bg-tomato/10 px-3 py-2 text-xs font-semibold leading-5 text-tomato">
          Maximum allowed value is {max}. This value will not be saved.
        </p>
      ) : null}

      {isBelowMin ? (
        <p className="rounded-lg border border-tomato/35 bg-tomato/10 px-3 py-2 text-xs font-semibold leading-5 text-tomato">
          Minimum allowed value is {min}. This value will not be saved.
        </p>
      ) : null}
    </div>
  );
}

export function ImagePicker({
  label,
  value,
  inputRef,
  hint,
  onUpload,
  className,
  containerClassName,
}: {
  label: string;
  value: string;
  hint?: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  containerClassName?: string;
  className?: string;
}) {
  return (
    <div className="grid min-w-0 content-start gap-2">
      <Label>{label}</Label>
      {hint ? <p className="text-xs leading-5 text-ink/55">{hint}</p> : null}
      <div className="overflow-hidden rounded-xl border bg-muted">
        {value ? (
          <div className={cn("relative h-52", containerClassName)}>
            <Image
              src={value}
              alt={label}
              className={cn("object-cover object-center", className)}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="eager"
            />
          </div>
        ) : (
          <div className="flex h-52 flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImagePlus className="h-8 w-8" />
            <span className="text-sm">No image selected</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/heic,image/heif"
        className="hidden"
        onChange={onUpload}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        {value ? "Change image" : "Upload image"}
      </Button>
    </div>
  );

  // Add support for abort controller
}

export function SaveButton({
  onSubmit,
  isPending,
  className,
  label = "Save Changes",
  disabled = false,
}: {
  onSubmit: () => void;
  isPending: boolean;
  label?: string;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      className={cn("w-full h-9! shrink-0", className)}
      size="lg"
      onClick={onSubmit}
      disabled={isPending || disabled}
    >
      <Save />
      {isPending ? "Chill out bro 😏..." : label}
    </Button>
  );
}

export function CancelButton({
  onCancel,
  className,
  label = "Cancel",
}: {
  onCancel: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className={cn("w-full h-9! shrink-0", className)}
      onClick={onCancel}
    >
      <RotateCcw />
      {label}
    </Button>
  );
}

export function PublishSwitch({
  checked = false,
  onChange,
  hint,
  checkedLabel,
  unCheckedLabel,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
  checkedLabel?: string;
  unCheckedLabel?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border px-4 py-3 transition-colors",
        checked
          ? "border-honey/45 bg-honey/15 dark:border-tomato/45 dark:bg-tomato/10"
          : "bg-muted/20"
      )}
    >
      <div>
        <Label>
          {checked ? checkedLabel ?? "Published" : unCheckedLabel ?? "Draft"}
        </Label>
        {hint ? <p className="text-xs leading-5 text-ink/55">{hint}</p> : null}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="cursor-pointer"
      />
    </div>
  );
}
