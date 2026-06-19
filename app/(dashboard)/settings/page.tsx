import { getCurrentUser } from "@/lib/auth/server";
import {
  adminAllowlistRepository,
  envAdminEmails,
} from "@/lib/db/repositories/admin-allowlist.repository";

import { DashboardPageHeader } from "../_components/dashboard-page-header";
import { SettingsPanel } from "./_components/settings-panel";

export default async function SettingsPage() {
  const [user, entries] = await Promise.all([
    getCurrentUser(),
    adminAllowlistRepository.findAll(),
  ]);

  const admins = entries.map((entry) => ({
    id: entry._id?.toString() || entry.email,
    email: entry.email,
    source: envAdminEmails.includes(entry.email) ? ("env" as const) : ("cms" as const),
  }));

  return (
    <div>
      <DashboardPageHeader
        eyebrow="Settings"
        title="Control CMS access."
        description="Manage admin emails that can sign in, and delete your own CMS account when needed."
      />
      <SettingsPanel admins={admins} currentUserEmail={user?.email || ""} />
    </div>
  );
}
