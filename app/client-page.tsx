"use client"

import { useState } from "react"
import type { Artwork, Artist, Category } from "@/types"
import { Gallery } from "@/components/gallery"
import { FilterPanel } from "@/components/filter-panel"
import { UploadForm } from "@/components/upload-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"

interface ClientPageProps {
  initialArtworks: Artwork[]
  artists: Artist[]
  categories: Category[]
}

export default function ClientPage({ initialArtworks, artists, categories }: ClientPageProps) {
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false)

  // Filter artworks based on selected artist and category
  const filteredArtworks = initialArtworks.filter((artwork) => {
    const artistMatch = selectedArtist ? artwork.artist_id === selectedArtist : true
    const categoryMatch = selectedCategory ? artwork.category_id === selectedCategory : true
    return artistMatch && categoryMatch
  })

  return (
    <div className="relative z-0">
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-electric-blue to-magenta bg-clip-text text-transparent">
            Modern Art Gallery
          </h1>
          <Button onClick={() => setIsUploadFormOpen(true)} className="bg-electric-blue hover:bg-electric-blue/80">
            <Plus className="mr-2 h-4 w-4" /> Upload Artwork
          </Button>
        </div>
      </header>

      <FilterPanel
        artists={artists}
        categories={categories}
        selectedArtist={selectedArtist}
        selectedCategory={selectedCategory}
        onArtistChange={setSelectedArtist}
        onCategoryChange={setSelectedCategory}
      />

      {filteredArtworks.length > 0 ? (
        <Gallery artworks={filteredArtworks} />
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <h2 className="text-xl font-semibold mb-2">No artworks found</h2>
          <p className="text-gray-400 mb-6">
            No artworks match your current filter criteria. Try changing your filters or upload a new artwork.
          </p>
          <Button onClick={() => setIsUploadFormOpen(true)} className="bg-electric-blue hover:bg-electric-blue/80">
            <Plus className="mr-2 h-4 w-4" /> Upload Artwork
          </Button>
        </div>
      )}

      <UploadForm
        isOpen={isUploadFormOpen}
        onClose={() => setIsUploadFormOpen(false)}
        artists={artists}
        categories={categories}
      />

      <Toaster />
    </div>
  )
}
