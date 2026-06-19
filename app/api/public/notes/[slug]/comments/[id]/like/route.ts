import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

import { FRONTEND_BASE_URL, isProduction } from "@/lib/constants";
import { noteCommentRepository } from "@/lib/db/repositories/notes";
import { extractErrorMessage } from "@/lib/utils";

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
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    let visitorId = cookieStore.get("__sid")?.value;

    if (!visitorId) {
      visitorId = randomUUID();
      cookieStore.set("__sid", visitorId, {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    }

    const result = await noteCommentRepository.toggleLike(id, visitorId);

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Comment not found" },
        { headers: corsHeaders, status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Liked",
        data: {
          id: result.comment._id?.toString(),
          likes: Math.max(result.comment.likes || 0, 0),
          liked: result.liked,
        },
      },
      { headers: corsHeaders, status: 200 }
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
