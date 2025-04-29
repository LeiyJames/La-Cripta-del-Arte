import { createServerComponentClient } from "./supabase"

export async function setupStorageBucket() {
  const supabase = createServerComponentClient()

  // Check if the bucket exists
  const { data: buckets } = await supabase.storage.listBuckets()
  const artworksBucketExists = buckets?.some((bucket) => bucket.name === "artworks")

  // Create the bucket if it doesn't exist
  if (!artworksBucketExists) {
    await supabase.storage.createBucket("artworks", {
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
    })
  }

  return { success: true }
}
