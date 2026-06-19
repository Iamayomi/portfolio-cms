import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import isEmail from "validator/lib/isEmail";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidEmail(value?: string | null): boolean {
  return isEmail(value ?? "");
}

export const generateSlug = (title: string) =>
  title
    .replace(/[^a-zA-Z0-9]/g, " ")
    .replace(/\s+/g, "-")
    .toLocaleLowerCase();

export const getReadTime = (content: string) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(" ").length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
};

export const getDocumentTitle = (value?: string) => {
  if (!value) return "No CV uploaded yet";

  try {
    const pathname = value.startsWith("http") ? new URL(value).pathname : value;
    const name = pathname.split("/").filter(Boolean).at(-1);
    if (!name) return "RESUME";

    return decodeURIComponent(name)
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/[-_]+/g, " ")
      .trim()
      .toUpperCase();
  } catch {
    return "RESUME";
  }
};

export const extractErrorMessage = (err: unknown) => {
  if (err instanceof Error) {
    if (err.message) return err.message;
    else return JSON.stringify(err) || "An error occurred";
  } else return JSON.stringify(err) || "Unknown error occurred";
};

export function parseValidationError(issues: { message: string }[]) {
  return issues.map((issue) => issue.message).join(", ");
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "dd MMMM, yyyy");
}

export function formatDateTime(
  value?: Date | null | string,
  fallback?: string
) {
  const date =
    typeof value === "string"
      ? new Date(value)
      : value instanceof Date
      ? value
      : null;

  return date
    ? `${formatDate(date)} ${date.toLocaleTimeString("en-NG", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`
    : fallback || "Still active";
}
