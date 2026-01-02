import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { UserTable } from "./user";
import { relations } from "drizzle-orm";
import { CategoryTable } from "./category";

export const VideoTable = pgTable("videos", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar().notNull(),
  description: varchar(),
  userId: varchar()
    .references(() => UserTable.id, { onDelete: "cascade" })
    .notNull(),
  categoryId: uuid().references(() => CategoryTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const videoRelations = relations(VideoTable, ({ one, many }) => ({
  user: one(UserTable, {
    fields: [VideoTable.userId],
    references: [UserTable.id],
  }),
  category: one(CategoryTable, {
    fields: [VideoTable.categoryId],
    references: [CategoryTable.id],
  }),
}));
