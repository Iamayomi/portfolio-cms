import { NextResponse } from "next/server";

import { newsletterRepository } from "@/lib/db/repositories/newsletter";

type ButtondownSubscriber = {
  id: string;
  email_address: string;
  type?: string;
  created_at?: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
};

type ButtondownWebhookEvent = {
  event_type: string;
  data: ButtondownSubscriber;
};

export async function POST(request: Request) {
  const event = (await request.json()) as ButtondownWebhookEvent;

  console.log({ event });

  if (event.event_type === "subscriber.confirmed") {
    const subscriber = event.data?.email_address || "unknown@subscriber.com";

    await newsletterRepository.subscribe({
      email: subscriber,
    });

    console.log("Subscriber confirmed:", subscriber);
  }

  if (event.event_type === "subscriber.created") {
    const subscriber = event.data?.email_address || "unknown@subscriber.com";

    await newsletterRepository.subscribe({
      email: subscriber,
    });

    console.log("Subscriber created:", subscriber);
  }

  if (event.event_type === "subscriber.unsubscribed") {
    const subscriber = event.data?.email_address;
    console.log("Subscriber unsubscribed:", subscriber);

    if (!subscriber) console.error("Subscriber not found");

    await newsletterRepository.unSubscribe(subscriber);
  }

  return NextResponse.json({ received: true });
}
