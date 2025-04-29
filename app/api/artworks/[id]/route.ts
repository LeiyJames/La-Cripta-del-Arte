import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ success: false, error: "Artwork ID is required" }, { status: 400 })
    }

    // Create Supabase client with admin privileges
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // First, get the artwork to find its storage path
    const { data: artwork, error: getError } = await supabase
      .from("artworks")
      .select("storage_path")
      .eq("id", id)
      .single()

    if (getError) {
      console.error("Error getting artwork:", getError)
      return NextResponse.json({ success: false, error: getError.message }, { status: 500 })
    }

    if (!artwork) {
      return NextResponse.json({ success: false, error: "Artwork not found" }, { status: 404 })
    }

    // Delete the artwork record
    const { error: deleteError } = await supabase.from("artworks").delete().eq("id", id)

    if (deleteError) {
      console.error("Error deleting artwork:", deleteError)
      return NextResponse.json({ success: false, error: deleteError.message }, { status: 500 })
    }

    // Delete the associated file from storage if it exists
    if (artwork.storage_path) {
      const { error: storageError } = await supabase.storage.from("artworks").remove([artwork.storage_path])

      if (storageError) {
        console.error("Error deleting file from storage:", storageError)
        // Continue anyway, as the database record is already deleted
      }
    }

    // Revalidate the home page to reflect the changes
    revalidatePath("/")
    revalidatePath("/admin")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in delete artwork API route:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
