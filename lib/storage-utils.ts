export async function uploadArtworkImage(file: File) {
  // Create a FormData object to send the file
  const formData = new FormData()
  formData.append("file", file)

  // Send the file to our API route
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to upload file")
  }

  const data = await response.json()

  if (!data.success) {
    throw new Error(data.error || "Failed to upload file")
  }

  return {
    url: data.url,
    path: data.path,
  }
}

export async function deleteArtworkImage(path: string) {
  const response = await fetch(`/api/upload?path=${encodeURIComponent(path)}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to delete file")
  }

  const data = await response.json()

  if (!data.success) {
    throw new Error(data.error || "Failed to delete file")
  }

  return { success: true }
}
