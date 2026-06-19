"use client";

import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

import { BASE_URL } from "@/lib/constants";

export const authClient = createAuthClient({
  baseURL: BASE_URL,
  plugins: [magicLinkClient()],
});
