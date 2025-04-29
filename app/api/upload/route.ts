import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client with admin privileges
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Get form data from request
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    // Create a unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const storagePath = `${fileName}`

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage.from("artworks").upload(storagePath, buffer, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    })

    if (error) {
      console.error("Error uploading file:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage.from("artworks").getPublicUrl(storagePath)

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      path: storagePath,
    })
  } catch (error) {
    console.error("Error in upload API route:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Create Supabase client with admin privileges
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Get path from query params
    const { searchParams } = new URL(request.url)
    const path = searchParams.get("path")

    if (!path) {
      return NextResponse.json({ success: false, error: "No file path provided" }, { status: 400 })
    }

    // Delete the file from Supabase Storage
    const { error } = await supabase.storage.from("artworks").remove([path])

    if (error) {
      console.error("Error deleting file:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("Error in delete API route:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
