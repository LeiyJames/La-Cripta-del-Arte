"use server"

import { createServerComponentClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function getArtworks() {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase
    .from("artworks")
    .select(`
      *,
      artist:artist_id(*),
      category:category_id(*)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching artworks:", error)
    return []
  }

  return data
}

export async function getArtists() {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("artists").select("*").order("name")

  if (error) {
    console.error("Error fetching artists:", error)
    return []
  }

  return data
}

export async function getCategories() {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data
}

export async function createArtwork(artwork: {
  title: string
  description: string
  artist_id: number
  category_id: number
  image_url: string
  storage_path: string
}) {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from("artworks").insert(artwork).select()

  if (error) {
    console.error("Error creating artwork:", error)
    throw new Error("Failed to create artwork")
  }

  revalidatePath("/")
  return data[0]
}
