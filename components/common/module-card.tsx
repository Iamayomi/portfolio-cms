import { cn } from "@/lib/utils";

type ModuleCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function ModuleCard({ children, className }: ModuleCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-ink/15 bg-paper/80 p-5 shadow-[0_14px_30px_rgba(17,24,39,0.05)] dark:shadow-none",
        className
      )}
    >
      {children}
    </section>
  );
}
