/**
 * TODO: This is a WIP. The goal is to have a single source of truth for all environment variables.
 * Different prefixes for public environments across Expo & Next.js currently block this.
 */

import { object, parse, string, optional } from 'valibot'

const envSchema = object({
  NODE_ENV: optional(string()),
  // Routing
  NEXT_PUBLIC_API_URL: string(),
  NEXT_PUBLIC_APP_URL: string(),
  // Authentication
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string(),
  NEXT_PUBLIC_SUPABASE_URL: string(),
  JWT_VERIFICATION_KEY: optional(string()),
  // Customer Support
  NEXT_PUBLIC_SUPPORT_EMAIL: optional(string()),
  // Tamagui Debug
  TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD: optional(string()),
  TAMAGUI_TARGET: optional(string()),
  // Web Metadata
  NEXT_PUBLIC_METADATA_NAME: optional(string()),
})

export const env = parse(envSchema, process.env)
