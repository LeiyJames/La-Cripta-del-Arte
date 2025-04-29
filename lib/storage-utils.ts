import { createClientComponentClient } from "./supabase"

export async function uploadArtworkImage(file: File) {
  const supabase = createClientComponentClient()

  // Create a unique file name
  const fileExt = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
  const storagePath = `${fileName}`

  // Upload the file to Supabase Storage
  const { data, error } = await supabase.storage.from("artworks").upload(storagePath, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    console.error("Error uploading file:", error)
    throw error
  }

  // Get the public URL
  const { data: publicUrlData } = supabase.storage.from("artworks").getPublicUrl(storagePath)

  return {
    url: publicUrlData.publicUrl,
    path: storagePath,
  }
}

export async function deleteArtworkImage(path: string) {
  const supabase = createClientComponentClient()

  const { error } = await supabase.storage.from("artworks").remove([path])

  if (error) {
    console.error("Error deleting file:", error)
    throw error
  }

  return { success: true }
}
