import { NextResponse } from "next/server";

import { FRONTEND_BASE_URL } from "@/lib/constants";
import {
  experiencePageRepository,
  experienceRepository,
} from "@/lib/db/repositories/experience.repository";
import { extractErrorMessage } from "@/lib/utils";

const corsHeaders = {
  "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders, status: 204 });
}

export async function GET() {
  try {
    const [page, entries] = await Promise.all([
      experiencePageRepository.get(),
      experienceRepository.findPublished(),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Fetch successful",
        data: {
          hero: page.hero,
          items: entries.map((entry) => ({
            id: entry._id?.toString(),
            period: entry.period,
            role: entry.role,
            websiteUrl: entry.websiteUrl || "",
            summary: entry.summary || "",
            signals: entry.signals || [],
            order: entry.order,
            updatedAt: (entry.updatedAt ?? entry.createdAt).toISOString(),
          })),
        },
      },
      { headers: corsHeaders, status: 200 }
    );
  } catch (error) {
    const message =
      extractErrorMessage(error) || "Something went wrong, try again.";
    return Response.json(
      { success: false, message },
      { headers: corsHeaders, status: 500 }
    );
  }
}
