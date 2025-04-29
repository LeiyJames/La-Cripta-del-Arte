import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-4">
      <h1 className="text-6xl font-bold text-electric-blue mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Artwork Not Found</h2>
      <p className="text-gray-400 max-w-md text-center mb-8">
        The artwork you're looking for seems to have been moved to another gallery or doesn't exist.
      </p>
      <Button asChild className="bg-electric-blue hover:bg-electric-blue/80">
        <Link href="/">Return to Gallery</Link>
      </Button>
    </div>
  )
}
