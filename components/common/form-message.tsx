import { cn } from "@/lib/utils";

type FormMessageProps = {
  message?: string;
  variant?: "success" | "error" | "neutral";
};

export function FormMessage({ message, variant = "neutral" }: FormMessageProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2 text-sm",
        variant === "success" && "border-leaf/30 bg-leaf/15 text-ink",
        variant === "error" && "border-tomato/35 bg-tomato/10 text-ink",
        variant === "neutral" && "border-ink/15 bg-paper text-ink/70"
      )}
    >
      {message}
    </div>
  );
}
