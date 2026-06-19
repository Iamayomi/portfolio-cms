import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-dvh bg-paper text-ink">
      <div className="notebook-grid flex min-h-dvh items-center justify-center px-6 py-12">
        <section className="relative w-full max-w-2xl rounded-3xl border border-ink/15 bg-paper/90 p-6 shadow-[8px_8px_0_var(--ink)] dark:shadow-[8px_8px_0_rgba(247,243,232,0.25)] sm:p-10">
          <div className="absolute -top-5 right-8 rotate-3 rounded-xl border border-ink/15 bg-honey px-4 py-2 font-mono text-xs font-black uppercase tracking-[0.28em]">
            Missing
          </div>

          <div className="mb-8 flex size-14 items-center justify-center rounded-2xl border border-ink/15 bg-blush">
            <Search className="size-6" />
          </div>

          <p className="font-script text-4xl text-tomato">404</p>
          <h1 className="mt-2 max-w-xl text-4xl font-black tracking-tight sm:text-6xl">
            This page wandered off the notebook.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-ink/60">
            The route does not exist, or the note you tried to open has been
            moved, renamed, or deleted.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/">
                <Home />
                Go home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/notes/manage">
                <ArrowLeft />
                Back to notes
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
