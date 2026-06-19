"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-5 text-ink">
      <section className="notebook-grid w-full max-w-2xl rounded-3xl border border-ink/15 bg-paper p-6 shadow-[0_24px_80px_rgba(17,24,39,0.12)]">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl border border-tomato/35 bg-tomato/10 text-tomato">
            <AlertTriangle />
          </span>
          <div>
            <p className="font-script text-3xl text-tomato">Something broke</p>
            <h1 className="text-3xl font-black tracking-[-0.04em]">
              The CMS hit an unexpected error.
            </h1>
          </div>
        </div>
        <p className="mt-5 max-w-xl text-sm leading-7 text-ink/60">
          Try again. If it keeps happening, check the server logs for the digest
          and stack trace.
        </p>
        <div className="mt-5 rounded-2xl border border-ink/10 bg-muted/30 p-4 font-mono text-xs text-ink/55">
          <p className="truncate">Message: {error.message}</p>
          {error.digest ? <p className="truncate">Digest: {error.digest}</p> : null}
        </div>
        <Button className="mt-6" onClick={reset}>
          <RotateCcw />
          Try again
        </Button>
      </section>
    </main>
  );
}
