import type { NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const POST = async (request: NextRequest) => {
  try {
    const event = await verifyWebhook(request);
    switch (event.type) {
      case "user.created":
      case "user.updated":
        const clerkData = event.data;
        const email = clerkData.email_addresses.find(
          (e) => e.id === clerkData.primary_email_address_id
        )?.email_address;
        if (!email) {
          return new Response("No email found", { status: 400 });
        }
        const user = {
          id: clerkData.id,
          name: `${clerkData.first_name} ${clerkData.last_name}`,
          email,
          imageUrl: clerkData.image_url,
          allowedUser: false,
          createdAt: new Date(clerkData.created_at),
          updatedAt: new Date(clerkData.updated_at),
        };
        await db
          .insert(UserTable)
          .values(user)
          .onConflictDoUpdate({ target: [UserTable.id], set: user });
        break;
      case "user.deleted":
        if (!event.data.id) {
          return new Response("No user ID found", { status: 400 });
        }
        await db.delete(UserTable).where(eq(UserTable.id, event.data.id));
        break;
    }
  } catch (error) {
    return new Response("Invalid webhook", { status: 400 });
  }
  return new Response("Webhook received", { status: 200 });
};
