export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-electric-blue border-r-transparent border-b-magenta border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-white text-xl font-medium">Loading Gallery...</p>
      </div>
    </div>
  )
}
