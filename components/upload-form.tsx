"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { uploadArtworkImage } from "@/lib/storage-utils"
import type { Artist, Category } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { X, ImageIcon, Loader2 } from "lucide-react"

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
  const [currentStep, setCurrentStep] = useState<"details" | "image">("details")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  const processFile = (file: File) => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors({ image: "Image size must be less than 10MB" })
      return
    }

    // Validate file type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrors({ image: "Only JPEG, PNG, and WebP images are allowed" })
      return
    }

    setFile(file)
    setErrors({})

    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      processFile(selectedFile)
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Only set isDragging to false if we're leaving the dropzone
    // and not entering a child element
    if (e.currentTarget === e.target) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      processFile(droppedFile)
      e.dataTransfer.clearData()
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!artistName.trim()) {
      newErrors.artistName = "Artist name is required"
    }

    if (!categoryId) {
      newErrors.categoryId = "Category is required"
    }

    if (currentStep === "image" && !file) {
      newErrors.image = "Artwork image is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateForm()) {
      setCurrentStep("image")
    }
  }

  const handlePrevStep = () => {
    setCurrentStep("details")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
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
      const { url, path } = await uploadArtworkImage(file!)

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
      setCurrentStep("details")
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

  const handleRemoveImage = () => {
    setFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const resetForm = useCallback(() => {
    setTitle("")
    setDescription("")
    setArtistName("")
    setCategoryId("")
    setFile(null)
    setPreviewUrl(null)
    setCurrentStep("details")
    setErrors({})
  }, [])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          // Reset form when closing
          resetForm()
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl w-[95vw] p-0 bg-deep-blue/95 backdrop-blur-md border border-bruised-purple/30 text-faded-white overflow-hidden">
        <DialogHeader className="px-4 py-3 sm:px-6 sm:py-4 border-b border-bruised-purple/20">
          <DialogTitle className="text-xl font-playfair font-light sorrowful-gradient text-center">
            {currentStep === "details" ? "Artwork Details" : "Upload Image"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4 modal-scrollbar">
            {currentStep === "details" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-teardrop text-sm">
                    Title <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value)
                      if (errors.title) {
                        setErrors({ ...errors, title: "" })
                      }
                    }}
                    placeholder="Enter artwork title"
                    className={`bg-smudged-black/50 border-bruised-purple/30 text-faded-white form-input ${
                      errors.title ? "border-red-500" : ""
                    }`}
                  />
                  {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="artist" className="text-teardrop text-sm">
                    Artist Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="artist"
                    value={artistName}
                    onChange={(e) => {
                      setArtistName(e.target.value)
                      if (errors.artistName) {
                        setErrors({ ...errors, artistName: "" })
                      }
                    }}
                    placeholder="Enter artist name"
                    className={`bg-smudged-black/50 border-bruised-purple/30 text-faded-white form-input ${
                      errors.artistName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.artistName ? (
                    <p className="text-xs text-red-400 mt-1">{errors.artistName}</p>
                  ) : (
                    <p className="text-xs text-faded-white opacity-60 mt-1">
                      If the artist doesn't exist, a new artist will be created.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-teardrop text-sm">
                    Category <span className="text-red-400">*</span>
                  </Label>
                  <Select
                    value={categoryId}
                    onValueChange={(value) => {
                      setCategoryId(value)
                      if (errors.categoryId) {
                        setErrors({ ...errors, categoryId: "" })
                      }
                    }}
                  >
                    <SelectTrigger
                      className={`bg-smudged-black/50 border-bruised-purple/30 text-faded-white form-select ${
                        errors.categoryId ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-deep-blue border-bruised-purple/30 text-faded-white max-h-[200px]">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && <p className="text-xs text-red-400 mt-1">{errors.categoryId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-teardrop text-sm">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter artwork description"
                    className="bg-smudged-black/50 border-bruised-purple/30 text-faded-white form-textarea min-h-[100px]"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  ref={dropZoneRef}
                  className="flex flex-col items-center justify-center w-full"
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {previewUrl ? (
                    <div className="relative w-full rounded-md overflow-hidden bg-transparent">
                      <div className="relative aspect-auto max-h-[400px] flex items-center justify-center">
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt="Preview"
                          className="max-w-full max-h-[400px] object-contain clean-image"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-deep-blue/80 p-1.5 rounded-full hover:bg-bruised-purple/80 transition-colors"
                          aria-label="Remove image"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={triggerFileInput}
                      className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-md cursor-pointer bg-smudged-black/50 hover:bg-deep-blue/50 transition-colors ${
                        isDragging ? "drag-active" : ""
                      } ${errors.image ? "border-red-500" : "border-bruised-purple/30"}`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <div className="flex flex-col items-center justify-center p-5 text-center">
                        <ImageIcon className="w-12 h-12 mb-3 text-teardrop opacity-70" />
                        <p className="mb-2 text-sm text-faded-white opacity-80">
                          <span className="font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-faded-white opacity-60">PNG, JPG or WebP (max. 10MB)</p>
                      </div>
                    </div>
                  )}
                  {errors.image && <p className="text-xs text-red-400 mt-2 text-center">{errors.image}</p>}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center p-4 sm:p-6 border-t border-bruised-purple/20 bg-deep-blue/50">
            {currentStep === "details" ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-bruised-purple/30 bg-transparent text-faded-white hover:bg-deep-blue/70"
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleNextStep} className="btn-sorrowful">
                  Next: Upload Image
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="border-bruised-purple/30 bg-transparent text-faded-white hover:bg-deep-blue/70"
                >
                  Back
                </Button>
                <Button type="submit" disabled={isUploading || !file} className="btn-sorrowful">
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Artwork"
                  )}
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
