import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client with admin privileges
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Get artwork data from request
    const artworkData = await request.json()

    // Insert artwork record into database
    const { data, error } = await supabase
      .from("artworks")
      .insert({
        title: artworkData.title,
        description: artworkData.description,
        artist_id: artworkData.artist_id,
        category_id: artworkData.category_id,
        image_url: artworkData.image_url,
        storage_path: artworkData.storage_path,
      })
      .select()

    if (error) {
      console.error("Error creating artwork:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // Revalidate the home page to show the new artwork
    revalidatePath("/")

    return NextResponse.json({
      success: true,
      artwork: data[0],
    })
  } catch (error) {
    console.error("Error in artworks API route:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
