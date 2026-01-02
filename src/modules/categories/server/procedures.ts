import { db } from "@/drizzle/db";
import { CategoryTable } from "@/drizzle/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const data = await db.select().from(CategoryTable);
    return data;
  }),
});
