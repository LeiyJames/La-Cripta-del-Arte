"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import type { Artwork } from "@/types"

interface FeaturedArtworkProps {
  artwork: Artwork
}

export function FeaturedArtwork({ artwork }: FeaturedArtworkProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative w-full h-[70vh] overflow-hidden mb-12">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-smudged-black z-10" />

      <div className="relative h-full w-full">
        <Image
          src={artwork.image_url || "/placeholder.svg"}
          alt={artwork.title}
          fill
          className={`object-cover transition-opacity duration-1000 filter brightness-75 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsLoading(false)}
        />
        {isLoading && <div className="absolute inset-0 bg-deep-blue animate-pulse" />}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-light mb-4 sorrowful-gradient">
              {artwork.title}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-faded-white text-lg md:text-xl opacity-80 max-w-2xl font-light">
              {artwork.description || "A haunting piece that speaks to the depths of human emotion."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-4"
          >
            {artwork.artist && (
              <p className="text-teardrop text-sm md:text-base font-light tracking-wider">By {artwork.artist.name}</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
