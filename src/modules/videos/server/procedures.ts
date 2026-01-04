import { db } from "@/drizzle/db";
import { VideoTable, videoUpdateSchema } from "@/drizzle/schema";
import { mux } from "@/lib/mux";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import z from "zod";

export const videoRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policies: ["public"],
        inputs: [
          {
            generated_subtitles: [
              {
                language_code: "en",
                name: "English",
              },
            ],
          },
        ],
      },
      cors_origin: "*", //todo: in production, set to your url
    });

    const [video] = await db
      .insert(VideoTable)
      .values({
        userId,
        title: "Untitled",
        muxStatus: "waiting",
        muxUploadId: upload.id,
      })
      .returning();

    return {
      video,
      url: upload.url,
    };
  }),
  update: protectedProcedure
    .input(videoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      if (!input.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No video found" });
      }

      const [updatedVideo] = await db
        .update(VideoTable)
        .set({
          title: input.title,
          description: input.description,
          categoryId: input.categoryId,
          visibility: input.visibility,
        })
        .where(and(eq(VideoTable.id, input.id), eq(VideoTable.userId, userId)))
        .returning();

      if (!updatedVideo) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No video found" });
      }

      return updatedVideo;
    }),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { id } = input;

      const [removedVideo] = await db
        .delete(VideoTable)
        .where(and(eq(VideoTable.id, id), eq(VideoTable.userId, userId)))
        .returning();

      if (!removedVideo) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No video found" });
      }

      return removedVideo;
    }),
});
