import { db } from "@/drizzle/db";
import { VideoTable } from "@/drizzle/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const videoRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    const [video] = await db
      .insert(VideoTable)
      .values({
        userId,
        title: "Untitled",
      })
      .returning();

    return {
      video,
    };
  }),
});
