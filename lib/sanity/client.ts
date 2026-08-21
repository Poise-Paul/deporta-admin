import "server-only"
import { createClient } from "@sanity/client"

// Server-only: holds a write token, must never reach the client bundle.
export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2026-08-20",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})
