import { db } from "@/drizzle/db";
import { VideoTable } from "@/drizzle/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq, and, or, lt, desc } from "drizzle-orm";
import z from "zod";

export const studioRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().min(1),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.user;

      const data = await db
        .select()
        .from(VideoTable)
        .where(
          and(
            eq(VideoTable.userId, userId),
            cursor
              ? or(
                  lt(VideoTable.updatedAt, cursor.updatedAt),
                  and(
                    eq(VideoTable.updatedAt, cursor.updatedAt),
                    eq(VideoTable.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(VideoTable.updatedAt), desc(VideoTable.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;

      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return {
        items,
        nextCursor,
      };
    }),
});
