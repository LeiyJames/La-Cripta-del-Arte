"use client"

import { useState } from "react"
import type { Artist, Category } from "@/types"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface FilterPanelProps {
  artists: Artist[]
  categories: Category[]
  selectedArtist: number | null
  selectedCategory: number | null
  onArtistChange: (artistId: number | null) => void
  onCategoryChange: (categoryId: number | null) => void
}

export function FilterPanel({
  artists,
  categories,
  selectedArtist,
  selectedCategory,
  onArtistChange,
  onCategoryChange,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedArtistName = selectedArtist
    ? artists.find((a) => a.id === selectedArtist)?.name || "Unknown Artist"
    : "All Artists"

  const selectedCategoryName = selectedCategory
    ? categories.find((c) => c.id === selectedCategory)?.name || "Unknown Category"
    : "All Categories"

  return (
    <div className="sticky top-[72px] z-10 bg-smudged-black/80 backdrop-blur-md p-4 border-b border-bruised-purple/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-playfair font-light text-faded-white opacity-80">Gallery</h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-[200px] justify-between bg-deep-blue/50 border-bruised-purple/30 text-faded-white"
                  >
                    <span className="truncate">{selectedArtistName}</span>
                    <ChevronDown className="h-4 w-4 ml-2 text-teardrop" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px] bg-deep-blue border-bruised-purple/30 text-faded-white">
                  <DropdownMenuItem
                    className={!selectedArtist ? "bg-bruised-purple/20" : ""}
                    onClick={() => onArtistChange(null)}
                  >
                    <span className="flex-1">All Artists</span>
                    {!selectedArtist && <Check className="h-4 w-4 ml-2 text-teardrop" />}
                  </DropdownMenuItem>
                  {artists.map((artist) => (
                    <DropdownMenuItem
                      key={artist.id}
                      className={selectedArtist === artist.id ? "bg-bruised-purple/20" : ""}
                      onClick={() => onArtistChange(artist.id)}
                    >
                      <span className="flex-1 truncate">{artist.name}</span>
                      {selectedArtist === artist.id && <Check className="h-4 w-4 ml-2 text-teardrop" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-[200px] justify-between bg-deep-blue/50 border-bruised-purple/30 text-faded-white"
                  >
                    <span className="truncate">{selectedCategoryName}</span>
                    <ChevronDown className="h-4 w-4 ml-2 text-teardrop" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px] bg-deep-blue border-bruised-purple/30 text-faded-white">
                  <DropdownMenuItem
                    className={!selectedCategory ? "bg-bruised-purple/20" : ""}
                    onClick={() => onCategoryChange(null)}
                  >
                    <span className="flex-1">All Categories</span>
                    {!selectedCategory && <Check className="h-4 w-4 ml-2 text-teardrop" />}
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      className={selectedCategory === category.id ? "bg-bruised-purple/20" : ""}
                      onClick={() => onCategoryChange(category.id)}
                    >
                      <span className="flex-1 truncate">{category.name}</span>
                      {selectedCategory === category.id && <Check className="h-4 w-4 ml-2 text-teardrop" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
