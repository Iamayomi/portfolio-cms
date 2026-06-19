"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Plus, Trash2, UserX } from "lucide-react";
import { toast } from "sonner";

import { ModuleCard } from "@/components/common/module-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addAdminEmail,
  deleteCurrentAccount,
  removeAdminEmail,
} from "@/lib/actions/settings.actions";
import { authClient } from "@/lib/auth/client";

type AdminItem = {
  id: string;
  email: string;
  source: "env" | "cms";
};

type SettingsPanelProps = {
  admins: AdminItem[];
  currentUserEmail: string;
};

export function SettingsPanel({
  admins,
  currentUserEmail,
}: SettingsPanelProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pendingRemove, setPendingRemove] = useState<AdminItem | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const submitEmail = () => {
    startTransition(() => {
      addAdminEmail(email)
        .then((res) => {
          if (res && "error" in res) toast.error(res.error);
          else {
            toast.success("Admin email added");
            setEmail("");
            router.refresh();
          }
        })
        .catch(() => toast.error("Could not add admin email."));
    });
  };

  const confirmRemove = () => {
    if (!pendingRemove) return;

    startTransition(() => {
      removeAdminEmail(pendingRemove.email)
        .then((res) => {
          if (res && "error" in res) toast.error(res.error);
          else {
            toast.success("Admin email removed");
            setPendingRemove(null);
            router.refresh();
          }
        })
        .catch(() => toast.error("Could not remove admin email."));
    });
  };

  const confirmDeleteAccount = () => {
    startTransition(() => {
      deleteCurrentAccount()
        .then(async () => {
          await authClient.signOut();
          router.push("/auth/login");
          router.refresh();
        })
        .catch(() => toast.error("Could not delete your account."));
    });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <ModuleCard className="space-y-5">
        <div>
          <p className="font-script text-3xl text-tomato">Allowed admins</p>
          <p className="text-sm leading-6 text-ink/60">
            These emails can use magic links, Google, or GitHub to enter the
            CMS. Super admins are pinned and cannot be removed here.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@example.com"
          />
          <Button
            type="button"
            disabled={isPending || !email.trim()}
            onClick={submitEmail}
          >
            <Plus />
            {isPending ? "Please wait..." : "Add admin"}
          </Button>
        </div>

        <div className="divide-y divide-ink/10 rounded-2xl border border-ink/10">
          {admins.map((admin) => {
            const isCurrentUser =
              admin.email.toLowerCase() === currentUserEmail.toLowerCase();
            const protectedAdmin = admin.source === "env" || isCurrentUser;

            return (
              <div
                key={admin.id}
                className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-black">{admin.email}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge
                      variant={admin.source === "env" ? "default" : "outline"}
                    >
                      {admin.source === "env" ? "Super admin" : "CMS admin"}
                    </Badge>
                    {isCurrentUser ? (
                      <Badge variant="secondary">You</Badge>
                    ) : null}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={protectedAdmin || isPending}
                  onClick={() => setPendingRemove(admin)}
                >
                  <Trash2 />
                  Remove
                </Button>
              </div>
            );
          })}
        </div>
      </ModuleCard>

      <ModuleCard className="h-fit space-y-5 bg-tomato/10">
        <div>
          <p className="font-script text-3xl text-tomato">Danger zone</p>
          <h2 className="text-2xl font-black tracking-[-0.03em]">
            Delete your CMS account.
          </h2>
          <p className="mt-3 text-sm leading-6 text-ink/60">
            This removes your user, sessions, and linked auth accounts. Content
            entries stay intact.
          </p>
        </div>
        <Button
          type="button"
          variant="destructive"
          className="w-full"
          onClick={() => setDeleteOpen(true)}
        >
          <UserX />
          Delete my account
        </Button>
      </ModuleCard>

      <AlertDialog
        open={Boolean(pendingRemove)}
        onOpenChange={(open) => !open && setPendingRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove admin email?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingRemove?.email} will no longer be able to sign in unless it
              is added again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={confirmRemove}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This signs you out and deletes your CMS user record. This action
              cannot be undone from the dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={confirmDeleteAccount}
            >
              Delete account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
