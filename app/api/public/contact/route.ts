import { NextResponse } from "next/server";

import { FRONTEND_BASE_URL } from "@/lib/constants";
import { contactPageRepository } from "@/lib/db/repositories/contact.repository";
import { ContactMessageSchema } from "@/lib/schemas/contact.schema";
import { mailService } from "@/lib/services/mail.service";
import { extractErrorMessage, parseValidationError } from "@/lib/utils";

const corsHeaders = {
  "Access-Control-Allow-Origin": FRONTEND_BASE_URL,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders, status: 204 });
}

export async function GET() {
  try {
    const { _id, createdAt, updatedAt, ...content } =
      await contactPageRepository.get();

    return NextResponse.json(
      {
        success: true,
        message: "Fetch successful",
        data: {
          ...content,
          createdAt: createdAt.toISOString(),
          updatedAt: updatedAt.toISOString(),
          id: _id?.toString(),
        },
      },
      { headers: corsHeaders, status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: extractErrorMessage(error) || "Could not fetch contact page.",
      },
      { headers: corsHeaders, status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validated = ContactMessageSchema.safeParse(payload);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          message: parseValidationError(validated.error.issues),
        },
        { headers: corsHeaders, status: 400 }
      );
    }

    const { name, email, workType, timeline, budget, details } = validated.data;
    const contactPage = await contactPageRepository.get();
    const recipient =
      contactPage.recipientEmail ||
      contactPage.socials.email ||
      process.env.CONTACT_TO_EMAIL;

    if (!recipient) {
      return NextResponse.json(
        { success: false, message: "No recipient email is configured." },
        { headers: corsHeaders, status: 500 }
      );
    }

    const plainText = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Work type: ${workType || "Not specified"}`,
      `Timeline: ${timeline || "Not specified"}`,
      `Budget: ${budget || "Not specified"}`,
      "",
      details,
    ].join("\n");
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeWorkType = escapeHtml(workType || "Not specified");
    const safeTimeline = escapeHtml(timeline || "Not specified");
    const safeBudget = escapeHtml(budget || "Not specified");
    const safeDetails = escapeHtml(details);

    await mailService.sendMail({
      to: recipient,
      subject: `New portfolio message from ${name}`,
      text: plainText,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2 style="margin: 0 0 16px;">New portfolio request</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Work type:</strong> ${safeWorkType}</p>
          <p><strong>Timeline:</strong> ${safeTimeline}</p>
          <p><strong>Budget:</strong> ${safeBudget}</p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="white-space: pre-line;">${safeDetails}</p>
        </div>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Message recieved. I will get back to you as soon as possible.",
      },
      { headers: corsHeaders, status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: extractErrorMessage(error) || "Could not send message.",
      },
      { headers: corsHeaders, status: 500 }
    );
  }
}
