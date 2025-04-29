import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ success: false, error: "Artist ID is required" }, { status: 400 })
    }

    // Create Supabase client with admin privileges
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Check if the artist has any artworks
    const { count, error: countError } = await supabase
      .from("artworks")
      .select("*", { count: "exact", head: true })
      .eq("artist_id", id)

    if (countError) {
      console.error("Error checking for artworks:", countError)
      return NextResponse.json({ success: false, error: countError.message }, { status: 500 })
    }

    if (count && count > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete artist with existing artworks. Please delete the artworks first.",
        },
        { status: 400 },
      )
    }

    // Delete the artist
    const { error: deleteError } = await supabase.from("artists").delete().eq("id", id)

    if (deleteError) {
      console.error("Error deleting artist:", deleteError)
      return NextResponse.json({ success: false, error: deleteError.message }, { status: 500 })
    }

    // Revalidate the home page to reflect the changes
    revalidatePath("/")
    revalidatePath("/admin")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in delete artist API route:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
