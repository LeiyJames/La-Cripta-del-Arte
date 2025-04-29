import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Create Supabase client with admin privileges
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Check if the bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      throw listError
    }

    const artworksBucketExists = buckets.some((bucket) => bucket.name === "artworks")

    if (artworksBucketExists) {
      // Update bucket settings
      const { error: updateError } = await supabase.storage.updateBucket("artworks", {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
      })

      if (updateError) {
        throw updateError
      }

      return NextResponse.json({
        success: true,
        message: "Artworks bucket already exists, settings updated",
      })
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

    return NextResponse.json({
      success: true,
      message: "Successfully created artworks storage bucket",
    })
  } catch (error) {
    console.error("Error setting up storage bucket:", error)
    return NextResponse.json({ success: false, error: "Failed to set up storage bucket" }, { status: 500 })
  }
}
