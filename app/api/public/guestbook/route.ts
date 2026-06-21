import { NextResponse } from "next/server";

import { FRONTEND_BASE_URL } from "@/lib/constants";
import { guestbookRepository } from "@/lib/db/repositories/guestbook.repository";
import { GuestbookEntrySchema } from "@/lib/schemas/guestbook.schema";
import { extractErrorMessage, parseValidationError } from "@/lib/utils";

const corsHeaders = {
  "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders, status: 204 });
}

export async function GET() {
  try {
    const entries = await guestbookRepository.findApproved();

    return NextResponse.json(
      {
        success: true,
        message: "Fetch successful",
        data: entries.map((entry) => ({
          id: entry._id?.toString(),
          name: entry.name,
          avatarUrl: entry.avatarUrl || "",
          website: entry.website || "",
          message: entry.message,
          createdAt: entry.createdAt.toISOString(),
        })),
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

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validated = GuestbookEntrySchema.safeParse(payload);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: parseValidationError(validated.error.issues),
        },
        { headers: corsHeaders, status: 400 }
      );
    }

    const order = await guestbookRepository.getNextOrder();
    await guestbookRepository.create({ ...validated.data, order });

    return NextResponse.json(
      {
        success: true,
        message: "Entry submitted for review. It will appear once approved.",
      },
      { headers: corsHeaders, status: 201 }
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
