import { betterAuth } from "better-auth/minimal";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";
import { type GenericEndpointContext } from "better-auth";

import { BASE_URL } from "@/lib/constants";
import { isAllowedAdminEmail } from "@/lib/auth/allowlist";
import { db, client } from "@/lib/db/config";
import { adminLogRepository } from "@/lib/db/repositories/admin-log.repository";
import { mailService } from "@/lib/services/mail.service";
import { ObjectId } from "mongodb";

const getRequestDetails = (context: GenericEndpointContext | null) => {
  const headers = context?.headers;

  const getHeader = (key: string) =>
    typeof headers?.get === "function" ? headers.get(key) : undefined;

  const forwardedFor = getHeader("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() || getHeader("x-real-ip") || "";

  return {
    ip,
    userAgent: getHeader("user-agent") || "",
  };
};

export const auth = betterAuth({
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 604800, // 1 week
    },
  },
  baseURL: BASE_URL,
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET,
  database: mongodbAdapter(db, { client }),
  trustedOrigins: [BASE_URL],

  databaseHooks: {
    user: {
      create: {
        async before(user) {
          if (!(await isAllowedAdminEmail(user.email))) {
            throw new Error(
              "This CMS is private. Use an allowlisted admin email or GitHub account."
            );
          }

          return {
            data: {
              ...user,
              role: "admin",
            },
          };
        },
      },
    },
    session: {
      create: {
        async after(session, context) {
          const details = getRequestDetails(context);
          const user = await db
            .collection("user")
            .findOne({ _id: new ObjectId(session.userId) });

          await adminLogRepository.recordLogin({
            sessionToken: session.token,
            userId: session.userId,
            email: user?.email,
            name: user?.name,
            ...details,
          });
        },
      },
      delete: {
        async after(session) {
          await adminLogRepository.recordLogout(session?.token);
        },
      },
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
        required: false,
        defaultValue: "user",
      },

      provider: {
        type: "string",
        input: false,
        required: false,
      },

      githubId: {
        type: "string",
        input: false,
        required: false,
      },

      githubLogin: {
        type: "string",
        input: false,
        required: false,
      },
    },
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,

      async getUserInfo(token) {
        const headers = {
          Authorization: `Bearer ${token.accessToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        };

        const [profileResponse, emailsResponse] = await Promise.all([
          fetch("https://api.github.com/user", { headers }),
          fetch("https://api.github.com/user/emails", { headers }),
        ]);

        if (!profileResponse.ok)
          throw new Error("Failed to fetch GitHub profile");

        const profile = await profileResponse.json();

        let emails: Array<{
          email: string;
          primary: boolean;
          verified: boolean;
          visibility: "public" | "private" | null;
        }> = [];

        if (emailsResponse.ok) emails = await emailsResponse.json();

        const primaryVerifiedEmail =
          emails.find((email) => email.primary && email.verified) ??
          emails.find((email) => email.verified) ??
          null;

        const githubId = String(profile.id);
        const githubLogin = String(profile.login ?? githubId);

        const fallbackEmail = `${githubId}@github.placeholder.local`;

        return {
          user: {
            id: githubId,
            name: profile.name || githubLogin,
            email: (primaryVerifiedEmail?.email ?? fallbackEmail).toLowerCase(),
            emailVerified:
              primaryVerifiedEmail?.verified ||
              Boolean(primaryVerifiedEmail?.email),
            image: profile.avatar_url,

            provider: "github",
            githubId,
            githubLogin,
          },

          data: {
            ...profile,
            emails,
          },
        };
      },
    },

    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => ({
        image: profile.picture,
        provider: "google",
      }),
    },
  },

  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        if (!(await isAllowedAdminEmail(email))) {
          throw new Error("This CMS is private. Use an allowlisted email.");
        }

        console.log({ url });

        await mailService.sendMagicLinkEmail({
          to: email,
          url,
        });
      },
    }),
    nextCookies(),
  ],
});
