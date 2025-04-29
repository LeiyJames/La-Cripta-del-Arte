export interface Artist {
  id: number
  name: string
  bio: string | null
  created_at: string
}

export interface Category {
  id: number
  name: string
  created_at: string
}

export interface Artwork {
  id: number
  title: string
  description: string | null
  artist_id: number
  category_id: number
  image_url: string
  storage_path: string
  created_at: string
  artist?: Artist
  category?: Category
}
