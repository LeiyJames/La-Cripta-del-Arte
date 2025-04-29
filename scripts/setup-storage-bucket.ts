import { createClient } from "@supabase/supabase-js"

async function setupStorageBucket() {
  // Create Supabase client with admin privileges
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  console.log("Creating artworks storage bucket...")

  try {
    // Check if the bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      throw listError
    }

    const artworksBucketExists = buckets.some((bucket) => bucket.name === "artworks")

    if (artworksBucketExists) {
      console.log("Artworks bucket already exists")

      // Update bucket settings
      const { error: updateError } = await supabase.storage.updateBucket("artworks", {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
      })

      if (updateError) {
        throw updateError
      }

      console.log("Updated artworks bucket settings")
      return
    }

    // Create the bucket
    const { error: createError } = await supabase.storage.createBucket("artworks", {
      public: true, // Make files publicly accessible
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    })

    if (createError) {
      throw createError
    }

    console.log("Successfully created artworks storage bucket")
  } catch (error) {
    console.error("Error setting up storage bucket:", error)
    throw error
  }
}

// Run the setup function
setupStorageBucket()
  .then(() => {
    console.log("Storage bucket setup complete")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Storage bucket setup failed:", error)
    process.exit(1)
  })
