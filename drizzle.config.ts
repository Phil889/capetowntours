import type { Config } from "drizzle-kit"

export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  connectionString: process.env.DATABASE_URL || "",
} as Config
