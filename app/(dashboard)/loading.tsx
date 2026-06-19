export default function DashboardLoading() {
  return (
    <div className="grid min-h-[50dvh] place-items-center">
      <div className="w-full max-w-xl rounded-3xl border border-ink/15 bg-paper/80 p-6">
        <p className="font-script text-3xl text-tomato">Loading</p>
        <div className="mt-6 space-y-3">
          <div className="h-5 w-2/3 animate-pulse rounded-full bg-ink/10" />
          <div className="h-4 w-full animate-pulse rounded-full bg-ink/10" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-ink/10" />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="h-24 animate-pulse rounded-2xl border border-ink/10 bg-honey/20" />
          <div className="h-24 animate-pulse rounded-2xl border border-ink/10 bg-sky/20" />
        </div>
      </div>
    </div>
  );
}
