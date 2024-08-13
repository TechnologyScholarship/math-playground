import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/db/schema.ts',
  out: './migrations',
  driver: 'expo',
  verbose: false,
  strict: true,
})
