import { NextRequest, NextResponse } from "next/server";

import { FRONTEND_BASE_URL } from "@/lib/constants";
import {
  noteRepository,
  notesPageRepository,
} from "@/lib/db/repositories/notes";
import type { NoteContent, PublicNoteField } from "@/lib/types/notes";
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

const NOTE_LIMIT = 10;

const toPublicNoteListItem = (note: NoteContent) => ({
  id: note._id?.toString(),
  title: note.title,
  slug: note.slug,
  excerpt: note.excerpt || "",
  bannerImage: note.bannerImage || "",
  tags: note.tags || [],
  readTime: note.readTime || "1 min read",
  views: note.views || 0,
  publishedAt: note.publishedAt?.toISOString() ?? null,
  updatedAt: (note.updatedAt ?? note.createdAt).toISOString(),
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const fieldsParam = searchParams.get("fields");
  const fields = (
    fieldsParam ? fieldsParam.split(",").filter(Boolean) : []
  ) as PublicNoteField[];

  const query = searchParams.get("q") || "";
  const currentPage = Math.max(Number(searchParams.get("page") || 1), 1);
  const limit = Number(searchParams.get("limit")) || NOTE_LIMIT;

  try {
    const [page, result] = await Promise.all([
      notesPageRepository.get(),
      noteRepository.findPublishedPaginated({
        page: currentPage,
        limit,
        query,
        fields,
      }),
    ]);

    const totalPages = Math.max(Math.ceil(result.total / limit), 1);

    return NextResponse.json(
      {
        success: true,
        message: "Fetch successful",
        data: {
          hero: page.hero,
          notes: result.items.map(toPublicNoteListItem),
        },
        pagination: {
          total: result.total,
          page: currentPage,
          limit,
          totalPages,
          showingStart: result.total ? (currentPage - 1) * limit + 1 : 0,
          showingEnd: Math.min(currentPage * limit, result.total),
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
