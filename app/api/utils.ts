import { NextRequest } from "next/server";

import { allowedOrigins } from "@/lib/constants";

export function getCorsHeaders(request: NextRequest) {
  const origin = request.headers.get("origin");

  const allowedOrigin =
    origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}
