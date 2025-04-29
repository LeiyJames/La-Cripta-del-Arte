"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Trash2, AlertCircle, Loader2 } from "lucide-react"
import type { Artwork, Artist } from "@/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AdminDashboardProps {
  initialArtworks: Artwork[]
  initialArtists: Artist[]
}

export function AdminDashboard({ initialArtworks, initialArtists }: AdminDashboardProps) {
  const [artworks, setArtworks] = useState(initialArtworks)
  const [artists, setArtists] = useState(initialArtists)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [itemToDelete, setItemToDelete] = useState<{ type: "artwork" | "artist"; id: number } | null>(null)

  const router = useRouter()
  const { toast } = useToast()

  const handleDeleteArtwork = async (id: number) => {
    setIsDeleting(true)
    setDeleteError(null)

    try {
      const response = await fetch(`/api/artworks/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete artwork")
      }

      // Remove the artwork from the state
      setArtworks(artworks.filter((artwork) => artwork.id !== id))

      toast({
        title: "Artwork deleted",
        description: "The artwork has been successfully deleted.",
      })

      // Refresh the page to update the data
      router.refresh()
    } catch (error) {
      console.error("Error deleting artwork:", error)
      setDeleteError(error instanceof Error ? error.message : "Failed to delete artwork")

      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "There was an error deleting the artwork.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setItemToDelete(null)
    }
  }

  const handleDeleteArtist = async (id: number) => {
    setIsDeleting(true)
    setDeleteError(null)

    try {
      const response = await fetch(`/api/artists/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete artist")
      }

      // Remove the artist from the state
      setArtists(artists.filter((artist) => artist.id !== id))

      toast({
        title: "Artist deleted",
        description: "The artist has been successfully deleted.",
      })

      // Refresh the page to update the data
      router.refresh()
    } catch (error) {
      console.error("Error deleting artist:", error)
      setDeleteError(error instanceof Error ? error.message : "Failed to delete artist")

      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "There was an error deleting the artist.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setItemToDelete(null)
    }
  }

  const confirmDelete = () => {
    if (!itemToDelete) return

    if (itemToDelete.type === "artwork") {
      handleDeleteArtwork(itemToDelete.id)
    } else {
      handleDeleteArtist(itemToDelete.id)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-playfair font-light mb-8 sorrowful-gradient">Admin Dashboard</h1>

      <Tabs defaultValue="artworks" className="w-full">
        <TabsList className="mb-6 bg-deep-blue/50 border border-bruised-purple/30">
          <TabsTrigger value="artworks" className="data-[state=active]:bg-bruised-purple/20">
            Artworks
          </TabsTrigger>
          <TabsTrigger value="artists" className="data-[state=active]:bg-bruised-purple/20">
            Artists
          </TabsTrigger>
        </TabsList>

        <TabsContent value="artworks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.length > 0 ? (
              artworks.map((artwork) => (
                <Card key={artwork.id} className="card-sorrowful overflow-hidden">
                  <div className="aspect-[3/2] relative">
                    <Image
                      src={artwork.image_url || "/placeholder.svg"}
                      alt={artwork.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-playfair font-light">{artwork.title}</CardTitle>
                    <CardDescription className="text-faded-white opacity-70">
                      {artwork.artist?.name || "Unknown Artist"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-faded-white opacity-70 line-clamp-2">
                      {artwork.description || "No description provided."}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full bg-red-900/50 hover:bg-red-900/70 border border-red-900/30"
                      onClick={() => setItemToDelete({ type: "artwork", id: artwork.id })}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete Artwork
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-faded-white opacity-70">No artworks found.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="artists" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.length > 0 ? (
              artists.map((artist) => (
                <Card key={artist.id} className="card-sorrowful">
                  <CardHeader>
                    <CardTitle className="text-xl font-playfair font-light">{artist.name}</CardTitle>
                    <CardDescription className="text-faded-white opacity-70">
                      {artworks.filter((a) => a.artist_id === artist.id).length} Artworks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-faded-white opacity-70">{artist.bio || "No biography provided."}</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full bg-red-900/50 hover:bg-red-900/70 border border-red-900/30"
                      onClick={() => setItemToDelete({ type: "artist", id: artist.id })}
                      disabled={artworks.some((a) => a.artist_id === artist.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete Artist
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-faded-white opacity-70">No artists found.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent className="bg-deep-blue/90 backdrop-blur-md border border-bruised-purple/30 text-faded-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-playfair font-light">
              {itemToDelete?.type === "artwork" ? "Delete Artwork" : "Delete Artist"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-faded-white opacity-70">
              {itemToDelete?.type === "artwork"
                ? "Are you sure you want to delete this artwork? This action cannot be undone."
                : "Are you sure you want to delete this artist? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError && (
            <div className="bg-red-900/20 text-red-400 p-3 rounded-md flex items-start gap-2 mb-4">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <span>{deleteError}</span>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-bruised-purple/30 text-faded-white hover:bg-deep-blue/50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-900/50 hover:bg-red-900/70 text-faded-white border border-red-900/30"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
