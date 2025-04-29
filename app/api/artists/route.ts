import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client with admin privileges
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Get artist data from request
    const { name, bio } = await request.json()

    if (!name) {
      return NextResponse.json({ success: false, error: "Artist name is required" }, { status: 400 })
    }

    // Check if artist already exists
    const { data: existingArtist, error: findError } = await supabase
      .from("artists")
      .select("*")
      .ilike("name", name)
      .maybeSingle()

    if (findError) {
      console.error("Error checking for existing artist:", findError)
      return NextResponse.json({ success: false, error: findError.message }, { status: 500 })
    }

    // If artist exists, return it
    if (existingArtist) {
      return NextResponse.json({
        success: true,
        artist: existingArtist,
        created: false,
      })
    }

    // Insert new artist
    const { data: newArtist, error: insertError } = await supabase
      .from("artists")
      .insert({
        name,
        bio: bio || null,
      })
      .select()

    if (insertError) {
      console.error("Error creating artist:", insertError)
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      artist: newArtist[0],
      created: true,
    })
  } catch (error) {
    console.error("Error in artists API route:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
