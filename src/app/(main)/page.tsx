import { Metadata } from "next"
import Image from "next/image"
import { Suspense } from "react"

import BannerSlideshow from "@modules/home/components/banner-slideshow"
import HomepageProducts from "@modules/home/components/homepage-products"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { listCategories } from "@lib/data/categories"
import { getSlideshowImages } from "@lib/util/get-slideshow-images"
import { buildHomepageCategorySections } from "@lib/util/homepage-categories"

export const metadata: Metadata = {
  title: "ঐতিহ্যের সম্ভার - Premium Online Store",
  description: "Discover quality products at ঐতিহ্যের সম্ভার. Shop our complete collection with fast delivery.",
  openGraph: {
    title: "Oysom - ঐতিহ্যের সম্ভার",
    description: "Discover quality products at ঐতিহ্যের সম্ভার. Shop our complete collection with fast delivery.",
    url: "https://www.oysom.com",
    siteName: "Oysom - ঐতিহ্যের সম্ভার",
    type: "website",
    locale: "bn_BD",
    images: [
      {
        url: "https://www.oysom.com/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Oysom - ঐতিহ্যের সম্ভার",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oysom - ঐতিহ্যের সম্ভার",
    description: "Discover quality products at ঐতিহ্যের সম্ভার. Shop our complete collection with fast delivery.",
    images: ["https://www.oysom.com/logo.jpg"],
  },
}

export default async function HomePage() {
  const slideshowImages = await getSlideshowImages()

  let categorySections = buildHomepageCategorySections([])
  let allCategories: Awaited<ReturnType<typeof listCategories>> = []

  try {
    allCategories = (await listCategories()) ?? []
    categorySections = buildHomepageCategorySections(allCategories)
  } catch (error) {
    console.error("Error fetching categories:", error)
  }

  return (
    <>
      <section className="py-0">
        <div className="content-container px-4 sm:px-6">
          {slideshowImages.length > 0 ? (
            <BannerSlideshow images={slideshowImages} />
          ) : (
            <Image
              src="/banner.png"
              alt="ঐতিহ্যের সম্ভার"
              width={1600}
              height={900}
              className="w-full h-auto object-cover rounded-lg"
              priority
            />
          )}
        </div>
      </section>

      <Suspense fallback={<SkeletonProductGrid />}>
        <HomepageProducts
          categorySections={categorySections}
          allCategories={allCategories}
          countryCode="bd"
        />
      </Suspense>
    </>
  )
}
