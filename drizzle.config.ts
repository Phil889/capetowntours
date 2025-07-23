import type { Config } from "drizzle-kit"

export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  url: "postgresql://postgres:[YOUR-PASSWORD]@db.zbgpiqhxrynjllcxqjre.supabase.co:5432/postgres",
} as Config
