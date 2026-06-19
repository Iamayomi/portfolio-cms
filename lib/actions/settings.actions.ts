"use server";

import { revalidatePath } from "next/cache";

import { requireAdminSession } from "@/lib/auth/guards";
import { db } from "@/lib/db/config";
import {
  adminAllowlistRepository,
  envAdminEmails,
  normalizeAdminEmail,
} from "@/lib/db/repositories/admin-allowlist.repository";
import { isValidEmail } from "../utils";
import { mailService } from "../services";

export async function addAdminEmail(email: string) {
  await requireAdminSession();

  const normalized = normalizeAdminEmail(email);
  if (!normalized || !isValidEmail(normalized)) {
    return { error: "Enter a valid admin email." };
  }

  await Promise.all([
    adminAllowlistRepository.add(normalized),
    mailService.sendAccessGrantedEmail(normalized),
  ]);
  revalidatePath("/settings");
}

export async function removeAdminEmail(email: string) {
  const session = await requireAdminSession();
  const normalized = normalizeAdminEmail(email);

  if (envAdminEmails.includes(normalized)) {
    return { error: "Env admins cannot be removed from the CMS." };
  }

  if (normalizeAdminEmail(session.user.email) === normalized) {
    return { error: "You cannot remove your own admin email here." };
  }

  await adminAllowlistRepository.remove(normalized);
  revalidatePath("/settings");
}

export async function deleteCurrentAccount() {
  const session = await requireAdminSession();
  const userId = session.user.id;

  await Promise.all([
    db.collection("session").deleteMany({ userId }),
    db.collection("account").deleteMany({ userId }),
    db.collection("user").deleteOne({ id: userId }),
  ]);
}
