import { relations } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { VideoTable } from "./video";

export const CategoryTable = pgTable(
  "categories",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: varchar().notNull().unique(),
    description: varchar().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [uniqueIndex().on(t.name)]
);

export const categoryRelations = relations(CategoryTable, ({ many }) => ({
  videos: many(VideoTable),
}));
