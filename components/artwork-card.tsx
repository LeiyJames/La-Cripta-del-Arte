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
      className="group relative overflow-hidden rounded-md cursor-pointer transition-shadow duration-500 hover:shadow-[0_0_15px_rgba(92,84,112,0.3)] cracked-overlay"
      onClick={onClick}
    >
      <div className="aspect-[3/4] w-full relative">
        <Image
          src={artwork.image_url || "/placeholder.svg"}
          alt={artwork.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-all duration-500 filter brightness-90 ${
            isLoading ? "opacity-0" : "opacity-100"
          } group-hover:brightness-100 group-hover:scale-[1.03] will-change-transform`}
          onLoad={() => setIsLoading(false)}
        />
        {isLoading && <div className="absolute inset-0 bg-deep-blue animate-pulse" />}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-smudged-black via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-0 transition-transform duration-500 opacity-90 group-hover:opacity-100">
        <h3 className="text-faded-white font-playfair font-light text-lg truncate">{artwork.title}</h3>
        {artwork.artist && <p className="text-teardrop text-sm truncate opacity-80">{artwork.artist.name}</p>}
      </div>
    </div>
  )
}
