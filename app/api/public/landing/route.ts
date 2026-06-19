import { NextResponse } from "next/server";

import { FRONTEND_BASE_URL } from "@/lib/constants";
import { buildRepository } from "@/lib/db/repositories/build.repository";
import { landingRepository } from "@/lib/db/repositories/landing";
import { noteRepository } from "@/lib/db/repositories/notes";
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
    const { _id, createdAt, updatedAt, ...content } =
      await landingRepository.get();

    const [featuredBuilds, { items: recentNotes }] = await Promise.all([
      buildRepository.findFeatured(content.selectedWorks.featuredCount || 2),
      noteRepository.findPublishedPaginated({
        limit: content.selectedNotes.featuredCount || 5,
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Fetch successful",
        data: {
          ...content,
          selectedWorks: {
            ...content.selectedWorks,
            items: featuredBuilds.map((build) => {
              const {
                _id: buildId,
                createdAt: buildCreatedAt,
                updatedAt: buildUpdatedAt,
                ...buildContent
              } = build;

              return {
                id: buildId?.toString(),
                title: buildContent.title,
                summary: buildContent.summary,
                category: buildContent.category,
                status: buildContent.status || "active",
                proofNote: buildContent.proofNote,
                githubUrl: buildContent.githubUrl,
                liveUrl: buildContent.liveUrl,
                stack: buildContent.stack,
                createdAt: buildCreatedAt.toISOString(),
                updatedAt: buildUpdatedAt.toISOString(),
              };
            }),
          },
          selectedNotes: {
            ...content.selectedNotes,
            items: recentNotes.map((note) => ({
              id: note._id?.toString(),
              title: note.title,
              slug: note.slug,
              excerpt: note.excerpt || "",
              bannerImage: note.bannerImage,
              tags: note.tags || [],
              readTime: note.readTime || "1 min read",
              publishedAt: note.publishedAt?.toISOString() ?? null,
              updatedAt: (note.updatedAt ?? note.createdAt).toISOString(),
            })),
          },
          createdAt: createdAt.toISOString(),
          updatedAt: updatedAt.toISOString(),
          id: _id?.toString(),
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
