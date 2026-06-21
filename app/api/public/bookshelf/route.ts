import { NextResponse } from "next/server";

import { FRONTEND_BASE_URL } from "@/lib/constants";
import { bookRepository } from "@/lib/db/repositories/book.repository";
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
    const books = await bookRepository.findPublished();

    return NextResponse.json(
      {
        success: true,
        message: "Fetch successful",
        data: books.map((book) => ({
          id: book._id?.toString(),
          title: book.title,
          author: book.author,
          category: book.category,
          note: book.note,
          rating: book.rating,
          order: book.order,
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
