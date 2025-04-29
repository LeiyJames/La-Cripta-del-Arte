"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const setupStorageBucket = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/setup-storage")
      const data = await response.json()

      setResult({
        success: data.success,
        message: data.message || (data.success ? "Storage bucket setup successful" : "Storage bucket setup failed"),
      })
    } catch (error) {
      setResult({
        success: false,
        message: "An error occurred while setting up the storage bucket",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Setup</CardTitle>
          <CardDescription className="text-gray-400">Set up your gallery's storage infrastructure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-gray-800 border border-gray-700">
            <h3 className="font-medium mb-2">Storage Bucket Setup</h3>
            <p className="text-sm text-gray-400 mb-4">
              Create a storage bucket for artwork images with proper permissions and file type restrictions.
            </p>

            {result && (
              <div
                className={`p-3 rounded-md mb-4 flex items-start gap-2 ${
                  result.success ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400"
                }`}
              >
                {result.success ? (
                  <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                )}
                <span>{result.message}</span>
              </div>
            )}

            <Button
              onClick={setupStorageBucket}
              disabled={isLoading}
              className="w-full bg-electric-blue hover:bg-electric-blue/80"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Set Up Storage Bucket"
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="border-t border-gray-800 pt-4">
          <p className="text-xs text-gray-500">
            This setup process only needs to be run once when setting up your gallery.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
