import Link from "next/link";

import { Button } from "@/components/ui/button";

import { AuthShell } from "../_components/auth-shell";

const errorCopy: Record<
  string,
  { title: string; message: string; hint: string }
> = {
  email_not_found: {
    title: "Your provider did not share an email.",
    message:
      "Some providers can hide email addresses. GitHub can still sign in through a reserved placeholder email when the account itself is allowlisted.",
    hint: "For GitHub, add your stable GitHub ID to DEFAULT_ADMIN_GITHUB_IDS or your login to DEFAULT_ADMIN_GITHUB_NAMES.",
  },

  unable_to_create_user: {
    title: "This account cannot enter the CMS.",
    message:
      "The CMS is private. New users can only be created when the email or GitHub identity is in the admin allowlist.",
    hint: "Request for admin access and try again.",
  },

  github: {
    title: "This GitHub account cannot enter the CMS.",
    message:
      "GitHub did not provide a usable email, so the CMS checks your GitHub identity instead.",
    hint: "Add the stable numeric GitHub ID to DEFAULT_ADMIN_GITHUB_IDS, or add the login to DEFAULT_ADMIN_GITHUB_NAMES.",
  },
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; code?: string; provider?: string }>;
}) {
  const params = await searchParams;
  const code = params.error || params.code || "unknown_error";
  const provider = params.provider;

  const copy = errorCopy[code ?? provider] ?? {
    title: "Something interrupted sign in.",
    message:
      "The provider returned an error before the CMS could open. Try again, or use a one-time email link if the issue keeps happening.",
    hint: "Check the callback URL, provider settings, and admin allowlist.",
  };

  return (
    <AuthShell eyebrow="Hold up" title={copy.title} note={copy.message}>
      <div className="rounded-3xl border border-ink/15 bg-paper/80 p-5">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-ink/45">
          error code
        </p>
        <p className="mt-2 break-all rounded-2xl border border-ink/15 bg-ink px-3 py-2 font-mono text-sm font-bold text-paper">
          {code}
        </p>
        <p className="mt-5 text-sm leading-6 text-ink/65">{copy.hint}</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/auth/login">Back to login</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}
