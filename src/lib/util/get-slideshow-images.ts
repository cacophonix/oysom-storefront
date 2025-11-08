import { promises as fs } from "fs"
import path from "path"

export interface SlideshowImage {
  src: string
  link?: string
  alt: string
}

/**
 * Extract product slug from filename
 * Examples:
 * - banner-1-ghee.png → /products/ghee
 * - banner-3-mustard-oil.png → /products/mustard-oil
 * - banner-honey.jpg → /products/honey
 * - banner.png → undefined (no link)
 */
function extractLinkFromFilename(filename: string): string | undefined {
  // Remove extension
  const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|webp|gif)$/i, "")
  
  // Split by hyphens and underscores
  const parts = nameWithoutExt.split(/[-_]/)
  
  // Check if filename starts with "banner-NUMBER-" pattern (e.g., banner-1-, banner-2-, etc.)
  if (parts.length >= 3 && parts[0].toLowerCase() === "banner" && /^\d+$/.test(parts[1])) {
    // Skip "banner" and the number, take everything after
    const slug = parts.slice(2).join("-")
    if (slug && !/^\d+$/.test(slug)) {
      return `/products/${slug}`
    }
  }
  // Check if filename starts with "banner-" (without number)
  else if (parts.length >= 2 && parts[0].toLowerCase() === "banner") {
    // Skip "banner", take everything after
    const slug = parts.slice(1).join("-")
    if (slug && !/^\d+$/.test(slug)) {
      return `/products/${slug}`
    }
  }
  // For other patterns (slide, promo, etc.), skip first part if it's a common prefix
  else if (parts.length >= 2) {
    const firstPart = parts[0].toLowerCase()
    const skipFirst = /^(slide|promo|ad|\d+)$/.test(firstPart)
    
    const slug = skipFirst ? parts.slice(1).join("-") : parts.join("-")
    if (slug && !/^\d+$/.test(slug)) {
      return `/products/${slug}`
    }
  }
  
  return undefined
}

/**
 * Get all slideshow images from the public/slideshow directory
 * Returns an array of image objects with src, optional link, and alt text
 */
export async function getSlideshowImages(): Promise<SlideshowImage[]> {
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
      .map((file) => {
        const src = `/slideshow/${file}`
        const link = extractLinkFromFilename(file)
        const alt = file.replace(/\.(jpg|jpeg|png|webp|gif)$/i, "").replace(/[-_]/g, " ")
        
        return {
          src,
          link,
          alt,
        }
      })

    return imageFiles
  } catch (error) {
    console.error("Error reading slideshow images:", error)
    return []
  }
}