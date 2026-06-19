import { NextResponse } from "next/server";

import { FRONTEND_BASE_URL } from "@/lib/constants";
import {
  noteCommentRepository,
  noteRepository,
} from "@/lib/db/repositories/notes";
import { NoteCommentSchema } from "@/lib/schemas/note.schema";
import { extractErrorMessage, parseValidationError } from "@/lib/utils";

const corsHeaders = {
  "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders, status: 204 });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const note = await noteRepository.findBySlug(slug);

    if (!note || !note.published) {
      return NextResponse.json(
        { success: false, message: "Note not found" },
        { headers: corsHeaders, status: 404 }
      );
    }

    if (!note.allowComments) {
      return NextResponse.json(
        { success: false, message: "Comments are closed for this note." },
        { headers: corsHeaders, status: 403 }
      );
    }

    const payload = await request.json();
    const validated = NoteCommentSchema.safeParse(payload);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: parseValidationError(validated.error.issues),
        },
        { headers: corsHeaders, status: 400 }
      );
    }

    const comment = await noteCommentRepository.create({
      ...validated.data,
      noteSlug: slug,
      noteId: note._id?.toString(),
      parentId: validated.data.parentId || null,
      likes: 0,
      likedBy: [],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Comment posted",
        data: {
          id: comment._id?.toString(),
          name: comment.name,
          website: comment.website || "",
          parentId: comment.parentId || null,
          replies: [],
          liked: false,
          content: comment.content,
          likes: comment.likes,
          createdAt: comment.createdAt.toISOString(),
        },
      },
      { headers: corsHeaders, status: 201 }
    );
  } catch (error) {
    const message =
      extractErrorMessage(error) || "Something went wrong, try again.";
    return NextResponse.json(
      { success: false, message },
      { headers: corsHeaders, status: 500 }
    );
  }
}
