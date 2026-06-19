import type { CmsDocumentBase } from "./shared";

export interface AdminAllowlistEntry extends CmsDocumentBase {
  email: string;
}

export interface AdminLogEntry extends CmsDocumentBase {
  sessionToken?: string;
  userId?: string;
  email?: string;
  name?: string;
  loginAt: Date;
  logoutAt?: Date | null;
  ip?: string;
  userAgent?: string;
  device?: string;
  browser?: string;
}
