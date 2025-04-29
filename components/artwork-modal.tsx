"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Artwork } from "@/types"
import Image from "next/image"

interface ArtworkModalProps {
  artwork: Artwork | null
  isOpen: boolean
  onClose: () => void
}

export function ArtworkModal({ artwork, isOpen, onClose }: ArtworkModalProps) {
  if (!artwork) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] bg-deep-blue/90 backdrop-blur-md border border-bruised-purple/30 text-faded-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair font-light sorrowful-gradient">{artwork.title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-square w-full overflow-hidden rounded-md cracked-overlay">
            <Image src={artwork.image_url || "/placeholder.svg"} alt={artwork.title} fill className="object-contain" />
          </div>
          <div className="flex flex-col space-y-4">
            {artwork.artist && (
              <div>
                <h3 className="text-lg font-playfair font-light text-teardrop">Artist</h3>
                <p className="text-faded-white opacity-80">{artwork.artist.name}</p>
              </div>
            )}
            {artwork.category && (
              <div>
                <h3 className="text-lg font-playfair font-light text-teardrop">Category</h3>
                <p className="text-faded-white opacity-80">{artwork.category.name}</p>
              </div>
            )}
            <div>
              <h3 className="text-lg font-playfair font-light text-teardrop">Description</h3>
              <p className="text-faded-white opacity-80 font-light">
                {artwork.description || "No description provided."}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-playfair font-light text-teardrop">Created</h3>
              <p className="text-faded-white opacity-80">{new Date(artwork.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
