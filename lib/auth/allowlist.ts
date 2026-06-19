import {
  adminAllowlistRepository,
  envAdminEmails,
  normalizeAdminEmail,
} from "@/lib/db/repositories/admin-allowlist.repository";

export async function isAllowedAdminEmail(email?: string | null) {
  return adminAllowlistRepository.isAllowed(email);
}

export function isEnvAdminEmail(email?: string | null) {
  const normalized = normalizeAdminEmail(email);
  return Boolean(normalized && envAdminEmails.includes(normalized));
}
