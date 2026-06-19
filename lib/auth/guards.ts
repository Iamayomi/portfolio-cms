import { redirect } from "next/navigation";

import { getCurrentSession } from "@/lib/auth/server";
import { isAllowedAdminEmail, isEnvAdminEmail } from "@/lib/auth/allowlist";

export async function requireAdminSession() {
  const session = await getCurrentSession();

  if (!session?.user || !(await isAllowedAdminEmail(session.user.email))) {
    redirect("/auth/login");
  }

  return session;
}

export async function requireEnvAdminSession() {
  const session = await requireAdminSession();

  if (!isEnvAdminEmail(session.user.email)) {
    redirect("/");
  }

  return session;
}
