import type { AdminLogEntry } from "@/lib/types/settings";
import { createRepository } from "./base.repository";

const repository = createRepository<AdminLogEntry>("adminLogs");

const getBrowser = (userAgent = "") => {
  if (/edg/i.test(userAgent)) return "Edge";
  if (/chrome|crios/i.test(userAgent)) return "Chrome";
  if (/firefox|fxios/i.test(userAgent)) return "Firefox";
  if (/safari/i.test(userAgent)) return "Safari";
  return "Unknown browser";
};

const getDevice = (userAgent = "") => {
  if (/mobile|iphone|android/i.test(userAgent)) return "Mobile";
  if (/ipad|tablet/i.test(userAgent)) return "Tablet";
  return "Desktop";
};

export const adminLogRepository = {
  ...repository,

  findRecent(limit = 100) {
    return repository
      .collection()
      .find({})
      .sort({ loginAt: -1, createdAt: -1 })
      .limit(limit)
      .toArray();
  },

  async findPaginated({ page = 1, limit = 15 } = {}) {
    const safePage = Math.max(page, 1);
    const safeLimit = Math.max(limit, 1);
    const skip = (safePage - 1) * safeLimit;

    const [items, total] = await Promise.all([
      repository
        .collection()
        .find({})
        .sort({ loginAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .toArray(),
      repository.collection().countDocuments({}),
    ]);

    return {
      items,
      pagination: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.max(Math.ceil(total / safeLimit), 1),
        showingStart: total ? skip + 1 : 0,
        showingEnd: Math.min(skip + safeLimit, total),
      },
    };
  },

  async recordLogin(data: {
    sessionToken?: string;
    userId?: string;
    email?: string;
    name?: string;
    ip?: string;
    userAgent?: string;
  }) {
    return repository.create({
      ...data,
      loginAt: new Date(),
      logoutAt: null,
      browser: getBrowser(data.userAgent),
      device: getDevice(data.userAgent),
    });
  },

  async recordLogout(sessionToken?: string) {
    if (!sessionToken) return;

    await repository.collection().updateOne(
      { sessionToken, logoutAt: null },
      {
        $set: {
          logoutAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );
  },
};
