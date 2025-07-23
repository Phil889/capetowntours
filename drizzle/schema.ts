import { pgTable, uuid, varchar, text, numeric, integer, timestamp } from "drizzle-orm/pg-core"

export const tours = pgTable("tours", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 100 }),
  duration_days: integer("duration_days"),
  image_url: varchar("image_url", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
})
