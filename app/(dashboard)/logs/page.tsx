import { Clock3 } from "lucide-react";

import { Pagination } from "@/components/common/pagination";
import { Badge } from "@/components/ui/badge";
import { adminLogRepository } from "@/lib/db/repositories/admin-log.repository";
import { DashboardPageHeader } from "../_components/dashboard-page-header";
import { formatDateTime } from "@/lib/utils";

const LOG_LIMIT = 15;

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(Number(params.page || 1), 1);
  const { items: logs, pagination } = await adminLogRepository.findPaginated({
    page,
    limit: LOG_LIMIT,
  });

  return (
    <div>
      <DashboardPageHeader
        eyebrow="Security / Logs"
        title="Admin access history."
        description="A quiet record of CMS sessions: who came in, from where, and when they left."
      />

      <section className="rounded-3xl border border-ink/15 bg-paper/85 p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-ink/60">
          <Clock3 className="size-4" />
          {pagination.total} recorded sessions
        </div>

        <div className="grid gap-3">
          {logs.map((log) => (
            <article
              key={log._id?.toString()}
              className="grid gap-3 rounded-2xl border border-ink/10 bg-muted/25 p-4 lg:grid-cols-[1fr_1fr_1fr]"
            >
              <div>
                <p className="font-bold">{log.name || "Unknown admin"}</p>
                <p className="text-sm text-ink/55">{log.email || log.userId}</p>
              </div>
              <div className="text-sm text-ink/65">
                <p>Login: {formatDateTime(log.loginAt)}</p>
                <p>Logout: {formatDateTime(log.logoutAt)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  {log.device || "Device unknown"}
                </Badge>
                <Badge variant="outline">
                  {log.browser || "Browser unknown"}
                </Badge>
                {log.ip ? <Badge variant="secondary">{log.ip}</Badge> : null}
              </div>
            </article>
          ))}
        </div>

        <Pagination
          pathname="/logs"
          itemName="logs"
          currentPage={pagination.page}
          totalItems={pagination.total}
          totalPages={pagination.totalPages}
          showingStart={pagination.showingStart}
          showingEnd={pagination.showingEnd}
          limit={pagination.limit}
        />
      </section>
    </div>
  );
}
