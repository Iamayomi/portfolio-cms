"use client";

import type { User } from "better-auth";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  BriefcaseBusiness,
  Clock3,
  FolderKanban,
  Gamepad2,
  Home,
  ImageIcon,
  Layers3,
  LayoutTemplate,
  LogOut,
  Mail,
  Menu,
  NotebookText,
  PanelRight,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import Image from "next/image";

type NavChild =
  | {
      label: string;
      href: string;
      icon: LucideIcon;
    }
  | {
      kind: "separator";
      label: string;
    };

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: NavChild[];
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: Home },
  {
    label: "Landing",
    href: "/landing",
    icon: Layers3,
    children: [
      { label: "Hero", href: "/landing/hero", icon: ImageIcon },
      { label: "Works", href: "/landing/works", icon: FolderKanban },
      { label: "Notes", href: "/landing/notes", icon: NotebookText },
      { label: "Aside", href: "/landing/aside", icon: PanelRight },
    ],
  },
  {
    label: "Experience",
    href: "/experience",
    icon: BriefcaseBusiness,
    children: [
      { label: "Hero", href: "/experience/hero", icon: LayoutTemplate },
      { kind: "separator", label: "Manage timeline" },
      {
        label: "Timeline",
        href: "/experience/manage",
        icon: BriefcaseBusiness,
      },
    ],
  },
  {
    label: "Builds",
    href: "/builds",
    icon: FolderKanban,
    children: [
      { label: "Hero", href: "/builds/hero", icon: LayoutTemplate },
      { kind: "separator", label: "Manage builds" },
      { label: "Builds", href: "/builds/manage", icon: FolderKanban },
    ],
  },
  {
    label: "Notes",
    href: "/notes",
    icon: BookOpen,
    children: [
      { label: "Hero", href: "/notes/hero", icon: LayoutTemplate },
      { kind: "separator", label: "Manage notes" },
      { label: "Notes", href: "/notes/manage", icon: NotebookText },
    ],
  },
  { label: "Contact", href: "/contact", icon: Mail },
  { label: "Extra", href: "/extra", icon: Gamepad2 },
  { label: "Logs", href: "/logs", icon: Clock3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User & { role?: string | null };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function signOut() {
    await authClient.signOut();
    router.push(`/auth/login?callbackUrl=${pathname}`);
    router.refresh();
  }

  const sidebar = (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-ink/15 bg-honey font-black overflow-hidden">
            {/* S */}
            <Image
              alt="Logo avatar"
              src={"/avatar.png"}
              height={200}
              width={200}
            />
          </div>
          <div>
            <p className="font-script text-2xl leading-none">Somto</p>
            <p className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.25em] text-ink/50">
              portfolio cms
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <nav className="mt-8 grid gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const children = item.children ?? [];

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-ink/65 transition hover:bg-ink/5 hover:text-ink",
                  active && "bg-ink text-paper hover:bg-ink hover:text-paper"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
              {children.length && active ? (
                <div className="ml-5 mt-1 grid gap-1 border-l border-ink/10 pl-3">
                  {children.map((child) => {
                    if ("kind" in child) {
                      return (
                        <p
                          key={child.label}
                          className="px-3 pt-3 pb-1 font-mono text-[0.62rem] font-black uppercase tracking-[0.28em] text-ink/35"
                        >
                          {child.label}
                        </p>
                      );
                    }

                    const ChildIcon = child.icon;
                    const childActive = pathname === child.href;

                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-ink/55 transition hover:bg-ink/5 hover:text-ink",
                          childActive && "bg-ink/10 text-ink"
                        )}
                      >
                        <ChildIcon className="size-3.5" />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-ink/10 pt-4 lg:absolute lg:bottom-4 lg:left-4 lg:right-4">
        <p className="truncate text-sm font-bold">{user.name}</p>
        <p className="truncate text-xs text-ink/55">{user.email}</p>
        <Button className="mt-3 w-full" variant="outline" onClick={signOut}>
          <LogOut />
          Sign out
        </Button>
      </div>
    </>
  );

  return (
    <main className="min-h-dvh bg-paper text-ink">
      <div className="notebook-grid min-h-dvh">
        <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col py-4 pl-8 sm:pl-14 pr-4 sm:px-5 lg:flex-row lg:gap-8 lg:px-8">
          <header className="mb-4 flex items-center justify-between rounded-2xl border border-ink/15 bg-paper/90 p-3 lg:hidden">
            <div>
              <p className="font-script text-2xl leading-none">Somto</p>
              <p className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.22em] text-ink/50">
                portfolio cms
              </p>
            </div>
            <Button
              type="button"
              size="icon"
              variant="outline"
              aria-label="Open navigation"
              onClick={() => setOpen(true)}
            >
              <Menu />
            </Button>
          </header>

          <aside className="hidden rounded-3xl border border-ink/15 bg-paper/85 p-4 lg:sticky lg:top-5 lg:block lg:h-[calc(100dvh-2.5rem)] lg:w-72">
            {sidebar}
          </aside>

          {open ? (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                aria-label="Close navigation"
                className="absolute inset-0 bg-ink/35"
                onClick={() => setOpen(false)}
              />
              <aside className="absolute bottom-0 left-0 top-0 w-[min(21rem,88vw)] border-r border-ink/15 bg-paper p-4 shadow-2xl">
                <div className="mb-4 flex justify-end">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    aria-label="Close navigation"
                    onClick={() => setOpen(false)}
                  >
                    <X />
                  </Button>
                </div>
                {sidebar}
              </aside>
            </div>
          ) : null}

          <section className="flex-1 py-5 lg:py-10">{children}</section>
        </div>
      </div>
    </main>
  );
}
