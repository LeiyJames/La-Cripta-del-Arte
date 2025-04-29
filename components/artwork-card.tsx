"use client"

import { useState } from "react"
import Image from "next/image"
import type { Artwork } from "@/types"

interface ArtworkCardProps {
  artwork: Artwork
  onClick: () => void
}

export function ArtworkCard({ artwork, onClick }: ArtworkCardProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div
      className="group relative overflow-hidden rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]"
      onClick={onClick}
    >
      <div className="aspect-[3/4] w-full relative">
        <Image
          src={artwork.image_url || "/placeholder.svg"}
          alt={artwork.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-all duration-500 ${
            isLoading ? "opacity-0" : "opacity-100"
          } group-hover:scale-110`}
          onLoad={() => setIsLoading(false)}
        />
        {isLoading && <div className="absolute inset-0 bg-gray-800 animate-pulse" />}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white font-bold truncate">{artwork.title}</h3>
        {artwork.artist && <p className="text-gray-300 text-sm truncate">{artwork.artist.name}</p>}
      </div>
    </div>
  )
}
