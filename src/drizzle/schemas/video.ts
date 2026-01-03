import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { UserTable } from "./user";
import { relations } from "drizzle-orm";
import { CategoryTable } from "./category";

export const videoVisibility = pgEnum("video_visibility", [
  "private",
  "public",
] as const);

export const VideoTable = pgTable("videos", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar().notNull(),
  description: varchar(),
  muxStatus: varchar(),
  muxAssetId: varchar().unique(),
  muxUploadId: varchar().unique(),
  muxPlaybackId: varchar().unique(),
  muxTrackId: varchar().unique(),
  muxTrackStatus: varchar(),
  thumbnailUrl: varchar(),
  previewUrl: varchar(),
  duration: integer().default(0).notNull(),
  visibility: videoVisibility().default("private").notNull(),
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
