import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { VideoTable } from "./video";

export const UserTable = pgTable(
  "users",
  {
    id: varchar().primaryKey(),
    name: varchar().notNull(),
    // todo: add banner fields
    allowedUser: boolean().notNull(),
    imageUrl: varchar().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [uniqueIndex().on(t.id)]
);

export const userRelations = relations(UserTable, ({ many }) => ({
  videos: many(VideoTable),
}));
