import { auth } from "@clerk/nextjs/server";
import { cache } from "react";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { UserTable } from "@/drizzle/schema";
import { ratelimit } from "@/lib/upstash";

export const createTRPCContext = cache(async () => {
  return { auth: await auth() };
});
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const isAuthed = t.middleware(async ({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }

  const [user] = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.id, ctx.auth.userId))
    .limit(1);

  if (!user || (!user.allowedUser && process.env.NODE_ENV === "production")) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unavailable in production",
    });
  }

  const { success } = await ratelimit.limit(user.id);

  if (!success) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests",
    });
  }

  return next({
    ctx: { auth: ctx.auth, user },
  });
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
