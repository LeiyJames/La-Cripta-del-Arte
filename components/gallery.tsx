"use client"

import { useState } from "react"
import type { Artwork } from "@/types"
import { ArtworkCard } from "./artwork-card"
import { ArtworkModal } from "./artwork-modal"

interface GalleryProps {
  artworks: Artwork[]
}

export function Gallery({ artworks }: GalleryProps) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6 p-6 max-w-7xl mx-auto">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="break-inside-avoid mb-6">
            <ArtworkCard artwork={artwork} onClick={() => handleArtworkClick(artwork)} />
          </div>
        ))}
      </div>
      <ArtworkModal artwork={selectedArtwork} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}
