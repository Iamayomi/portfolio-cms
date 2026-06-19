import Link from "next/link";

type AuthShellProps = {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  note: string;
};

export function AuthShell({ children, eyebrow, title, note }: AuthShellProps) {
  return (
    <main className="min-h-dvh bg-paper text-ink">
      <div className="notebook-grid min-h-dvh px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto grid min-h-[calc(100dvh-3rem)] w-full max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <section className="relative hidden min-h-[620px] overflow-hidden rounded-[2rem] border border-ink/15 bg-mint/60 p-8 lg:block">
            <div className="absolute left-8 top-8 size-16 rounded-full border border-ink/20 bg-honey" />
            <div className="absolute right-16 top-24 h-24 w-40 rotate-[-7deg] rounded-[55%_45%_60%_40%] border border-ink/20 bg-blush" />
            <div className="absolute bottom-16 left-14 h-36 w-56 rotate-3 rounded-[45%_55%_42%_58%] border border-ink/20 bg-sky" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <Link
                href="/"
                className="w-fit font-mono text-xs font-bold uppercase tracking-[0.28em]"
              >
                Somto CMS
              </Link>
              <div className="max-w-md">
                <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.3em] text-ink/55">
                  private notebook
                </p>
                <h1 className="text-6xl font-black leading-[0.95] tracking-tight">
                  Keep the portfolio honest.
                </h1>
                <p className="mt-6 max-w-sm text-lg leading-8 text-ink/70">
                  A small workspace for proof, notes, projects, and the parts of
                  the story that need care before they go public.
                </p>
              </div>
            </div>
          </section>

          <section className="mx-auto flex w-full max-w-md flex-col justify-center">
            <div className="mb-8">
              <Link
                href="/"
                className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-ink/55 lg:hidden"
              >
                Somto CMS
              </Link>
              <p className="mt-8 font-script text-3xl text-tomato lg:mt-0">
                {eyebrow}
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
                {title}
              </h1>
              <p className="mt-4 text-base leading-7 text-ink/65">{note}</p>
            </div>
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
