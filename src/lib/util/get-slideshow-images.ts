import { promises as fs } from "fs"
import path from "path"

/**
 * Get all slideshow images from the public/slideshow directory
 * Returns an array of image paths sorted alphabetically
 */
export async function getSlideshowImages(): Promise<string[]> {
  try {
    const slideshowDir = path.join(process.cwd(), "public", "slideshow")
    
    // Check if directory exists
    try {
      await fs.access(slideshowDir)
    } catch {
      console.warn("Slideshow directory not found. Falling back to default banner.")
      return []
    }

    // Read all files in the directory
    const files = await fs.readdir(slideshowDir)

    // Filter for image files and exclude README
    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"]
    const imageFiles = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase()
        return imageExtensions.includes(ext) && file.toLowerCase() !== "readme.md"
      })
      .sort() // Sort alphabetically
      .map((file) => `/slideshow/${file}`)

    return imageFiles
  } catch (error) {
    console.error("Error reading slideshow images:", error)
    return []
  }
}