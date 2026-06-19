import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { FRONTEND_BASE_URL } from "@/lib/constants";
import {
  noteCommentRepository,
  noteRepository,
} from "@/lib/db/repositories/notes";
import { extractErrorMessage } from "@/lib/utils";
import type { NoteCommentContent } from "@/lib/types/notes";

const corsHeaders = {
  "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
};

type PublicComment = {
  id: string;
  parentId: string | null;
  name: string;
  website: string;
  content: string;
  likes: number;
  liked: boolean;
  createdAt: string;
  replies: PublicComment[];
};

const buildCommentTree = (
  comments: NoteCommentContent[],
  visitorId?: string
): PublicComment[] => {
  const byId = new Map<string, PublicComment>();
  const roots: PublicComment[] = [];

  comments.forEach((comment) => {
    const id = comment._id?.toString() || "";
    byId.set(id, {
      id,
      parentId: comment.parentId || null,
      name: comment.name,
      website: comment.website || "",
      content: comment.content,
      likes: Math.max(comment.likes || 0, 0),
      liked: visitorId ? (comment.likedBy || []).includes(visitorId) : false,
      createdAt: comment.createdAt.toISOString(),
      replies: [],
    });
  });

  byId.forEach((comment) => {
    if (comment.parentId && byId.has(comment.parentId)) {
      byId.get(comment.parentId)?.replies.push(comment);
    } else {
      roots.push(comment);
    }
  });

  return roots;
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders, status: 204 });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const visitorId = (await cookies()).get("__sid")?.value;
    const note = await noteRepository.findBySlug(slug);

    if (!note || !note.published) {
      return Response.json(
        { success: false, message: "Note not found" },
        { headers: corsHeaders, status: 404 }
      );
    }

    const [comments, relatedPosts] = await Promise.all([
      noteCommentRepository.findByNoteSlug(slug),
      noteRepository.findRelated(note, 4),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Fetch successful",
        data: {
          id: note._id?.toString(),
          title: note.title,
          slug: note.slug,
          excerpt: note.excerpt || "",
          content: note.content,
          featured: note.featured,
          allowComments: note.allowComments ?? false,
          bannerImage: note.bannerImage,
          bannerCaption: note.bannerCaption,
          tags: note.tags || [],
          readTime: note.readTime || "1 min read",
          views: note.views || 0,
          author: note.author || { name: "Somto", image: null },
          publishedAt: note.publishedAt?.toISOString() ?? null,
          updatedAt: (note.updatedAt ?? note.createdAt).toISOString(),
          comments: buildCommentTree(comments, visitorId),
          relatedPosts: relatedPosts.map((item) => ({
            title: item.title,
            slug: item.slug,
            excerpt: item.excerpt || "",
            bannerImage: item.bannerImage || "",
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
