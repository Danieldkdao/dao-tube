import { auth } from "@clerk/nextjs/server";
import { cache } from "react";
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

export const createTRPCContext = cache(async () => {
  return { auth: await auth() };
});
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson
})

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure
