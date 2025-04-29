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
      <DialogContent className="max-w-4xl w-[90vw] bg-gray-900 border border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">{artwork.title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-square w-full overflow-hidden rounded-md">
            <Image src={artwork.image_url || "/placeholder.svg"} alt={artwork.title} fill className="object-contain" />
          </div>
          <div className="flex flex-col space-y-4">
            {artwork.artist && (
              <div>
                <h3 className="text-lg font-semibold text-electric-blue">Artist</h3>
                <p className="text-gray-300">{artwork.artist.name}</p>
              </div>
            )}
            {artwork.category && (
              <div>
                <h3 className="text-lg font-semibold text-electric-blue">Category</h3>
                <p className="text-gray-300">{artwork.category.name}</p>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-electric-blue">Description</h3>
              <p className="text-gray-300">{artwork.description || "No description provided."}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-electric-blue">Created</h3>
              <p className="text-gray-300">{new Date(artwork.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
