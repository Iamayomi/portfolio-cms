import { NextResponse } from "next/server";

import { FRONTEND_BASE_URL } from "@/lib/constants";
import {
  buildRepository,
  buildsPageRepository,
} from "@/lib/db/repositories/build.repository";
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
    const [page, builds] = await Promise.all([
      buildsPageRepository.get(),
      buildRepository.findPublished(),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Fetch successful",
        data: {
          hero: page.hero,
          items: builds.map((build) => ({
            id: build._id?.toString(),
            title: build.title,
            category: build.category,
            status: build.status || "active",
            summary: build.summary || "",
            proofNote: build.proofNote || "",
            githubUrl: build.githubUrl || "",
            liveUrl: build.liveUrl || "",
            stack: build.stack || [],
            featured: build.featured,
            order: build.order,
            updatedAt: (build.updatedAt ?? build.createdAt).toISOString(),
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
