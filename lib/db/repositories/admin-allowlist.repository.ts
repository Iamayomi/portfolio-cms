import type { AdminAllowlistEntry } from "@/lib/types/settings";

import { redis } from "@/lib/db/redis-client";
import { createRepository } from "./base.repository";

const CACHE_TTL_MS = 60_000;
const REDIS_CACHE_TTL_SECONDS = 60 * 60 * 24 * 7;
const ALLOWLIST_CACHE_KEY = "portfolio-cms:admin-allowlist:emails";

const repository = createRepository<AdminAllowlistEntry>("adminAllowlist");

let cachedEmails: string[] | null = null;
let cachedAt = 0;

const splitList = (value?: string) =>
  value
    ?.split(",")
    .map((item) => normalizeAdminEmail(item))
    .filter(Boolean) ?? [];

export const normalizeAdminEmail = (email?: string | null) =>
  email?.trim().toLowerCase() ?? "";

export const envAdminEmails = splitList(process.env.DEFAULT_ADMIN_EMAILS ?? "");

const refreshCache = (emails: string[]) => {
  cachedEmails = Array.from(new Set(emails));
  cachedAt = Date.now();
  return cachedEmails;
};

async function writeRedisCache(emails: string[]) {
  const normalized = refreshCache(emails);

  if (!redis) return normalized;

  try {
    await redis.set(ALLOWLIST_CACHE_KEY, normalized, {
      ex: REDIS_CACHE_TTL_SECONDS,
    });
  } catch (error) {
    console.log("Could not write admin allowlist cache", error);
  }

  return normalized;
}

async function readRedisCache() {
  if (!redis) return null;

  try {
    const emails = await redis.get<string[]>(ALLOWLIST_CACHE_KEY);
    if (!Array.isArray(emails) || !emails.length) return null;

    return refreshCache(emails.map((email) => normalizeAdminEmail(email)));
  } catch (error) {
    console.log("Could not read admin allowlist cache", error);
    return null;
  }
}

async function seedEnvAdmins() {
  if (!envAdminEmails.length) return;

  await Promise.all(
    envAdminEmails.map(async (email) => {
      const existing = await repository.findOne({ email });
      if (!existing) await repository.create({ email });
    })
  );
}

async function getDbEmails() {
  await seedEnvAdmins();

  const entries = await repository
    .collection()
    .find({})
    .sort({ email: 1 })
    .toArray();
  return [
    ...envAdminEmails,
    ...entries.map((entry) => normalizeAdminEmail(entry.email)),
  ];
}

export const adminAllowlistRepository = {
  ...repository,

  async refreshEmailCache() {
    const emails = await getDbEmails();
    return writeRedisCache(emails);
  },

  async findAll() {
    await this.refreshEmailCache();
    return repository.collection().find({}).sort({ email: 1 }).toArray();
  },

  async getEmails() {
    const redisEmails = await readRedisCache();
    if (redisEmails) return redisEmails;

    if (!redis && cachedEmails && Date.now() - cachedAt < CACHE_TTL_MS) {
      return cachedEmails;
    }

    return this.refreshEmailCache();
  },

  async isAllowed(email?: string | null) {
    const normalized = normalizeAdminEmail(email);
    if (!normalized) return false;

    const emails = await this.getEmails();
    return emails.includes(normalized);
  },

  async add(email: string) {
    const normalized = normalizeAdminEmail(email);
    const existing = await repository.findOne({ email: normalized });
    if (existing) {
      await this.refreshEmailCache();
      return existing;
    }

    const created = await repository.create({ email: normalized });
    await this.refreshEmailCache();
    return created;
  },

  async remove(email: string) {
    const normalized = normalizeAdminEmail(email);
    await repository.deleteOne({ email: normalized });
    await this.refreshEmailCache();
  },
};
