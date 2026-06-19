"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { getSafeCallbackUrl } from "@/lib/auth/routes";

export function SocialButtons() {
  const searchParams = useSearchParams();
  const callbackURL = getSafeCallbackUrl(searchParams.get("callbackUrl"));
  const [pending, setPending] = useState<"github" | "google" | null>(null);

  async function signIn(provider: "github" | "google") {
    setPending(provider);

    await authClient.signIn.social({
      provider,
      callbackURL,
      errorCallbackURL: `/auth/error?provider=${provider}`,
    });
    setPending(null);
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => signIn("github")}
        disabled={Boolean(pending)}
      >
        <span className="text-base font-black">GH</span>
        {pending === "github" ? "Opening..." : "GitHub"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => signIn("google")}
        disabled={Boolean(pending)}
      >
        <span className="text-base font-black">G</span>
        {pending === "google" ? "Opening..." : "Google"}
      </Button>
    </div>
  );
}
