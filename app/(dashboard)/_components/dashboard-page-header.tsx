type DashboardPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function DashboardPageHeader({
  eyebrow,
  title,
  description,
  action,
}: DashboardPageHeaderProps) {
  return (
    <header className="mb-10 flex flex-col gap-5 border-b border-ink/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className="font-script text-3xl text-tomato">{eyebrow}</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-ink">
          {title}
        </h1>
        <p className="mt-4 text-base leading-7 text-ink/65">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
