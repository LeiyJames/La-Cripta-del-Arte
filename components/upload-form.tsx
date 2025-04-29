"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { uploadArtworkImage } from "@/lib/storage-utils"
import type { Artist, Category } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Upload, Loader2 } from "lucide-react"

interface UploadFormProps {
  isOpen: boolean
  onClose: () => void
  artists: Artist[]
  categories: Category[]
}

export function UploadForm({ isOpen, onClose, artists, categories }: UploadFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [artistName, setArtistName] = useState("")
  const [categoryId, setCategoryId] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const router = useRouter()
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !artistName || !categoryId || !file) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields and select an image.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // First, get or create the artist
      const artistResponse = await fetch("/api/artists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: artistName.trim(),
        }),
      })

      if (!artistResponse.ok) {
        const errorData = await artistResponse.json()
        throw new Error(errorData.error || "Failed to create artist")
      }

      const artistData = await artistResponse.json()
      const artistId = artistData.artist.id

      // Upload image to Supabase Storage using our API route
      const { url, path } = await uploadArtworkImage(file)

      // Create artwork record in database using our API route
      const response = await fetch("/api/artworks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          artist_id: artistId,
          category_id: Number.parseInt(categoryId),
          image_url: url,
          storage_path: path,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create artwork")
      }

      toast({
        title: "Artwork uploaded",
        description: artistData.created
          ? `Your artwork has been uploaded with new artist "${artistName}".`
          : "Your artwork has been successfully uploaded.",
      })

      // Reset form and close dialog
      setTitle("")
      setDescription("")
      setArtistName("")
      setCategoryId("")
      setFile(null)
      setPreviewUrl(null)
      onClose()

      // Refresh the page to show the new artwork
      router.refresh()
    } catch (error) {
      console.error("Error uploading artwork:", error)
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "There was an error uploading your artwork. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-deep-blue/90 backdrop-blur-md border border-bruised-purple/30 text-faded-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair font-light sorrowful-gradient">Upload Artwork</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-teardrop">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter artwork title"
                  required
                  className="bg-smudged-black/50 border-bruised-purple/30 text-faded-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-teardrop">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter artwork description"
                  className="bg-smudged-black/50 border-bruised-purple/30 text-faded-white min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="artist" className="text-teardrop">
                  Artist Name *
                </Label>
                <Input
                  id="artist"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="Enter artist name"
                  required
                  className="bg-smudged-black/50 border-bruised-purple/30 text-faded-white"
                />
                <p className="text-xs text-faded-white opacity-60">
                  If the artist doesn't exist, a new artist will be created.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-teardrop">
                  Category *
                </Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger className="bg-smudged-black/50 border-bruised-purple/30 text-faded-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-deep-blue border-bruised-purple/30 text-faded-white">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image" className="text-teardrop">
                  Artwork Image *
                </Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-md cursor-pointer bg-smudged-black/50 border-bruised-purple/30 hover:bg-deep-blue/50"
                  >
                    {previewUrl ? (
                      <div className="relative w-full h-full">
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-teardrop opacity-70" />
                        <p className="mb-2 text-sm text-faded-white opacity-70">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-faded-white opacity-60">PNG, JPG or WEBP (MAX. 10MB)</p>
                      </div>
                    )}
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                      required
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-bruised-purple/30 bg-transparent text-faded-white hover:bg-deep-blue/50"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading} className="btn-sorrowful">
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Artwork"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
