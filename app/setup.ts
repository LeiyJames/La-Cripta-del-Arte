import { setupStorageBucket } from "@/lib/setup-storage"

export async function setupApp() {
  // Setup storage bucket
  await setupStorageBucket()

  return { success: true }
}
