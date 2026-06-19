import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { FRONTEND_BASE_URL } from "@/lib/constants";
import { noteRepository } from "@/lib/db/repositories/notes";
import { extractErrorMessage } from "@/lib/utils";
import { isProduction } from "better-auth";

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
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
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

    const result = await noteRepository.recordRead(slug, visitorId);

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Note not found" },
        { headers: corsHeaders, status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result.counted ? "Read counted" : "Read already counted",
        data: {
          views: result.note.views || 0,
          counted: result.counted,
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
