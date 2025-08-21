import { pgTable, uuid, varchar, text, numeric, integer, timestamp, date } from "drizzle-orm/pg-core"

export const tours = pgTable("tours", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 100 }),
  duration_days: integer("duration_days"),
  image_url: varchar("image_url", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const tour_availability = pgTable("tour_availability", {
  id: uuid("id").primaryKey().defaultRandom(),
  tour_id: uuid("tour_id").notNull(),
  date: date("date").notNull(),
  available_slots: integer("available_slots").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const custom_itineraries = pgTable("custom_itineraries", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id"),
  itinerary: text("itinerary").notNull(), // JSON stringified itinerary
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
