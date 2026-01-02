import { pgTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const UserTable = pgTable(
  "users",
  {
    id: varchar().primaryKey(),
    name: varchar().notNull(),
    // todo: add banner fields
    imageUrl: varchar().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [uniqueIndex().on(t.id)]
);
