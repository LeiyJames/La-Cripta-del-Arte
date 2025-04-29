import { getArtworks, getArtists } from "@/app/actions"
import { AdminDashboard } from "./admin-dashboard"

export const revalidate = 0

export default async function AdminPage() {
  // Fetch data in parallel
  const [artworks, artists] = await Promise.all([getArtworks(), getArtists()])

  return <AdminDashboard initialArtworks={artworks} initialArtists={artists} />
}
